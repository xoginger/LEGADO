import type { ChatMessage, LegadoExport, Memory, Settings } from "./types";
import { DEFAULT_SETTINGS } from "./types";

const MEMORIES_KEY = "legado.memories.v1";
const MESSAGES_KEY = "legado.messages.v1";
const SETTINGS_KEY = "legado.settings.v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadMemories(): Memory[] {
  if (typeof window === "undefined") return [];
  const data = safeParse<Memory[]>(localStorage.getItem(MEMORIES_KEY), []);
  return Array.isArray(data) ? data : [];
}

export function saveMemories(memories: Memory[]): void {
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
}

export function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const data = safeParse<ChatMessage[]>(localStorage.getItem(MESSAGES_KEY), []);
  return Array.isArray(data) ? data : [];
}

export function saveMessages(messages: ChatMessage[]): void {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  const raw = safeParse<
    Partial<Settings> & {
      apiKey?: string;
      useApi?: boolean;
    }
  >(localStorage.getItem(SETTINGS_KEY), {});

  const migrated: Settings = {
    ...DEFAULT_SETTINGS,
    personName: raw.personName ?? DEFAULT_SETTINGS.personName,
    provider: raw.provider ?? DEFAULT_SETTINGS.provider,
    ollamaBaseUrl: raw.ollamaBaseUrl ?? DEFAULT_SETTINGS.ollamaBaseUrl,
    ollamaModel: raw.ollamaModel ?? DEFAULT_SETTINGS.ollamaModel,
    openaiApiKey:
      raw.openaiApiKey ?? raw.apiKey ?? DEFAULT_SETTINGS.openaiApiKey,
  };

  if (!raw.provider && raw.useApi && (raw.openaiApiKey || raw.apiKey)) {
    migrated.provider = "openai";
  }

  return migrated;
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function buildExport(
  personName: string,
  memories: Memory[],
): LegadoExport {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    personName,
    memories,
  };
}

export function downloadExport(payload: LegadoExport): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `legado-${payload.personName.toLowerCase().replace(/\s+/g, "-") || "memorias"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function parseImport(raw: string): LegadoExport | null {
  try {
    const data = JSON.parse(raw) as LegadoExport;
    if (!data || !Array.isArray(data.memories)) return null;
    return data;
  } catch {
    return null;
  }
}
