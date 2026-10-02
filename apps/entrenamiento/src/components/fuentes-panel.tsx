"use client";

import { useMemo, useRef, useState } from "react";
import JSZip from "jszip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  createId,
  getImportSourceMeta,
  IMPORT_SOURCES,
  mergeImportedMemories,
  parseSocialExport,
  type ImportJob,
  type ImportSourceId,
  type ImportSourceMeta,
  type ImportSourceState,
  type LegadoProfile,
  type Memory,
  type TextFileMap,
} from "@legado/shared";
import {
  Camera,
  FolderOpen,
  Link2,
  LoaderCircle,
  Upload,
} from "lucide-react";

type Props = {
  profile: LegadoProfile;
  sources: ImportSourceState[];
  jobs: ImportJob[];
  memories: Memory[];
  onProfileChange: (profile: LegadoProfile) => void;
  onSourcesChange: (sources: ImportSourceState[]) => void;
  onJobsChange: (jobs: ImportJob[]) => void;
  onMemoriesChange: (memories: Memory[]) => void;
};

/** Etiqueta honesta: nunca «conectado a …» (OAuth es stub). */
function sourceStatusLabel(state: ImportSourceState): string {
  if (state.itemsImported > 0 || state.lastImportAt) {
    return "Importado";
  }
  // Estados legacy de la demo «Conectar» → no fingir conexión
  if (
    state.status === "mock_connected" ||
    state.status === "connected" ||
    state.status === "oauth_ready"
  ) {
    return "Listo para importar";
  }
  return "Sin importar";
}

function importButtonLabel(meta: ImportSourceMeta): string {
  return meta.authMode === "folder_export"
    ? "Importar carpeta"
    : "Importar archivo";
}

async function filesFromZip(file: File): Promise<TextFileMap> {
  const zip = await JSZip.loadAsync(file);
  const map: TextFileMap = {};
  const entries = Object.values(zip.files);
  for (const entry of entries) {
    if (entry.dir) continue;
    const name = entry.name;
    const lower = name.toLowerCase();
    // Textual / metadata; skip huge binaries
    if (
      lower.endsWith(".json") ||
      lower.endsWith(".js") ||
      lower.endsWith(".csv") ||
      lower.endsWith(".txt") ||
      lower.endsWith(".html")
    ) {
      map[name] = await entry.async("string");
    } else if (/\.(jpe?g|png|gif|webp|heic|tif{1,2})$/i.test(name)) {
      // Placeholder so Apple/Google parsers can register photo filenames
      map[name] = "";
    }
  }
  return map;
}

async function filesFromList(fileList: FileList | File[]): Promise<TextFileMap> {
  const map: TextFileMap = {};
  for (const file of Array.from(fileList)) {
    const name = (file as File & { webkitRelativePath?: string })
      .webkitRelativePath || file.name;
    const lower = file.name.toLowerCase();
    if (
      lower.endsWith(".json") ||
      lower.endsWith(".js") ||
      lower.endsWith(".csv") ||
      lower.endsWith(".txt")
    ) {
      map[name] = await file.text();
    } else if (/\.(jpe?g|png|gif|webp|heic|tif{1,2})$/i.test(file.name)) {
      map[name] = "";
    } else if (lower.endsWith(".zip")) {
      Object.assign(map, await filesFromZip(file));
    }
  }
  return map;
}

