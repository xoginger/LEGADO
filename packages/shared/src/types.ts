import type { ThemeId } from "./themes";
import { DEFAULT_THEME_ID } from "./themes";

export type MemoryKind =
  | "recuerdo"
  | "frase"
  | "comentario"
  | "conocimiento"
  | "foto"
  | "evento";

export const MEMORY_KIND_LABELS: Record<MemoryKind, string> = {
  recuerdo: "Recuerdo",
  frase: "Frase",
  comentario: "Comentario",
  conocimiento: "Conocimiento",
  foto: "Foto",
  evento: "Evento",
};

export interface Memory {
  id: string;
  kind: MemoryKind;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  /** Origen de importación social, si aplica. */
  sourceId?: ImportSourceId;
  /** Id del ítem importado (dedupe). */
  importItemId?: string;
}

export type ChatRole = "user" | "assistant";

export type ChatSource = "mock" | "ollama" | "openai";

export type LlmProvider = "mock" | "ollama" | "openai";

export const LLM_PROVIDER_LABELS: Record<LlmProvider, string> = {
  mock: "Mock local (sin modelo)",
  ollama: "Ollama / runtime local",
  openai: "API cloud (opcional)",
};

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  source?: ChatSource;
}

/** Perfil del legado (nombre, bio, foto) — alimenta chat y UI. */
export interface LegadoProfile {
  displayName: string;
  bio: string;
  /** Data URL local (base64) o vacío. Nunca se sube a nube. */
  photoDataUrl: string;
  updatedAt: string;
}

export const DEFAULT_PROFILE: LegadoProfile = {
  displayName: "Yo",
  bio: "",
  photoDataUrl: "",
  updatedAt: new Date(0).toISOString(),
};

/** Fuentes sociales confirmadas para alimentar el perfil. */
export type ImportSourceId =
  | "instagram"
  | "facebook"
  | "x"
  | "google_photos"
  | "apple_photos";

export type ImportConnectionStatus =
  | "disconnected"
  | "mock_connected"
  | "oauth_ready"
  | "connected";

export type ImportAuthMode = "oauth_stub" | "file_export" | "folder_export";

export interface ImportSourceMeta {
  id: ImportSourceId;
  label: string;
  shortLabel: string;
  description: string;
  authMode: ImportAuthMode;
  /** Extensiones / hints para el selector de archivo. */
  accept: string;
  /** Cómo pedir el export oficial. */
  exportHint: string;
  oauthEnvVars?: string[];
}

export const IMPORT_SOURCES: ImportSourceMeta[] = [
  {
    id: "instagram",
    label: "Instagram",
    shortLabel: "IG",
    description:
      "Fotos, captions y posts. Importa el ZIP/JSON de tu descarga de datos de Meta.",
    authMode: "oauth_stub",
    accept: ".zip,.json,application/zip,application/json",
    exportHint:
      "Instagram → Configuración → Tu actividad → Descargar información (JSON o ZIP).",
    oauthEnvVars: ["LEGADO_META_APP_ID", "LEGADO_META_APP_SECRET"],
  },
  {
    id: "facebook",
    label: "Facebook",
    shortLabel: "FB",
    description:
      "Publicaciones, fotos y eventos. Importa el export oficial de Meta (ZIP/JSON).",
    authMode: "oauth_stub",
    accept: ".zip,.json,application/zip,application/json",
    exportHint:
      "Facebook → Configuración → Tu información → Descargar tu información (JSON).",
    oauthEnvVars: ["LEGADO_META_APP_ID", "LEGADO_META_APP_SECRET"],
  },
  {
    id: "x",
    label: "X (Twitter)",
    shortLabel: "X",
    description:
      "Tweets y frases. Importa el archivo de tu archivo de X (JS/JSON/CSV/ZIP).",
    authMode: "oauth_stub",
    accept: ".zip,.json,.js,.csv,application/zip,application/json,text/csv",
    exportHint:
      "X → Ajustes → Tu cuenta → Descargar un archivo de tus datos.",
    oauthEnvVars: ["LEGADO_X_CLIENT_ID", "LEGADO_X_CLIENT_SECRET"],
  },
  {
    id: "google_photos",
    label: "Google Fotos",
    shortLabel: "Google",
    description:
      "Álbumes y captions vía Google Takeout (ZIP/JSON). Sin login de Google por ahora.",
    authMode: "oauth_stub",
    accept: ".zip,.json,application/zip,application/json",
    exportHint:
      "takeout.google.com → Google Fotos → exportar ZIP (JSON de metadatos junto a las imágenes).",
    oauthEnvVars: [
      "LEGADO_GOOGLE_CLIENT_ID",
      "LEGADO_GOOGLE_CLIENT_SECRET",
    ],
  },
  {
    id: "apple_photos",
    label: "Apple Fotos",
    shortLabel: "Apple",
    description:
      "Álbum o carpeta exportada desde Fotos (macOS). Solo import local; sin login online.",
    authMode: "folder_export",
    accept: "image/*,.json,.zip,application/zip,application/json",
    exportHint:
      "Fotos (Mac) → selecciona álbum → Archivo → Exportar → Exportar fotos sin modificar (carpeta o ZIP).",
  },
];

export function getImportSourceMeta(
  id: ImportSourceId,
): ImportSourceMeta | undefined {
  return IMPORT_SOURCES.find((s) => s.id === id);
}

export interface ImportSourceState {
  id: ImportSourceId;
  status: ImportConnectionStatus;
  /** Etiqueta de último import (p.ej. import:archivo.zip); no implica OAuth. */
  accountLabel: string;
  lastImportAt: string | null;
  itemsImported: number;
}

export function defaultImportSourceStates(): ImportSourceState[] {
  return IMPORT_SOURCES.map((s) => ({
    id: s.id,
    status: "disconnected" as const,
    accountLabel: "",
    lastImportAt: null,
    itemsImported: 0,
  }));
}

export type ImportItemKind = "frase" | "foto" | "evento";

export interface ImportedItem {
  id: string;
  sourceId: ImportSourceId;
  kind: ImportItemKind;
  title: string;
  content: string;
  /** ISO date del post/foto/evento si se conoce. */
  occurredAt: string | null;
  rawRef?: string;
}

export type ImportJobStatus =
  | "idle"
  | "queued"
  | "parsing"
  | "done"
  | "error";

export interface ImportJob {
  id: string;
  sourceId: ImportSourceId;
  fileName: string;
  status: ImportJobStatus;
  createdAt: string;
  finishedAt: string | null;
  itemsFound: number;
  memoriesCreated: number;
  error: string | null;
}

export interface LegadoExport {
  version: 1;
  exportedAt: string;
  personName: string;
  memories: Memory[];
  profile?: LegadoProfile;
}

export interface Settings {
  personName: string;
  /** Preferido: Ollama en localhost. Mock si no hay modelo. Cloud solo escape hatch. */
  provider: LlmProvider;
  ollamaBaseUrl: string;
  ollamaModel: string;
  /** Escape hatch; no es el camino local-first. */
  openaiApiKey: string;
  /** Skin de interfaz compartida entre entrenamiento y consulta. */
  themeId: ThemeId;
}

export const DEFAULT_SETTINGS: Settings = {
  personName: "Yo",
  provider: "ollama",
  ollamaBaseUrl: "http://127.0.0.1:11434",
  ollamaModel: "llama3.2",
  openaiApiKey: "",
  themeId: DEFAULT_THEME_ID,
};
