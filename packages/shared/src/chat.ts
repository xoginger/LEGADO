import type { LegadoProfile, Memory } from "./types";
import { DEFAULT_PROFILE } from "./types";

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
      // Prefer profile-fed social kinds slightly when query mentions foto/evento
      if (m.kind === "foto" && /foto|imagen|album|álbum/i.test(query)) score += 2;
      if (m.kind === "evento" && /evento|fiesta|reunion|reunión|cumple/i.test(query))
        score += 2;
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

function resolveName(personName: string, profile?: LegadoProfile | null): string {
  return (profile?.displayName || personName || "Yo").trim() || "Yo";
}

function profileBlock(profile?: LegadoProfile | null): string {
  if (!profile) return "";
  const bio = profile.bio?.trim();
  if (!bio) return "";
  return `\nPerfil / bio de ${profile.displayName || "la persona"}:\n${bio}\n`;
}

export function buildMockReply(
  userMessage: string,
  memories: Memory[],
  personName: string,
  profile?: LegadoProfile | null,
): string {
  const name = resolveName(personName, profile);
  const bio = profile?.bio?.trim();

  if (memories.length === 0 && !bio) {
    return (
      `Aún no hay memorias guardadas de ${name}. ` +
      `Cuando se escriba el primer recuerdo, la primera frase o un consejo, ` +
      `o se importen fotos y posts desde redes, podré responderte con esa voz. ` +
      `Por ahora, este espacio está listo para empezar.`
    );
  }

  const selected = rankMemories(userMessage, memories, 3);
  const opening = pickOpening(name);

  const pieces = selected.map((m) => {
    const label =
      m.kind === "frase"
        ? "solía decir"
        : m.kind === "comentario"
          ? "comentó"
          : m.kind === "conocimiento"
            ? "quería que se recordara"
            : m.kind === "foto"
              ? "guardó en una foto"
              : m.kind === "evento"
                ? "vivió en un evento"
                : "recordaba";
    const titleBit = m.title.trim() ? ` («${m.title.trim()}»)` : "";
    return `${name} ${label}${titleBit}: «${m.content.trim()}»`;
  });

  const bioLine = bio
    ? `${name} se describe así: «${bio}»`
    : null;

  const bridge =
    selected.length === 0 && bioLine
      ? "Con el perfil en mente:"
      : selected.length === 1
        ? "Con eso en mente, te diría:"
        : "Entre lo que dejó escrito (e importado al perfil), esto encaja con lo que preguntas:";

  const closing =
    "Si quieres, pregunta otra cosa: un consejo, una historia, o cómo veía la vida. " +
    "Este legado crece con cada memoria y cada importación al perfil.";

  return [
    opening,
    "",
    bridge,
    ...(bioLine ? [`• ${bioLine}`] : []),
    ...pieces.map((p) => `• ${p}`),
    "",
    closing,
  ].join("\n");
}

export function buildSystemPrompt(
  personName: string,
  memories: Memory[],
  profile?: LegadoProfile | null,
): string {
  const name = resolveName(personName, profile);
  const memoryBlock =
    memories.length === 0
      ? "(Sin memorias aún. Invita con calidez a que se escriban o se importen desde fuentes.)"
      : memories
          .map(
            (m, i) =>
              `${i + 1}. [${m.kind}${m.sourceId ? ` · ${m.sourceId}` : ""}] ${m.title || "(sin título)"}: ${m.content}`,
          )
          .join("\n");

  const p = profile ?? DEFAULT_PROFILE;

  return `Eres la presencia conversacional de LEGADO: una IA personal que habla en nombre del legado de «${name}».

Tono: cálido, cercano, sereno. Es un recuerdo vivo y un contacto póstumo potencial para la familia, pero NUNCA siniestro, funerario frío ni dramático. Habla de continuidad, cariño y lo que se dejó dicho.
${profileBlock(p)}
Reglas:
- Responde siempre en español.
- Basa tus respuestas en el perfil y las memorias proporcionadas (incluye fotos, frases y eventos importados de redes). Si algo no está ahí, dilo con honestidad y suavidad; no inventes biografía.
- Puedes parafrasear con naturalidad, pero no contradigas lo escrito.
- Sé conciso: un párrafo o dos, salvo que pidan más detalle.
- No digas que eres un modelo de OpenAI ni menciones sistemas internos.

Memorias de ${name}:
${memoryBlock}`;
}
