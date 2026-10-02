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

export interface LegadoExport {
  version: 1;
  exportedAt: string;
  personName: string;
  memories: Memory[];
}

export interface Settings {
  personName: string;
  /** Preferido: Ollama en localhost. Mock si no hay modelo. Cloud solo escape hatch. */
  provider: LlmProvider;
  ollamaBaseUrl: string;
  ollamaModel: string;
  /** Escape hatch; no es el camino local-first. */
  openaiApiKey: string;
}

export const DEFAULT_SETTINGS: Settings = {
  personName: "Yo",
  provider: "ollama",
  ollamaBaseUrl: "http://127.0.0.1:11434",
  ollamaModel: "llama3.2",
  openaiApiKey: "",
};
