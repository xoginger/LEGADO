"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ChatPanel } from "@/components/chat-panel";
import { FuentesPanel } from "@/components/fuentes-panel";
import { MemoriesPanel } from "@/components/memories-panel";
import { SettingsDialog } from "@/components/settings-dialog";
import { ThemeProvider } from "@/components/theme-provider";
import {
  applyTheme,
  defaultImportSourceStates,
  DEFAULT_PROFILE,
  loadImportJobs,
  loadImportSources,
  loadMemories,
  loadMessages,
  loadProfile,
  loadSettings,
  saveImportJobs,
  saveImportSources,
  saveMemories,
  saveMessages,
  saveProfile,
  saveSettings,
  saveThemeId,
} from "@legado/shared";
import type {
  ChatMessage,
  ImportJob,
  ImportSourceState,
  LegadoProfile,
  Memory,
  Settings,
} from "@legado/shared";
import { DEFAULT_SETTINGS } from "@legado/shared";

async function persistDisk(patch: {
  memories?: Memory[];
  messages?: ChatMessage[];
  settings?: Settings;
  profile?: LegadoProfile;
  importSources?: ImportSourceState[];
  importJobs?: ImportJob[];
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
  const [profile, setProfile] = useState<LegadoProfile>(DEFAULT_PROFILE);
  const [importSources, setImportSources] = useState<ImportSourceState[]>(
    defaultImportSourceStates(),
  );
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [tab, setTab] = useState<"memorias" | "fuentes" | "chat">("memorias");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    (async () => {
      const localMemories = loadMemories();
      const localMessages = loadMessages();
      const localSettings = loadSettings();
      const localProfile = loadProfile();
      const localSources = loadImportSources();
      const localJobs = loadImportJobs();
      try {
        const res = await fetch("/api/store", { signal: controller.signal });
        if (res.ok) {
          const disk = (await res.json()) as {
            memories?: Memory[];
            messages?: ChatMessage[];
            settings?: Settings;
            profile?: LegadoProfile;
            importSources?: ImportSourceState[];
            importJobs?: ImportJob[];
          };
          if (controller.signal.aborted) return;
          const memoriesNext =
            disk.memories && disk.memories.length > 0
              ? disk.memories
              : localMemories;
          const messagesNext = disk.messages ?? localMessages;
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
          // Sync personName ↔ profile displayName
          if (
            profileNext.displayName &&
            profileNext.displayName !== settingsNext.personName
          ) {
            settingsNext.personName = profileNext.displayName;
          }
          const sourcesNext =
            disk.importSources && disk.importSources.length > 0
              ? disk.importSources
              : localSources;
          const jobsNext = disk.importJobs ?? localJobs;
          setMemories(memoriesNext);
          setMessages(messagesNext);
          setSettings(settingsNext);
          setProfile(profileNext);
          setImportSources(sourcesNext);
          setImportJobs(jobsNext);
          saveMemories(memoriesNext);
          saveMessages(messagesNext);
          saveSettings(settingsNext);
          saveProfile(profileNext);
          saveImportSources(sourcesNext);
          saveImportJobs(jobsNext);
          applyTheme(settingsNext.themeId);
          setReady(true);
          return;
        }
      } catch {
        if (controller.signal.aborted) return;
        // fallback local
      }
      if (controller.signal.aborted) return;
      setMemories(localMemories);
      setMessages(localMessages);
      setSettings(localSettings);
      setProfile(localProfile);
      setImportSources(localSources);
      setImportJobs(localJobs);
      applyTheme(localSettings.themeId);
      setReady(true);
    })();
    return () => {
      clearTimeout(timeout);
      controller.abort();
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
    saveThemeId(next.themeId);
    applyTheme(next.themeId);
    // Keep profile name in sync when settings name changes
    if (next.personName !== profile.displayName) {
      const p = {
        ...profile,
        displayName: next.personName,
        updatedAt: new Date().toISOString(),
      };
      setProfile(p);
      saveProfile(p);
      void persistDisk({ settings: next, profile: p });
      return;
    }
    void persistDisk({ settings: next });
  }

  function updateProfile(next: LegadoProfile) {
    setProfile(next);
    saveProfile(next);
    const settingsNext = { ...settings, personName: next.displayName };
    setSettings(settingsNext);
    saveSettings(settingsNext);
    void persistDisk({ profile: next, settings: settingsNext });
  }

  function updateSources(next: ImportSourceState[]) {
    setImportSources(next);
    saveImportSources(next);
    void persistDisk({ importSources: next });
  }

  function updateJobs(next: ImportJob[]) {
    setImportJobs(next);
    saveImportJobs(next);
    void persistDisk({ importJobs: next });
  }

  if (!ready) {
    return (
      <ThemeProvider>
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
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider themeId={settings.themeId}>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-6 pb-8 sm:px-6 lg:px-8">
        <header className="legado-hero mb-8 overflow-hidden rounded-[1.75rem] px-6 py-8 sm:px-10 sm:py-10">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3">
              <BrandMark size={52} priority />
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
                  Entrenamiento · Training
                </p>
                <p className="font-heading text-4xl tracking-tight text-[var(--legado-ink)] sm:text-5xl">
                  LEGADO
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--legado-ink)]/80 sm:text-lg">
              Captura recuerdos, frases y conocimientos. Alimenta el perfil
              desde redes y álbumes. Prueba la conversación antes de compartir
              el legado.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <SettingsDialog
                settings={settings}
                memories={memories}
                onSave={updateSettings}
              />
              <span className="text-muted-foreground text-xs sm:text-sm">
                {profile.displayName} · {memories.length}{" "}
                {memories.length === 1 ? "memoria" : "memorias"} · local-first
              </span>
            </div>
          </div>
        </header>

        <div className="mb-4 flex gap-2 lg:hidden">
          {(
            [
              ["memorias", "Memorias"],
              ["fuentes", "Perfil"],
              ["chat", "Conversar"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`legado-tab flex-1 ${tab === id ? "is-active" : ""}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-4 hidden gap-2 lg:flex">
          {(
            [
              ["memorias", "Memorias"],
              ["fuentes", "Perfil / Fuentes"],
              ["chat", "Conversar"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`legado-tab ${tab === id ? "is-active" : ""}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 gap-6">
          <div
            className={`min-h-[28rem] ${tab === "memorias" ? "block" : "hidden"}`}
          >
            <MemoriesPanel memories={memories} onChange={updateMemories} />
          </div>
          <div
            className={`min-h-[28rem] ${tab === "fuentes" ? "block" : "hidden"}`}
          >
            <FuentesPanel
              profile={profile}
              sources={importSources}
              jobs={importJobs}
              memories={memories}
              onProfileChange={updateProfile}
              onSourcesChange={updateSources}
              onJobsChange={updateJobs}
              onMemoriesChange={updateMemories}
            />
          </div>
          <div
            className={`min-h-[28rem] ${tab === "chat" ? "block" : "hidden"}`}
          >
            <ChatPanel
              memories={memories}
              messages={messages}
              settings={settings}
              profile={profile}
              onMessagesChange={updateMessages}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
