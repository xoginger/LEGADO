import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { ChatMessage, Memory, Settings } from "./types";
import { DEFAULT_SETTINGS } from "./types";

export type LegadoDiskData = {
  memories: Memory[];
  messages: ChatMessage[];
  settings: Settings;
};

const DEFAULT_DATA: LegadoDiskData = {
  memories: [],
  messages: [],
  settings: DEFAULT_SETTINGS,
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
  if (!existsSync(file)) return { ...DEFAULT_DATA, settings: { ...DEFAULT_SETTINGS } };
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as Partial<LegadoDiskData>;
    return {
      memories: Array.isArray(parsed.memories) ? parsed.memories : [],
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
    };
  } catch {
    return { ...DEFAULT_DATA, settings: { ...DEFAULT_SETTINGS } };
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
