import { NextResponse } from "next/server";
import { buildMockReply, buildSystemPrompt, rankMemories } from "@/lib/chat";
import type { ChatMessage, LlmProvider, Memory } from "@/lib/types";

export const runtime = "nodejs";

type ChatRequestBody = {
  message: string;
  memories?: Memory[];
  history?: Pick<ChatMessage, "role" | "content">[];
  personName?: string;
  provider?: LlmProvider;
  ollamaBaseUrl?: string;
  ollamaModel?: string;
  openaiApiKey?: string;
  /** @deprecated prefer provider */
  apiKey?: string;
  useApi?: boolean;
};

function openaiStyleMessages(
  personName: string,
  memories: Memory[],
  history: Pick<ChatMessage, "role" | "content">[],
  message: string,
) {
  const ranked = rankMemories(message, memories, 8);
  const system = buildSystemPrompt(personName, ranked.length ? ranked : memories);
  return [
    { role: "system" as const, content: system },
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ];
}

async function callOllama(opts: {
  baseUrl: string;
  model: string;
  messages: { role: string; content: string }[];
}): Promise<string> {
  const base = opts.baseUrl.replace(/\/$/, "");
  const response = await fetch(`${base}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: opts.model,
      temperature: 0.7,
      messages: opts.messages,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Ollama ${response.status}: ${detail.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error("Ollama devolvió una respuesta vacía.");
  return reply;
}

async function callOpenAI(opts: {
  apiKey: string;
  messages: { role: string; content: string }[];
}): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: opts.messages,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI ${response.status}: ${detail.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error("La API devolvió una respuesta vacía.");
  return reply;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const message = (body.message ?? "").trim();
    const memories = Array.isArray(body.memories) ? body.memories : [];
    const personName = (body.personName ?? "Yo").trim() || "Yo";
    const history = Array.isArray(body.history) ? body.history.slice(-12) : [];

    let provider: LlmProvider = body.provider ?? "ollama";
    // Compat con settings antiguos
    if (!body.provider && body.useApi && (body.openaiApiKey || body.apiKey)) {
      provider = "openai";
    }

    const ollamaBaseUrl =
      (body.ollamaBaseUrl ?? "http://127.0.0.1:11434").trim() ||
      "http://127.0.0.1:11434";
    const ollamaModel = (body.ollamaModel ?? "llama3.2").trim() || "llama3.2";
    const openaiApiKey = (body.openaiApiKey ?? body.apiKey ?? "").trim();

    if (!message) {
      return NextResponse.json(
        { error: "Escribe un mensaje para continuar." },
        { status: 400 },
      );
    }

    if (provider === "mock") {
      return NextResponse.json({
        reply: buildMockReply(message, memories, personName),
        source: "mock" as const,
      });
    }

    const messages = openaiStyleMessages(
      personName,
      memories,
      history,
      message,
    );

    if (provider === "ollama") {
      try {
        const reply = await callOllama({
          baseUrl: ollamaBaseUrl,
          model: ollamaModel,
          messages,
        });
        return NextResponse.json({ reply, source: "ollama" as const });
      } catch (err) {
        console.error("Ollama fallback → mock", err);
        return NextResponse.json({
          reply: buildMockReply(message, memories, personName),
          source: "mock" as const,
          warning:
            "No hay runtime local disponible (¿Ollama encendido y modelo descargado?). Respondí en modo mock con tus memorias.",
        });
      }
    }

    if (provider === "openai") {
      if (!openaiApiKey) {
        return NextResponse.json({
          reply: buildMockReply(message, memories, personName),
          source: "mock" as const,
          warning:
            "Falta la API key. Usé el mock local. En local-first preferimos Ollama.",
        });
      }
      try {
        const reply = await callOpenAI({ apiKey: openaiApiKey, messages });
        return NextResponse.json({ reply, source: "openai" as const });
      } catch (err) {
        console.error("OpenAI fallback → mock", err);
        return NextResponse.json({
          reply: buildMockReply(message, memories, personName),
          source: "mock" as const,
          warning:
            "Falló la API cloud. Respondí con el mock local a partir de tus memorias.",
        });
      }
    }

    return NextResponse.json({
      reply: buildMockReply(message, memories, personName),
      source: "mock" as const,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          "Algo falló al generar la respuesta. Inténtalo de nuevo en un momento.",
      },
      { status: 500 },
    );
  }
}
