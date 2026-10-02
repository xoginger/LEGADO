"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadExport, buildExport } from "@legado/shared";
import {
  LLM_PROVIDER_LABELS,
  type LlmProvider,
  type Memory,
  type Settings,
} from "@legado/shared";
import { Settings2 } from "lucide-react";

type Props = {
  settings: Settings;
  memories: Memory[];
  onSave: (settings: Settings) => void;
};

export function SettingsDialog({ settings, memories, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(settings);

  useEffect(() => {
    if (open) setDraft(settings);
  }, [open, settings]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" size="sm" className="gap-2" />}
      >
        <Settings2 className="size-4" />
        Ajustes
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajustes del legado</DialogTitle>
          <DialogDescription>
            Local-first: memorias en este navegador y modelo en tu máquina
            (Ollama). El mock cubre si aún no hay runtime.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="personName">Nombre de la persona</Label>
            <Input
              id="personName"
              value={draft.personName}
              onChange={(e) =>
                setDraft((s) => ({ ...s, personName: e.target.value }))
              }
              placeholder="Ej. Xocotzin"
            />
          </div>

          <div className="grid gap-2">
            <Label>Motor de respuesta</Label>
            <Select
              value={draft.provider}
              onValueChange={(value) => {
                if (!value) return;
                setDraft((s) => ({ ...s, provider: value as LlmProvider }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(LLM_PROVIDER_LABELS) as LlmProvider[]).map(
                  (provider) => (
                    <SelectItem key={provider} value={provider}>
                      {LLM_PROVIDER_LABELS[provider]}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {draft.provider === "ollama" ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="ollamaUrl">URL de Ollama</Label>
                <Input
                  id="ollamaUrl"
                  value={draft.ollamaBaseUrl}
                  onChange={(e) =>
                    setDraft((s) => ({ ...s, ollamaBaseUrl: e.target.value }))
                  }
                  placeholder="http://127.0.0.1:11434"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ollamaModel">Modelo</Label>
                <Input
                  id="ollamaModel"
                  value={draft.ollamaModel}
                  onChange={(e) =>
                    setDraft((s) => ({ ...s, ollamaModel: e.target.value }))
                  }
                  placeholder="llama3.2"
                />
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Ejemplo: <code>ollama pull llama3.2</code>. Si Ollama no está
                  disponible, LEGADO cae al mock automáticamente. MLX u otros
                  runtimes locales pueden exponerse con API compatible.
                </p>
              </div>
            </>
          ) : null}

          {draft.provider === "openai" ? (
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API key cloud (escape hatch)</Label>
              <Input
                id="apiKey"
                type="password"
                autoComplete="off"
                value={draft.openaiApiKey}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, openaiApiKey: e.target.value }))
                }
                placeholder="sk-…"
              />
              <p className="text-muted-foreground text-xs leading-relaxed">
                No es el camino local-first. Solo si lo necesitas temporalmente;
                la key queda en este navegador.
              </p>
            </div>
          ) : null}

          {draft.provider === "mock" ? (
            <p className="text-muted-foreground rounded-lg border border-border/80 bg-muted/40 px-3 py-3 text-xs leading-relaxed">
              El mock responde solo con tus memorias escritas, sin llamar a
              ningún modelo. Ideal mientras eliges o instalas el equipo.
            </p>
          ) : null}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={memories.length === 0}
            onClick={() =>
              downloadExport(buildExport(draft.personName || "Yo", memories))
            }
          >
            Exportar memorias (JSON)
          </Button>
          <Button
            type="button"
            onClick={() => {
              onSave({
                ...draft,
                personName: draft.personName.trim() || "Yo",
                ollamaBaseUrl:
                  draft.ollamaBaseUrl.trim() || "http://127.0.0.1:11434",
                ollamaModel: draft.ollamaModel.trim() || "llama3.2",
              });
              setOpen(false);
            }}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
