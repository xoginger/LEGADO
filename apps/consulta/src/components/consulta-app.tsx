"use client";

import { useEffect, useRef, useState } from "react";
import { ChatPanel } from "@/components/chat-panel";
import { Button } from "@/components/ui/button";
import {
  loadMemories,
  loadMessages,
  loadSettings,
  parseImport,
  saveMemories,
  saveMessages,
  saveSettings,
} from "@legado/shared";
import type { ChatMessage, Memory, Settings } from "@legado/shared";
import { DEFAULT_SETTINGS } from "@legado/shared";
import { Upload } from "lucide-react";

async function persistDisk(patch: {
  memories?: Memory[];
  messages?: ChatMessage[];
  settings?: Settings;
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

export function ConsultaApp() {
  const [ready, setReady] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const localMemories = loadMemories();
      const localMessages = loadMessages();
      const localSettings = loadSettings();
      try {
        const res = await fetch("/api/store");
        if (res.ok) {
          const disk = (await res.json()) as {
            memories?: Memory[];
            messages?: ChatMessage[];
            settings?: Settings;
          };
          if (!cancelled) {
            const memoriesNext =
              disk.memories && disk.memories.length > 0
                ? disk.memories
                : localMemories;
            setMemories(memoriesNext);
            setMessages(disk.messages ?? localMessages);
            setSettings(disk.settings ?? localSettings);
            saveMemories(memoriesNext);
            saveMessages(disk.messages ?? localMessages);
            saveSettings(disk.settings ?? localSettings);
            setReady(true);
            return;
          }
        }
      } catch {
        // fallback
      }
      if (!cancelled) {
        setMemories(localMemories);
        setMessages(localMessages);
        setSettings(localSettings);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateMessages(next: ChatMessage[]) {
    setMessages(next);
    saveMessages(next);
    void persistDisk({ messages: next });
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
    const nextSettings = {
      ...settings,
      personName: data.personName || settings.personName,
    };
    setSettings(nextSettings);
    saveSettings(nextSettings);
    void persistDisk({ memories: data.memories, settings: nextSettings });
  }

  if (!ready) {
    return (
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
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-8 pt-6 sm:px-6">
      <header className="legado-hero mb-8 overflow-hidden rounded-[1.75rem] px-6 py-8 sm:px-10 sm:py-10">
        <div className="relative z-10">
          <p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
            Consulta · Legacy interface
          </p>
          <p className="font-heading mt-2 text-4xl tracking-tight text-[var(--legado-ink)] sm:text-5xl">
            LEGADO
          </p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--legado-ink)]/80 sm:text-lg">
            Habla con la presencia de{" "}
            <span className="font-medium">{settings.personName}</span>. Aquí no
            se editan memorias: solo se consulta el legado.
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
          onMessagesChange={updateMessages}
        />
      </div>
    </div>
  );
}
