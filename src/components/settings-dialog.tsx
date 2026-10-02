"use client";

import { useEffect, useMemo, useState } from "react";
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
import { downloadExport, buildExport } from "@/lib/storage";
import type { Memory, Settings } from "@/lib/types";
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

  const canUseApi = useMemo(
    () => draft.apiKey.trim().length > 0,
    [draft.apiKey],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" size="sm" className="gap-2" />}
      >
        <Settings2 className="size-4" />
        Ajustes
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustes del legado</DialogTitle>
          <DialogDescription>
            Nombre de la persona, modo de respuesta y respaldo local. Las
            memorias viven en este navegador.
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
            <Label htmlFor="apiKey">API key (opcional)</Label>
            <Input
              id="apiKey"
              type="password"
              autoComplete="off"
              value={draft.apiKey}
              onChange={(e) =>
                setDraft((s) => ({
                  ...s,
                  apiKey: e.target.value,
                  useApi: e.target.value.trim().length > 0 ? s.useApi : false,
                }))
              }
              placeholder="sk-… (OpenAI)"
            />
            <p className="text-muted-foreground text-xs leading-relaxed">
              Sin key, LEGADO responde en modo local con tus memorias. La key se
              guarda solo en este navegador y se usa desde tu máquina.
            </p>
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-border/80 bg-muted/40 px-3 py-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-[var(--legado-ink)]"
              checked={draft.useApi && canUseApi}
              disabled={!canUseApi}
              onChange={(e) =>
                setDraft((s) => ({ ...s, useApi: e.target.checked }))
              }
            />
            <span>
              <span className="font-medium text-foreground">
                Usar API cuando haya key
              </span>
              <span className="text-muted-foreground mt-0.5 block text-xs">
                Si falla la API, se cae al modo local automáticamente.
              </span>
            </span>
          </label>
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
                useApi: draft.useApi && draft.apiKey.trim().length > 0,
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
