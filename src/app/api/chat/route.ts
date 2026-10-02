import { NextResponse } from "next/server";
import { buildMockReply, buildSystemPrompt } from "@/lib/chat";
import type { ChatMessage, Memory } from "@/lib/types";

export const runtime = "nodejs";

type ChatRequestBody = {
  message: string;
  memories?: Memory[];
  history?: Pick<ChatMessage, "role" | "content">[];
  personName?: string;
  apiKey?: string;
  useApi?: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const message = (body.message ?? "").trim();
    const memories = Array.isArray(body.memories) ? body.memories : [];
    const personName = (body.personName ?? "Yo").trim() || "Yo";
    const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
    const apiKey = (body.apiKey ?? "").trim();
    const useApi = Boolean(body.useApi && apiKey);

    if (!message) {
      return NextResponse.json(
        { error: "Escribe un mensaje para continuar." },
        { status: 400 },
      );
    }

    if (!useApi) {
      const reply = buildMockReply(message, memories, personName);
      return NextResponse.json({ reply, source: "mock" as const });
    }

    const system = buildSystemPrompt(personName, memories);
    const openaiMessages = [
      { role: "system" as const, content: system },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: openaiMessages,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("OpenAI error", response.status, detail);
      const fallback = buildMockReply(message, memories, personName);
      return NextResponse.json({
        reply: fallback,
        source: "mock" as const,
        warning:
          "No se pudo usar la API. Respondí con el modo local a partir de tus memorias.",
      });
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      buildMockReply(message, memories, personName);

    return NextResponse.json({ reply, source: "api" as const });
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
