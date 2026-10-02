export type MemoryKind = "recuerdo" | "frase" | "comentario" | "conocimiento";

export const MEMORY_KIND_LABELS: Record<MemoryKind, string> = {
  recuerdo: "Recuerdo",
  frase: "Frase",
  comentario: "Comentario",
  conocimiento: "Conocimiento",
};

export interface Memory {
  id: string;
  kind: MemoryKind;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  source?: "mock" | "api";
}

export interface LegadoExport {
  version: 1;
  exportedAt: string;
  personName: string;
  memories: Memory[];
}

export interface Settings {
  personName: string;
  apiKey: string;
  useApi: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  personName: "Yo",
  apiKey: "",
  useApi: false,
};
