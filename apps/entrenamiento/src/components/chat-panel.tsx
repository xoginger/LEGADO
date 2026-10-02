"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { createId } from "@legado/shared";
import type { ChatMessage, Memory, Settings } from "@legado/shared";
import { LoaderCircle, SendHorizontal } from "lucide-react";

type Props = {
  memories: Memory[];
  messages: ChatMessage[];
  settings: Settings;
  onMessagesChange: (messages: ChatMessage[]) => void;
};

export function ChatPanel({
  memories,
  messages,
  settings,
  onMessagesChange,
}: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    setWarning(null);
    setInput("");

    const userMsg: ChatMessage = {
      id: createId("msg"),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    const nextHistory = [...messages, userMsg];
    onMessagesChange(nextHistory);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          memories,
          history: nextHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          personName: settings.personName,
          provider: settings.provider,
          ollamaBaseUrl: settings.ollamaBaseUrl,
          ollamaModel: settings.ollamaModel,
          openaiApiKey: settings.openaiApiKey,
        }),
      });

      const data = (await res.json()) as {
        reply?: string;
        source?: "mock" | "ollama" | "openai";
        warning?: string;
        error?: string;
      };

      if (!res.ok || !data.reply) {
        throw new Error(data.error || "No se pudo obtener una respuesta.");
      }

      if (data.warning) setWarning(data.warning);

      const assistantMsg: ChatMessage = {
        id: createId("msg"),
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString(),
        source: data.source,
      };
      onMessagesChange([...nextHistory, assistantMsg]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Algo falló al generar la respuesta.",
      );
      onMessagesChange(nextHistory);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-3 px-1 pb-4">
        <div>
          <h2 className="font-heading text-2xl tracking-tight text-[var(--legado-ink)]">
            Conversar
          </h2>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Habla con la presencia de{" "}
            <span className="text-foreground/80 font-medium">
              {settings.personName}
            </span>
            , construida con las memorias guardadas.
          </p>
        </div>
        <Badge variant="outline" className="shrink-0 font-normal">
          {settings.provider === "ollama"
            ? "Ollama local"
            : settings.provider === "openai"
              ? "API cloud (opcional)"
              : "Mock local"}
        </Badge>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--legado-line)] bg-[var(--legado-panel)]/80">
        <ScrollArea className="min-h-0 flex-1 px-4 py-4">
          {messages.length === 0 && !loading ? (
            <div className="legado-empty flex h-full min-h-64 flex-col items-center justify-center px-4 py-10 text-center">
              <p className="font-heading text-xl text-[var(--legado-ink)]">
                La conversación empieza aquí
              </p>
              <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
                Pregunta por un consejo, un recuerdo o cómo veía la vida. Si
                todavía no hay memorias, la respuesta te invitará a escribir la
                primera.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[80%] ${
                      message.role === "user"
                        ? "legado-bubble-user"
                        : "legado-bubble-assistant"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.role === "assistant" && message.source ? (
                      <p className="mt-2 text-[11px] opacity-60">
                        {message.source === "ollama"
                          ? "Respuesta con Ollama"
                          : message.source === "openai"
                            ? "Respuesta con API cloud"
                            : "Respuesta mock local"}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
              {loading ? (
                <li className="flex justify-start">
                  <div className="legado-bubble-assistant flex items-center gap-2 rounded-2xl px-4 py-3 text-sm">
                    <LoaderCircle className="size-4 animate-spin" />
                    Pensando con tus memorias…
                  </div>
                </li>
              ) : null}
              <div ref={bottomRef} />
            </ul>
          )}
        </ScrollArea>

        <div className="border-t border-[var(--legado-line)] bg-[var(--legado-panel)] p-3 sm:p-4">
          {error ? (
            <p
              className="bg-destructive/10 text-destructive mb-3 rounded-lg px-3 py-2 text-sm"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          {warning ? (
            <p className="mb-3 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-900">
              {warning}
            </p>
          ) : null}
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta…"
              className="min-h-12 max-h-40 flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              disabled={loading}
            />
            <Button
              size="icon-lg"
              aria-label="Enviar mensaje"
              disabled={loading || !input.trim()}
              onClick={() => void send()}
            >
              {loading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <SendHorizontal className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
