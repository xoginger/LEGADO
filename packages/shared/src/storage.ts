import type {
  ChatMessage,
  ImportJob,
  ImportSourceState,
  LegadoExport,
  LegadoProfile,
  Memory,
  Settings,
} from "./types";
import {
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
  defaultImportSourceStates,
} from "./types";
import {
  DEFAULT_THEME_ID,
  isThemeId,
  loadThemeId,
  saveThemeId,
} from "./themes";

const MEMORIES_KEY = "legado.memories.v1";
const MESSAGES_KEY = "legado.messages.v1";
const SETTINGS_KEY = "legado.settings.v1";
const PROFILE_KEY = "legado.profile.v1";
const IMPORT_SOURCES_KEY = "legado.importSources.v1";
const IMPORT_JOBS_KEY = "legado.importJobs.v1";

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

  const themeFromSettings = isThemeId(raw.themeId) ? raw.themeId : null;
  const themeId = themeFromSettings ?? loadThemeId() ?? DEFAULT_THEME_ID;

  const migrated: Settings = {
    ...DEFAULT_SETTINGS,
    personName: raw.personName ?? DEFAULT_SETTINGS.personName,
    provider: raw.provider ?? DEFAULT_SETTINGS.provider,
    ollamaBaseUrl: raw.ollamaBaseUrl ?? DEFAULT_SETTINGS.ollamaBaseUrl,
    ollamaModel: raw.ollamaModel ?? DEFAULT_SETTINGS.ollamaModel,
    openaiApiKey:
      raw.openaiApiKey ?? raw.apiKey ?? DEFAULT_SETTINGS.openaiApiKey,
    themeId,
  };

  if (!raw.provider && raw.useApi && (raw.openaiApiKey || raw.apiKey)) {
    migrated.provider = "openai";
  }

  return migrated;
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  if (isThemeId(settings.themeId)) {
    saveThemeId(settings.themeId);
  }
}

export function loadProfile(): LegadoProfile {
  if (typeof window === "undefined") return { ...DEFAULT_PROFILE };
  const raw = safeParse<Partial<LegadoProfile>>(
    localStorage.getItem(PROFILE_KEY),
    {},
  );
  const settings = loadSettings();
  return {
    displayName:
      raw.displayName?.trim() ||
      settings.personName ||
      DEFAULT_PROFILE.displayName,
    bio: raw.bio ?? "",
    photoDataUrl: raw.photoDataUrl ?? "",
    updatedAt: raw.updatedAt ?? DEFAULT_PROFILE.updatedAt,
  };
}

export function saveProfile(profile: LegadoProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadImportSources(): ImportSourceState[] {
  if (typeof window === "undefined") return defaultImportSourceStates();
  const raw = safeParse<ImportSourceState[]>(
    localStorage.getItem(IMPORT_SOURCES_KEY),
    [],
  );
  const defaults = defaultImportSourceStates();
  if (!Array.isArray(raw) || raw.length === 0) return defaults;
  return defaults.map((d) => {
    const found = raw.find((r) => r.id === d.id);
    return found ? { ...d, ...found, id: d.id } : d;
  });
}

export function saveImportSources(sources: ImportSourceState[]): void {
  localStorage.setItem(IMPORT_SOURCES_KEY, JSON.stringify(sources));
}

export function loadImportJobs(): ImportJob[] {
  if (typeof window === "undefined") return [];
  const data = safeParse<ImportJob[]>(
    localStorage.getItem(IMPORT_JOBS_KEY),
    [],
  );
  return Array.isArray(data) ? data : [];
}

export function saveImportJobs(jobs: ImportJob[]): void {
  // Keep last 40 jobs
  localStorage.setItem(IMPORT_JOBS_KEY, JSON.stringify(jobs.slice(0, 40)));
}

export function buildExport(
  personName: string,
  memories: Memory[],
  profile?: LegadoProfile,
): LegadoExport {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    personName,
    memories,
    ...(profile ? { profile } : {}),
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