export function FuentesPanel({
  profile,
  sources,
  jobs,
  memories,
  onProfileChange,
  onSourcesChange,
  onJobsChange,
  onMemoriesChange,
}: Props) {
  const [draftName, setDraftName] = useState(profile.displayName);
  const [draftBio, setDraftBio] = useState(profile.bio);
  const [savingProfile, setSavingProfile] = useState(false);
  const [activeSource, setActiveSource] = useState<ImportSourceId | null>(null);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectModalId, setConnectModalId] = useState<ImportSourceId | null>(
    null,
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const memoryCounts = useMemo(() => {
    const foto = memories.filter((m) => m.kind === "foto").length;
    const frase = memories.filter(
      (m) => m.kind === "frase" || m.kind === "comentario",
    ).length;
    const evento = memories.filter((m) => m.kind === "evento").length;
    return { total: memories.length, foto, frase, evento };
  }, [memories]);

  const connectModalMeta = connectModalId
    ? getImportSourceMeta(connectModalId)
    : undefined;

  function saveProfileFields() {
    setSavingProfile(true);
    const next: LegadoProfile = {
      ...profile,
      displayName: draftName.trim() || "Yo",
      bio: draftBio.trim(),
      updatedAt: new Date().toISOString(),
    };
    onProfileChange(next);
    setSavingProfile(false);
    setBanner("Perfil guardado en este equipo.");
  }

  function onPickAvatar(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Elige una imagen para la foto de perfil.");
      return;
    }
    if (file.size > 2_500_000) {
      setError("Usa una foto de perfil menor a ~2.5 MB (queda en local).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      onProfileChange({
        ...profile,
        displayName: draftName.trim() || profile.displayName,
        bio: draftBio,
        photoDataUrl: dataUrl,
        updatedAt: new Date().toISOString(),
      });
      setBanner("Foto de perfil actualizada (solo local).");
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  function setSourceStatus(
    id: ImportSourceId,
    patch: Partial<ImportSourceState>,
  ) {
    onSourcesChange(
      sources.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  }

  function openImport(id: ImportSourceId) {
    setActiveSource(id);
    setError(null);
    setBanner(null);
    setConnectModalId(null);
    const meta = getImportSourceMeta(id);
    if (meta?.authMode === "folder_export") {
      folderRef.current?.click();
    } else {
      fileRef.current?.click();
    }
  }

  async function runImport(sourceId: ImportSourceId, fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const fileName =
      fileList.length === 1
        ? fileList[0].name
        : `${fileList.length} archivos`;
    const job: ImportJob = {
      id: createId("job"),
      sourceId,
      fileName,
      status: "queued",
      createdAt: new Date().toISOString(),
      finishedAt: null,
      itemsFound: 0,
      memoriesCreated: 0,
      error: null,
    };
    onJobsChange([job, ...jobs]);
    setBusy(true);
    setError(null);

    const parsing: ImportJob = { ...job, status: "parsing" };
    onJobsChange([parsing, ...jobs]);

    try {
      const first = fileList[0];
      let map: TextFileMap;
      if (fileList.length === 1 && first.name.toLowerCase().endsWith(".zip")) {
        map = await filesFromZip(first);
      } else if (
        fileList.length === 1 &&
        /\.(json|js|csv|txt)$/i.test(first.name)
      ) {
        map = { [first.name]: await first.text() };
      } else {
        map = await filesFromList(fileList);
      }

      if (Object.keys(map).length === 0) {
        throw new Error(
          "No se encontraron JSON/CSV/fotos reconocibles en el archivo. ¿Es un export oficial?",
        );
      }

      const items = parseSocialExport(sourceId, map);
      if (items.length === 0) {
        throw new Error(
          "El archivo se leyó, pero no extraje posts/fotos/eventos. Prueba otro export o el JSON de ejemplo de la docs.",
        );
      }

      const { memories: nextMemories, created } = mergeImportedMemories(
        memories,
        items,
      );
      onMemoriesChange(nextMemories);

      const done: ImportJob = {
        ...parsing,
        status: "done",
        finishedAt: new Date().toISOString(),
        itemsFound: items.length,
        memoriesCreated: created,
        error: null,
      };
      onJobsChange([done, ...jobs]);
      const prev = sources.find((s) => s.id === sourceId);
      setSourceStatus(sourceId, {
        lastImportAt: done.finishedAt,
        itemsImported: (prev?.itemsImported ?? 0) + created,
        // No fingir OAuth: el estado útil es el import, no «conectado».
        status: "disconnected",
        accountLabel: `import:${fileName}`,
      });
      setBanner(
        `Importados ${created} ítems de ${items.length} detectados → memorias del perfil.`,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Falló la importación.";
      const failed: ImportJob = {
        ...parsing,
        status: "error",
        finishedAt: new Date().toISOString(),
        error: message,
      };
      onJobsChange([failed, ...jobs]);
      setError(message);
    } finally {
      setBusy(false);
      setActiveSource(null);
      if (fileRef.current) fileRef.current.value = "";
      if (folderRef.current) folderRef.current.value = "";
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-col gap-6">
      <div className="px-1">
        <h2 className="font-heading text-2xl tracking-tight text-[var(--legado-ink)]">
          Perfil / Fuentes
        </h2>
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
          Crece el perfil del legado con fotos, frases y eventos importando el
          export oficial de cada red. Todo queda en este equipo (local-first).
          La conexión OAuth aún no está disponible.
        </p>
      </div>

      {/* Perfil */}
      <div className="rounded-2xl border border-[var(--legado-line)] bg-[var(--legado-panel)]/70 p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <button
            type="button"
            className="group relative mx-auto size-24 shrink-0 overflow-hidden rounded-full border border-[var(--legado-line)] bg-[var(--legado-mist)] sm:mx-0"
            onClick={() => photoRef.current?.click()}
            aria-label="Cambiar foto de perfil"
          >
            {profile.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photoDataUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground flex size-full items-center justify-center">
                <Camera className="size-7" />
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-black/45 py-0.5 text-center text-[10px] text-white opacity-0 transition group-hover:opacity-100">
              Cambiar
            </span>
          </button>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPickAvatar(f);
            }}
          />

          <div className="min-w-0 flex-1 space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="perfil-nombre">Nombre del legado</Label>
              <Input
                id="perfil-nombre"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Cómo te conocen en casa"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="perfil-bio">Bio</Label>
              <Textarea
                id="perfil-bio"
                value={draftBio}
                onChange={(e) => setDraftBio(e.target.value)}
                placeholder="Quién eres, qué te importa, cómo quieres que te recuerden…"
                className="min-h-20"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={saveProfileFields}
                disabled={savingProfile}
              >
                Guardar perfil
              </Button>
              <span className="text-muted-foreground text-xs">
                {memoryCounts.total} memorias · {memoryCounts.foto} fotos ·{" "}
                {memoryCounts.frase} frases · {memoryCounts.evento} eventos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fuentes: import principal */}
      <div>
        <h3 className="font-heading mb-1 text-lg text-[var(--legado-ink)]">
          Redes y álbumes
        </h3>
        <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
          Acción principal: importar el export oficial (ZIP, JSON o carpeta).
          «Conectar» es solo un aviso de que OAuth llega después.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {IMPORT_SOURCES.map((meta) => {
            const state = sources.find((s) => s.id === meta.id) ?? {
              id: meta.id,
              status: "disconnected" as const,
              accountLabel: "",
              lastImportAt: null,
              itemsImported: 0,
            };
            const importing = busy && activeSource === meta.id;
            const showsOauthSoon = meta.authMode === "oauth_stub";
            return (
              <li
                key={meta.id}
                className="rounded-2xl border border-[var(--legado-line)] bg-[var(--legado-panel)]/60 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-[var(--legado-ink)]">
                      {meta.label}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      {meta.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 font-normal">
                    {sourceStatusLabel(state)}
                  </Badge>
                </div>
                {state.itemsImported > 0 || state.lastImportAt ? (
                  <p className="text-muted-foreground mt-2 truncate text-xs">
                    {state.itemsImported
                      ? `${state.itemsImported} ítems en memorias`
                      : "Último import registrado"}
                    {state.accountLabel?.startsWith("import:")
                      ? ` · ${state.accountLabel.replace(/^import:/, "")}`
                      : ""}
                  </p>
                ) : null}
                <div className="mt-3 rounded-xl border border-[var(--legado-line)]/80 bg-[var(--legado-mist)]/40 px-3 py-2">
                  <p className="text-[11px] font-medium text-[var(--legado-ink)]">
                    Cómo pedir el export
                  </p>
                  <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
                    {meta.exportHint}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => openImport(meta.id)}
                    disabled={busy}
                  >
                    {importing ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : meta.authMode === "folder_export" ? (
                      <FolderOpen className="size-3.5" />
                    ) : (
                      <Upload className="size-3.5" />
                    )}
                    {importButtonLabel(meta)}
                  </Button>
                  {showsOauthSoon ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => setConnectModalId(meta.id)}
                      disabled={busy}
                    >
                      <Link2 className="size-3.5" />
                      Conectar (próximamente)
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      disabled
                      title="Apple Fotos no usa OAuth; importa la carpeta o el ZIP exportado."
                    >
                      <Link2 className="size-3.5" />
                      Sin conexión online
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept=".zip,.json,.js,.csv,application/zip,application/json,text/csv,image/*"
        onChange={(e) => {
          if (activeSource) void runImport(activeSource, e.target.files);
        }}
      />
      <input
        ref={folderRef}
        type="file"
        className="hidden"
        multiple
        {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
        onChange={(e) => {
          if (activeSource) void runImport(activeSource, e.target.files);
        }}
      />

      <Dialog
        open={connectModalId !== null}
        onOpenChange={(open) => {
          if (!open) setConnectModalId(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Conectar {connectModalMeta?.label ?? "fuente"} (próximamente)
            </DialogTitle>
            <DialogDescription>
              LEGADO aún no inicia sesión en {connectModalMeta?.label ?? "esta red"}.
              No hay OAuth real en este equipo: un clic aquí no vincula tu cuenta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-[var(--legado-ink)]/90">
            <p>
              Para alimentar el perfil ahora, pide el{" "}
              <strong className="font-medium">export oficial</strong> y usa{" "}
              <strong className="font-medium">
                {connectModalMeta
                  ? importButtonLabel(connectModalMeta)
                  : "Importar archivo"}
              </strong>
              .
            </p>
            {connectModalMeta ? (
              <p className="text-muted-foreground text-xs leading-relaxed">
                {connectModalMeta.exportHint}
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConnectModalId(null)}
            >
              Entendido
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              disabled={!connectModalId || busy}
              onClick={() => {
                if (connectModalId) openImport(connectModalId);
              }}
            >
              {connectModalMeta?.authMode === "folder_export" ? (
                <FolderOpen className="size-3.5" />
              ) : (
                <Upload className="size-3.5" />
              )}
              {connectModalMeta
                ? importButtonLabel(connectModalMeta)
                : "Importar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cola */}
      <div className="min-h-0 flex-1">
        <h3 className="font-heading mb-3 text-lg text-[var(--legado-ink)]">
          Cola de importación
        </h3>
        {jobs.length === 0 ? (
          <div className="legado-empty rounded-2xl px-6 py-10 text-center">
            <p className="font-heading text-lg text-[var(--legado-ink)]">
              Sin importaciones aún
            </p>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-relaxed">
              Elige una fuente y usa{" "}
              <span className="text-[var(--legado-ink)]">Importar archivo</span>{" "}
              o{" "}
              <span className="text-[var(--legado-ink)]">Importar carpeta</span>{" "}
              con el export oficial. Los ítems se normalizan a memorias: frase,
              foto o evento.
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-64 rounded-2xl border border-[var(--legado-line)] bg-[var(--legado-panel)]/70">
            <ul className="divide-y divide-[var(--legado-line)]">
              {jobs.map((job) => {
                const label =
                  getImportSourceMeta(job.sourceId)?.label ?? job.sourceId;
                return (
                  <li key={job.id} className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          job.status === "error"
                            ? "destructive"
                            : job.status === "done"
                              ? "secondary"
                              : "outline"
                        }
                        className="font-normal"
                      >
                        {job.status === "parsing" || job.status === "queued"
                          ? "Cargando"
                          : job.status === "done"
                            ? "Listo"
                            : job.status === "error"
                              ? "Error"
                              : job.status}
                      </Badge>
                      <span className="font-medium text-[var(--legado-ink)]">
                        {label}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {job.fileName}
                      </span>
                    </div>
                    {job.status === "done" ? (
                      <p className="text-muted-foreground mt-1 text-xs">
                        {job.itemsFound} detectados · {job.memoriesCreated}{" "}
                        memorias nuevas
                      </p>
                    ) : null}
                    {job.status === "error" && job.error ? (
                      <p className="text-destructive mt-1 text-xs" role="alert">
                        {job.error}
                      </p>
                    ) : null}
                    {(job.status === "parsing" || job.status === "queued") && (
                      <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                        <LoaderCircle className="size-3 animate-spin" />
                        Leyendo export en local…
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}
      </div>

      {banner ? (
        <p className="text-xs text-[var(--legado-ink)]/80" role="status">
          {banner}
        </p>
      ) : null}
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
