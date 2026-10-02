import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import type {
  ChatMessage,
  ImportJob,
  ImportSourceState,
  LegadoProfile,
  Memory,
  Settings,
} from "./types";
import {
  DEFAULT_PROFILE,
  DEFAULT_SETTINGS,
  defaultImportSourceStates,
} from "./types";

export type LegadoDiskData = {
  memories: Memory[];
  messages: ChatMessage[];
  settings: Settings;
  profile: LegadoProfile;
  importSources: ImportSourceState[];
  importJobs: ImportJob[];
};

const DEFAULT_DATA: LegadoDiskData = {
  memories: [],
  messages: [],
  settings: DEFAULT_SETTINGS,
  profile: DEFAULT_PROFILE,
  importSources: defaultImportSourceStates(),
  importJobs: [],
};

function dataPath(): string {
  const root =
    process.env.LEGADO_DATA_DIR ||
    path.join(process.cwd(), "..", "..", ".legado-data");
  mkdirSync(root, { recursive: true });
  return path.join(root, "store.json");
}

export function readDiskStore(): LegadoDiskData {
  const file = dataPath();
  if (!existsSync(file)) {
    return {
      ...DEFAULT_DATA,
      settings: { ...DEFAULT_SETTINGS },
      profile: { ...DEFAULT_PROFILE },
      importSources: defaultImportSourceStates(),
    };
  }
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as Partial<LegadoDiskData>;
    const settings = { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) };
    const profile = {
      ...DEFAULT_PROFILE,
      displayName:
        parsed.profile?.displayName ||
        settings.personName ||
        DEFAULT_PROFILE.displayName,
      ...(parsed.profile ?? {}),
    };
    const defaults = defaultImportSourceStates();
    const rawSources = Array.isArray(parsed.importSources)
      ? parsed.importSources
      : [];
    const importSources = defaults.map((d) => {
      const found = rawSources.find((r) => r.id === d.id);
      return found ? { ...d, ...found, id: d.id } : d;
    });
    return {
      memories: Array.isArray(parsed.memories) ? parsed.memories : [],
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      settings,
      profile,
      importSources,
      importJobs: Array.isArray(parsed.importJobs) ? parsed.importJobs : [],
    };
  } catch {
    return {
      ...DEFAULT_DATA,
      settings: { ...DEFAULT_SETTINGS },
      profile: { ...DEFAULT_PROFILE },
      importSources: defaultImportSourceStates(),
    };
  }
}

export function writeDiskStore(data: LegadoDiskData): void {
  writeFileSync(dataPath(), JSON.stringify(data, null, 2), "utf8");
}

export function patchDiskStore(patch: Partial<LegadoDiskData>): LegadoDiskData {
  const next = { ...readDiskStore(), ...patch };
  writeDiskStore(next);
  return next;
}
