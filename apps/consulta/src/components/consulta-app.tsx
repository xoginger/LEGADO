"use client";

import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ChatPanel } from "@/components/chat-panel";
import { ThemePicker } from "@/components/theme-picker";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  applyTheme,
  DEFAULT_PROFILE,
  loadMemories,
  loadMessages,
  loadProfile,
  loadSettings,
  parseImport,
  saveMemories,
  saveMessages,
  saveProfile,
  saveSettings,
  saveThemeId,
} from "@legado/shared";
import type {
  ChatMessage,
  LegadoProfile,
  Memory,
  Settings,
  ThemeId,
} from "@legado/shared";
import { DEFAULT_SETTINGS } from "@legado/shared";
import { BookOpen, Palette, Upload } from "lucide-react";

async function persistDisk(patch: {
  memories?: Memory[];
  messages?: ChatMessage[];
  settings?: Settings;
  profile?: LegadoProfile;
}) {
  try {
    await fetch("/api/store", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  } catch {
    // ignore
  }
}

function ThemeDialog({
  themeId,
  onChange,
}: {
  themeId: ThemeId;
  onChange: (themeId: ThemeId) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(themeId);

  useEffect(() => {
    if (open) setDraft(themeId);
  }, [open, themeId]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) applyTheme(themeId);
      }}
    >
      <DialogTrigger
        render={<Button variant="outline" size="sm" className="gap-2" />}
      >
        <Palette className="size-4" />
        Tema
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Apariencia</DialogTitle>
          <DialogDescription>
            Elige un skin. Se guarda en este navegador y lo comparte
            Entrenamiento.
          </DialogDescription>
        </DialogHeader>
        <ThemePicker
          value={draft}
          onChange={(id) => {
            setDraft(id);
            applyTheme(id);
          }}
        />
        <a
          href="https://github.com/xoginger/LEGADO/blob/main/docs/es/uso.md"
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-xs underline-offset-4 hover:underline"
        >
          <BookOpen className="size-3.5" />
          Ver guía de uso
        </a>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              onChange(draft);
              setOpen(false);
            }}
          >
            Guardar tema
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConsultaApp() {
  const [ready, setReady] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [profile, setProfile] = useState<LegadoProfile>(DEFAULT_PROFILE);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const localMemories = loadMemories();
      const localMessages = loadMessages();
      const localSettings = loadSettings();
      const localProfile = loadProfile();
      try {
        const res = await fetch("/api/store", { signal: controller.signal });
        if (res.ok) {
          const disk = (await res.json()) as {
            memories?: Memory[];
            messages?: ChatMessage[];
            settings?: Settings;
            profile?: LegadoProfile;
          };
          if (controller.signal.aborted) return;
          const memoriesNext =
            disk.memories && disk.memories.length > 0
              ? disk.memories
              : localMemories;
          const settingsNext = {
            ...DEFAULT_SETTINGS,
            ...localSettings,
            ...(disk.settings ?? {}),
            themeId:
              disk.settings?.themeId ??
              localSettings.themeId ??
              DEFAULT_SETTINGS.themeId,
          };
          const profileNext = {
            ...DEFAULT_PROFILE,
            ...localProfile,
            ...(disk.profile ?? {}),
            displayName:
              disk.profile?.displayName ||
              localProfile.displayName ||
              settingsNext.personName,
          };
          if (profileNext.displayName) {
            settingsNext.personName = profileNext.displayName;
          }
          setMemories(memoriesNext);
          setMessages(disk.messages ?? localMessages);
          setSettings(settingsNext);
          setProfile(profileNext);
          saveMemories(memoriesNext);
          saveMessages(disk.messages ?? localMessages);
          saveSettings(settingsNext);
          saveProfile(profileNext);
          applyTheme(settingsNext.themeId);
          setReady(true);
          return;
        }
      } catch {
        if (controller.signal.aborted) return;
        // fallback
      }
      if (controller.signal.aborted) return;
      setMemories(localMemories);
      setMessages(localMessages);
      setSettings(localSettings);
      setProfile(localProfile);
      applyTheme(localSettings.themeId);
      setReady(true);
    })();
    return () => {
      controller.abort();
    };
  }, []);

  function updateMessages(next: ChatMessage[]) {
    setMessages(next);
    saveMessages(next);
    void persistDisk({ messages: next });
  }

  function updateTheme(themeId: ThemeId) {
    const next = { ...settings, themeId };
    setSettings(next);
    saveSettings(next);
    saveThemeId(themeId);
    applyTheme(themeId);
    void persistDisk({ settings: next });
  }

  async function onImportFile(file: File) {
    setImportError(null);
    const text = await file.text();
    const data = parseImport(text);
    if (!data) {
      setImportError("El archivo no parece un export de LEGADO válido.");
      return;
    }
    setMemories(data.memories);
    saveMemories(data.memories);
    const profileNext: LegadoProfile = data.profile
      ? { ...DEFAULT_PROFILE, ...data.profile }
      : {
          ...profile,
          displayName: data.personName || profile.displayName,
          updatedAt: new Date().toISOString(),
        };
    setProfile(profileNext);
    saveProfile(profileNext);
    const nextSettings = {
      ...settings,
      personName: profileNext.displayName || data.personName || settings.personName,
    };
    setSettings(nextSettings);
    saveSettings(nextSettings);
    void persistDisk({
      memories: data.memories,
      settings: nextSettings,
      profile: profileNext,
    });
  }

  if (!ready) {
    return (
      <ThemeProvider>
        <div className="flex flex-1 items-center justify-center px-6 py-24">
          <div className="legado-empty max-w-sm rounded-2xl px-8 py-10 text-center">
            <p className="font-heading text-2xl text-[var(--legado-ink)]">
              Abriendo consulta…
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Preparando el legado para conversar.
            </p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider themeId={settings.themeId}>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pt-6 pb-8 sm:px-6">
        <header className="legado-hero mb-8 overflow-hidden rounded-[1.75rem] px-6 py-8 sm:px-10 sm:py-10">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <BrandMark size={52} priority />
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
                  Consulta · Legacy interface
                </p>
                <p className="font-heading text-4xl tracking-tight text-[var(--legado-ink)] sm:text-5xl">
                  LEGADO
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--legado-ink)]/80 sm:text-lg">
              Habla con la presencia de{" "}
              <span className="font-medium">
                {profile.displayName || settings.personName}
              </span>
              . Aquí no se editan memorias: solo se consulta el legado (perfil
              incluido).
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onImportFile(file);
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="size-4" />
                Importar JSON
              </Button>
              <ThemeDialog
                themeId={settings.themeId}
                onChange={updateTheme}
              />
              <span className="text-muted-foreground text-xs sm:text-sm">
                {memories.length}{" "}
                {memories.length === 1 ? "memoria" : "memorias"} disponibles
              </span>
            </div>
            {importError ? (
              <p className="text-destructive mt-3 text-sm" role="alert">
                {importError}
              </p>
            ) : null}
          </div>
        </header>

        <div className="min-h-[28rem] flex-1">
          <ChatPanel
            memories={memories}
            messages={messages}
            settings={settings}
            profile={profile}
            onMessagesChange={updateMessages}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
