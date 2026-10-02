"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createId } from "@legado/shared";
import {
  MEMORY_KIND_LABELS,
  type Memory,
  type MemoryKind,
} from "@legado/shared";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Props = {
  memories: Memory[];
  onChange: (memories: Memory[]) => void;
};

type Draft = {
  id?: string;
  kind: MemoryKind;
  title: string;
  content: string;
};

const emptyDraft = (): Draft => ({
  kind: "recuerdo",
  title: "",
  content: "",
});

export function MemoriesPanel({ memories, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setDraft(emptyDraft());
    setError(null);
    setOpen(true);
  }

  function openEdit(memory: Memory) {
    setDraft({
      id: memory.id,
      kind: memory.kind,
      title: memory.title,
      content: memory.content,
    });
    setError(null);
    setOpen(true);
  }

  function saveDraft() {
    const content = draft.content.trim();
    if (!content) {
      setError("Escribe el contenido de la memoria.");
      return;
    }
    const now = new Date().toISOString();
    if (draft.id) {
      onChange(
        memories.map((m) =>
          m.id === draft.id
            ? {
                ...m,
                kind: draft.kind,
                title: draft.title.trim(),
                content,
                updatedAt: now,
              }
            : m,
        ),
      );
    } else {
      const next: Memory = {
        id: createId("mem"),
        kind: draft.kind,
        title: draft.title.trim(),
        content,
        createdAt: now,
        updatedAt: now,
      };
      onChange([next, ...memories]);
    }
    setOpen(false);
  }

  function remove(id: string) {
    onChange(memories.filter((m) => m.id !== id));
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-3 px-1 pb-4">
        <div>
          <h2 className="font-heading text-2xl tracking-tight text-[var(--legado-ink)]">
            Memorias
          </h2>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Recuerdos, frases, fotos, eventos y conocimientos que alimentan la
            conversación.
          </p>
        </div>
        <Button size="sm" className="shrink-0 gap-1.5" onClick={openCreate}>
          <Plus className="size-4" />
          Nueva
        </Button>
      </div>

      {memories.length === 0 ? (
        <div className="legado-empty flex flex-1 flex-col items-center justify-center rounded-2xl px-6 py-12 text-center">
          <p className="font-heading text-xl text-[var(--legado-ink)]">
            Aún no hay memorias
          </p>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
            Escribe el primer recuerdo o una frase que quieras que tus hijos
            puedan escuchar algún día. El legado empieza con una sola línea.
          </p>
          <Button className="mt-6 gap-1.5" onClick={openCreate}>
            <Plus className="size-4" />
            Añadir la primera memoria
          </Button>
        </div>
      ) : (
        <ScrollArea className="min-h-0 flex-1 rounded-2xl border border-[var(--legado-line)] bg-[var(--legado-panel)]/70">
          <ul className="divide-y divide-[var(--legado-line)]">
            {memories.map((memory) => (
              <li
                key={memory.id}
                className="group px-4 py-4 transition-colors hover:bg-[var(--legado-mist)]/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="font-normal">
                        {MEMORY_KIND_LABELS[memory.kind]}
                      </Badge>
                      {memory.title ? (
                        <h3 className="truncate font-medium text-[var(--legado-ink)]">
                          {memory.title}
                        </h3>
                      ) : null}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap">
                      {memory.content}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Editar memoria"
                      onClick={() => openEdit(memory)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Eliminar memoria"
                      onClick={() => remove(memory.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {draft.id ? "Editar memoria" : "Nueva memoria"}
            </DialogTitle>
            <DialogDescription>
              Guarda un recuerdo, una frase, una foto, un evento o un
              conocimiento para que el chat pueda usarlo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select
                value={draft.kind}
                onValueChange={(value) =>
                  setDraft((d) => ({ ...d, kind: value as MemoryKind }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(MEMORY_KIND_LABELS) as MemoryKind[]).map(
                    (kind) => (
                      <SelectItem key={kind} value={kind}>
                        {MEMORY_KIND_LABELS[kind]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="memory-title">Título (opcional)</Label>
              <Input
                id="memory-title"
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
                placeholder="Ej. Consejo sobre el trabajo"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="memory-content">Contenido</Label>
              <Textarea
                id="memory-content"
                value={draft.content}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, content: e.target.value }))
                }
                placeholder="Escribe con tus palabras…"
                className="min-h-32"
              />
              {error ? (
                <p className="text-destructive text-sm" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveDraft}>Guardar memoria</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
