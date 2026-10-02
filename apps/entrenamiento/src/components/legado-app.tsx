"use client";

import { useEffect, useState } from "react";
import { ChatPanel } from "@/components/chat-panel";
import { MemoriesPanel } from "@/components/memories-panel";
import { SettingsDialog } from "@/components/settings-dialog";
import {
  loadMemories,
  loadMessages,
  loadSettings,
  saveMemories,
  saveMessages,
  saveSettings,
} from "@legado/shared";
import type { ChatMessage, Memory, Settings } from "@legado/shared";
import { DEFAULT_SETTINGS } from "@legado/shared";

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
    // Disco opcional; localStorage sigue siendo la red de seguridad del MVP.
  }
}

export function LegadoApp() {
  const [ready, setReady] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [tab, setTab] = useState<"memorias" | "chat">("memorias");

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
            const messagesNext = disk.messages ?? localMessages;
            const settingsNext = disk.settings ?? localSettings;
            setMemories(memoriesNext);
            setMessages(messagesNext);
            setSettings(settingsNext);
            saveMemories(memoriesNext);
            saveMessages(messagesNext);
            saveSettings(settingsNext);
            setReady(true);
            return;
          }
        }
      } catch {
        // fallback local
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

  function updateMemories(next: Memory[]) {
    setMemories(next);
    saveMemories(next);
    void persistDisk({ memories: next });
  }

  function updateMessages(next: ChatMessage[]) {
    setMessages(next);
    saveMessages(next);
    void persistDisk({ messages: next });
  }

  function updateSettings(next: Settings) {
    setSettings(next);
    saveSettings(next);
    void persistDisk({ settings: next });
  }

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="legado-empty max-w-sm rounded-2xl px-8 py-10 text-center">
          <p className="font-heading text-2xl text-[var(--legado-ink)]">
            Abriendo entrenamiento…
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Cargando memorias locales de este equipo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <header className="legado-hero mb-8 overflow-hidden rounded-[1.75rem] px-6 py-8 sm:px-10 sm:py-10">
        <div className="relative z-10 max-w-2xl">
          <p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
            Entrenamiento · Training
          </p>
          <p className="font-heading mt-2 text-4xl tracking-tight text-[var(--legado-ink)] sm:text-5xl">
            LEGADO
          </p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--legado-ink)]/80 sm:text-lg">
            Captura recuerdos, frases y conocimientos. Prueba la conversación
            antes de compartir el legado con tus hijos.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SettingsDialog
              settings={settings}
              memories={memories}
              onSave={updateSettings}
            />
            <span className="text-muted-foreground text-xs sm:text-sm">
              {memories.length}{" "}
              {memories.length === 1 ? "memoria" : "memorias"} · local-first
            </span>
          </div>
        </div>
      </header>

      <div className="mb-4 flex gap-2 lg:hidden">
        <button
          type="button"
          className={`legado-tab flex-1 ${tab === "memorias" ? "is-active" : ""}`}
          onClick={() => setTab("memorias")}
        >
          Memorias
        </button>
        <button
          type="button"
          className={`legado-tab flex-1 ${tab === "chat" ? "is-active" : ""}`}
          onClick={() => setTab("chat")}
        >
          Conversar
        </button>
      </div>

      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-2">
        <div
          className={`min-h-[28rem] ${tab === "memorias" ? "block" : "hidden"} lg:block`}
        >
          <MemoriesPanel memories={memories} onChange={updateMemories} />
        </div>
        <div
          className={`min-h-[28rem] ${tab === "chat" ? "block" : "hidden"} lg:block`}
        >
          <ChatPanel
            memories={memories}
            messages={messages}
            settings={settings}
            onMessagesChange={updateMessages}
          />
        </div>
      </div>
    </div>
  );
}
