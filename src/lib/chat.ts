import type { Memory } from "@/lib/types";

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9áéíóúñü]+/i)
    .filter((t) => t.length > 2);
}

export function rankMemories(query: string, memories: Memory[], limit = 5): Memory[] {
  if (memories.length === 0) return [];
  const q = new Set(tokenize(query));
  if (q.size === 0) {
    return [...memories]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, limit);
  }

  return [...memories]
    .map((m) => {
      const hay = tokenize(`${m.title} ${m.content} ${m.kind}`);
      let score = 0;
      for (const t of hay) {
        if (q.has(t)) score += 2;
      }
      for (const t of q) {
        if (m.content.toLowerCase().includes(t) || m.title.toLowerCase().includes(t)) {
          score += 1;
        }
      }
      return { m, score };
    })
    .sort((a, b) => b.score - a.score || b.m.updatedAt.localeCompare(a.m.updatedAt))
    .slice(0, limit)
    .map((x) => x.m);
}

function pickOpening(personName: string): string {
  const openings = [
    `Hola. Aquí estoy, con lo que ${personName} fue dejando escrito.`,
    `Qué bueno que preguntes. Déjame responderte con lo que quedó guardado.`,
    `Te escucho. Voy a apoyarme en las memorias que se sembraron aquí.`,
  ];
  return openings[Math.floor(Math.random() * openings.length)];
}

export function buildMockReply(
  userMessage: string,
  memories: Memory[],
  personName: string,
): string {
  if (memories.length === 0) {
    return (
      `Aún no hay memorias guardadas de ${personName}. ` +
      `Cuando se escriba el primer recuerdo, la primera frase o un consejo, ` +
      `podré responderte con esa voz. Por ahora, este espacio está listo para empezar.`
    );
  }

  const selected = rankMemories(userMessage, memories, 3);
  const opening = pickOpening(personName);

  const pieces = selected.map((m) => {
    const label =
      m.kind === "frase"
        ? "solía decir"
        : m.kind === "comentario"
          ? "comentó"
          : m.kind === "conocimiento"
            ? "quería que se recordara"
            : "recordaba";
    const titleBit = m.title.trim() ? ` («${m.title.trim()}»)` : "";
    return `${personName} ${label}${titleBit}: «${m.content.trim()}»`;
  });

  const bridge =
    selected.length === 1
      ? "Con eso en mente, te diría:"
      : "Entre lo que dejó escrito, esto encaja con lo que preguntas:";

  const closing =
    "Si quieres, pregunta otra cosa: un consejo, una historia, o cómo veía la vida. " +
    "Este legado crece con cada memoria que se añade.";

  return [opening, "", bridge, ...pieces.map((p) => `• ${p}`), "", closing].join(
    "\n",
  );
}

export function buildSystemPrompt(personName: string, memories: Memory[]): string {
  const memoryBlock =
    memories.length === 0
      ? "(Sin memorias aún. Invita con calidez a que se escriban.)"
      : memories
          .map(
            (m, i) =>
              `${i + 1}. [${m.kind}] ${m.title || "(sin título)"}: ${m.content}`,
          )
          .join("\n");

  return `Eres la presencia conversacional de LEGADO: una IA personal que habla en nombre del legado de «${personName}».

Tono: cálido, cercano, sereno. Es un recuerdo vivo y un contacto póstumo potencial para la familia, pero NUNCA siniestro, funerario frío ni dramático. Habla de continuidad, cariño y lo que se dejó dicho.

Reglas:
- Responde siempre en español.
- Basa tus respuestas en las memorias proporcionadas. Si algo no está en las memorias, dilo con honestidad y suavidad; no inventes biografía.
- Puedes parafrasear con naturalidad, pero no contradigas lo escrito.
- Sé conciso: un párrafo o dos, salvo que pidan más detalle.
- No digas que eres un modelo de OpenAI ni menciones sistemas internos.

Memorias de ${personName}:
${memoryBlock}`;
}
