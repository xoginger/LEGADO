import type {
  ImportedItem,
  ImportItemKind,
  ImportSourceId,
  Memory,
  MemoryKind,
} from "./types";
import { createId } from "./storage";

export type TextFileMap = Record<string, string>;

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function pickString(...vals: unknown[]): string {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function toIso(value: unknown): string | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") {
    const ms = value > 1e12 ? value : value * 1000;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (typeof value === "string") {
    const n = Number(value);
    if (!Number.isNaN(n) && value.trim() !== "" && /^\d+$/.test(value.trim())) {
      return toIso(n);
    }
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  return null;
}

function item(
  sourceId: ImportSourceId,
  kind: ImportItemKind,
  title: string,
  content: string,
  occurredAt: string | null,
  rawRef?: string,
): ImportedItem | null {
  const body = content.trim() || title.trim();
  if (!body) return null;
  return {
    id: createId("imp"),
    sourceId,
    kind,
    title: title.trim().slice(0, 120),
    content: body,
    occurredAt,
    rawRef,
  };
}

/** Formato genérico LEGADO para demos / fixtures. */
function parseLegadoSocialJson(
  data: unknown,
  sourceId: ImportSourceId,
): ImportedItem[] {
  if (!data || typeof data !== "object") return [];
  const root = data as Record<string, unknown>;
  const list = asArray<Record<string, unknown>>(
    root.items ?? root.posts ?? root.entries,
  );
  const out: ImportedItem[] = [];
  for (const row of list) {
    const kindRaw = String(row.kind ?? row.type ?? "frase").toLowerCase();
    const kind: ImportItemKind =
      kindRaw === "foto" || kindRaw === "photo" || kindRaw === "image"
        ? "foto"
        : kindRaw === "evento" || kindRaw === "event"
          ? "evento"
          : "frase";
    const it = item(
      sourceId,
      kind,
      pickString(row.title, row.name, row.caption),
      pickString(row.content, row.text, row.caption, row.description, row.body),
      toIso(row.occurredAt ?? row.timestamp ?? row.date ?? row.creation_timestamp),
      pickString(row.id, row.uri, row.url) || undefined,
    );
    if (it) out.push(it);
  }
  return out;
}

function parseInstagram(files: TextFileMap): ImportedItem[] {
  const out: ImportedItem[] = [];
  for (const [path, text] of Object.entries(files)) {
    const lower = path.toLowerCase();
    if (!lower.endsWith(".json")) continue;
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      continue;
    }
    const generic = parseLegadoSocialJson(data, "instagram");
    if (generic.length) {
      out.push(...generic);
      continue;
    }

    // posts_1.json style: [{ media: [{ title, creation_timestamp, uri }], title }]
    const posts = asArray<Record<string, unknown>>(
      Array.isArray(data) ? data : (data as Record<string, unknown>).posts,
    );
    for (const post of posts) {
      const medias = asArray<Record<string, unknown>>(post.media ?? [post]);
      for (const media of medias) {
        const caption = pickString(
          media.title,
          media.caption,
          post.title,
          media.media_metadata &&
            typeof media.media_metadata === "object" &&
            (media.media_metadata as Record<string, unknown>).camera_metadata
            ? ""
            : "",
        );
        const uri = pickString(media.uri, media.path);
        const kind: ImportItemKind = /\.(jpe?g|png|gif|webp|heic)$/i.test(uri)
          ? "foto"
          : "frase";
        const it = item(
          "instagram",
          kind,
          caption.slice(0, 80) || (uri ? uri.split("/").pop() || "Publicación" : "Publicación"),
          caption || `Foto de Instagram: ${uri || "sin URI"}`,
          toIso(media.creation_timestamp ?? post.creation_timestamp),
          uri || undefined,
        );
        if (it) out.push(it);
      }
    }

    // content/posts_1.json alternate: { "media": [...] } at root
    if (!Array.isArray(data) && data && typeof data === "object") {
      const mediaRoot = asArray<Record<string, unknown>>(
        (data as Record<string, unknown>).media,
      );
      for (const media of mediaRoot) {
        const caption = pickString(media.title, media.caption);
        const uri = pickString(media.uri);
        const it = item(
          "instagram",
          uri ? "foto" : "frase",
          caption.slice(0, 80) || "Publicación IG",
          caption || `Media Instagram ${uri}`,
          toIso(media.creation_timestamp),
          uri || undefined,
        );
        if (it) out.push(it);
      }
    }
  }
  return out;
}

function parseFacebook(files: TextFileMap): ImportedItem[] {
  const out: ImportedItem[] = [];
  for (const [path, text] of Object.entries(files)) {
    const lower = path.toLowerCase();
    if (!lower.endsWith(".json")) continue;
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      continue;
    }
    const generic = parseLegadoSocialJson(data, "facebook");
    if (generic.length) {
      out.push(...generic);
      continue;
    }

    const root = data as Record<string, unknown>;
    // your_posts / posts
    const posts = asArray<Record<string, unknown>>(
      root.posts_v2 ??
        root.your_posts ??
        root.posts ??
        (Array.isArray(data) ? data : []),
    );
    for (const post of posts) {
      const dataChunks = asArray<Record<string, unknown>>(post.data);
      const textParts = dataChunks
        .map((d) => pickString(d.post, d.text, d.comment))
        .filter(Boolean);
      const body = textParts.join("\n") || pickString(post.title, post.name);
      const attachments = asArray<Record<string, unknown>>(post.attachments);
      const hasMedia = attachments.some((a) => {
        const nested = asArray<Record<string, unknown>>(
          (a.data as unknown[]) ?? [],
        );
        return nested.some((n) => n.media || n.external_context);
      });
      const it = item(
        "facebook",
        hasMedia && !body ? "foto" : body ? "frase" : "foto",
        pickString(post.title) || "Publicación Facebook",
        body || "Publicación con medios en Facebook",
        toIso(post.timestamp ?? post.creation_timestamp),
      );
      if (it) out.push(it);
    }

    // events
    const events = asArray<Record<string, unknown>>(
      root.events_v2 ?? root.your_events ?? root.events,
    );
    for (const ev of events) {
      const name = pickString(ev.name, ev.title);
      const desc = pickString(ev.description, ev.details);
      const it = item(
        "facebook",
        "evento",
        name || "Evento Facebook",
        [name, desc].filter(Boolean).join(" — ") || name,
        toIso(ev.start_timestamp ?? ev.start_time ?? ev.timestamp),
      );
      if (it) out.push(it);
    }
  }
  return out;
}

function stripTweetJs(raw: string): string {
  const idx = raw.indexOf("[");
  if (idx >= 0) return raw.slice(idx);
  return raw;
}

function parseX(files: TextFileMap): ImportedItem[] {
  const out: ImportedItem[] = [];
  for (const [path, text] of Object.entries(files)) {
    const lower = path.toLowerCase();
    const base = lower.split("/").pop() || lower;

    if (base.endsWith(".csv")) {
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) continue;
      const headers = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim().toLowerCase());
      const textIdx = headers.findIndex((h) =>
        ["text", "full_text", "tweet", "content"].includes(h),
      );
      const dateIdx = headers.findIndex((h) =>
        ["created_at", "date", "timestamp", "time"].includes(h),
      );
      for (const line of lines.slice(1)) {
        const cols = line.match(/("([^"]|"")*"|[^,]*)/g) ?? [];
        const cells = cols.map((c) => c.replace(/^"|"$/g, "").replace(/""/g, '"'));
        const body = textIdx >= 0 ? cells[textIdx] ?? "" : cells[cells.length - 1] ?? "";
        const when = dateIdx >= 0 ? cells[dateIdx] : null;
        const it = item("x", "frase", body.slice(0, 80), body, toIso(when));
        if (it) out.push(it);
      }
      continue;
    }

    if (!base.endsWith(".json") && !base.endsWith(".js")) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(base.endsWith(".js") ? stripTweetJs(text) : text);
    } catch {
      continue;
    }

    const generic = parseLegadoSocialJson(parsed, "x");
    if (generic.length) {
      out.push(...generic);
      continue;
    }

    const rows = asArray<Record<string, unknown>>(
      Array.isArray(parsed)
        ? parsed
        : (parsed as Record<string, unknown>).tweets ??
            (parsed as Record<string, unknown>).data,
    );
    for (const row of rows) {
      const tweet = (row.tweet as Record<string, unknown>) ?? row;
      const body = pickString(
        tweet.full_text,
        tweet.text,
        tweet.content,
      );
      const it = item(
        "x",
        "frase",
        body.slice(0, 80) || "Tweet",
        body,
        toIso(tweet.created_at ?? tweet.createdAt),
        pickString(tweet.id_str, tweet.id) || undefined,
      );
      if (it) out.push(it);
    }
  }
  return out;
}

function parseGooglePhotos(files: TextFileMap): ImportedItem[] {
  const out: ImportedItem[] = [];
  for (const [path, text] of Object.entries(files)) {
    const lower = path.toLowerCase();
    if (!lower.endsWith(".json")) continue;
    // Skip supplemental-metadata noise unless useful
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      continue;
    }
    const generic = parseLegadoSocialJson(data, "google_photos");
    if (generic.length) {
      out.push(...generic);
      continue;
    }
    if (!data || typeof data !== "object") continue;
    const root = data as Record<string, unknown>;
    const title = pickString(root.title, root.description);
    const desc = pickString(root.description, root.title);
    const photoTaken = toIso(
      (root.photoTakenTime as Record<string, unknown> | undefined)?.timestamp ??
        (root.creationTime as Record<string, unknown> | undefined)?.timestamp ??
        root.creationTime,
    );
    const geo = root.geoData as Record<string, unknown> | undefined;
    const place =
      geo && typeof geo.latitude === "number"
        ? ` (lat ${geo.latitude}, lon ${geo.longitude})`
        : "";
    const fileHint = path.split("/").pop()?.replace(/\.json$/i, "") || "foto";
    if (title || desc || lower.includes("metadata") || lower.endsWith(".jpg.json") || lower.includes(".jpeg.json") || lower.includes(".png.json") || lower.includes(".heic.json")) {
      const it = item(
        "google_photos",
        "foto",
        title || fileHint,
        desc || title || `Foto de Google Fotos: ${fileHint}${place}`,
        photoTaken,
        path,
      );
      if (it) out.push(it);
    }

    // album json
    const albumMedia = asArray<Record<string, unknown>>(root.media ?? root.items);
    for (const m of albumMedia) {
      const t = pickString(m.title, m.description, m.filename);
      const it = item(
        "google_photos",
        "foto",
        t || "Foto álbum",
        pickString(m.description, m.title) || t,
        toIso(m.creationTime ?? m.photoTakenTime),
      );
      if (it) out.push(it);
    }
  }
  return out;
}

function parseApplePhotos(files: TextFileMap): ImportedItem[] {
  const out: ImportedItem[] = [];
  for (const [path, text] of Object.entries(files)) {
    const lower = path.toLowerCase();
    const name = path.split("/").pop() || path;

    if (lower.endsWith(".json")) {
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        continue;
      }
      const generic = parseLegadoSocialJson(data, "apple_photos");
      if (generic.length) {
        out.push(...generic);
        continue;
      }
      // Photos export manifest style
      const root = data as Record<string, unknown>;
      const assets = asArray<Record<string, unknown>>(
        root.assets ?? root.photos ?? root.items,
      );
      for (const a of assets) {
        const title = pickString(a.title, a.name, a.filename);
        const caption = pickString(a.caption, a.description, a.title);
        const it = item(
          "apple_photos",
          "foto",
          title || "Foto Apple",
          caption || title || "Foto exportada de Apple Fotos",
          toIso(a.date ?? a.creationDate ?? a.createdAt),
        );
        if (it) out.push(it);
      }
      continue;
    }

    // Plain image filenames listed as empty stub content keys (UI can pass name→label)
    if (/\.(jpe?g|png|gif|webp|heic|tif{1,2})$/i.test(name)) {
      const base = name.replace(/\.[^.]+$/, "");
      const it = item(
        "apple_photos",
        "foto",
        base,
        `Foto de Apple Fotos: ${name}`,
        null,
        path,
      );
      if (it) out.push(it);
    }
  }
  return out;
}

const PARSERS: Record<
  ImportSourceId,
  (files: TextFileMap) => ImportedItem[]
> = {
  instagram: parseInstagram,
  facebook: parseFacebook,
  x: parseX,
  google_photos: parseGooglePhotos,
  apple_photos: parseApplePhotos,
};

export function parseSocialExport(
  sourceId: ImportSourceId,
  files: TextFileMap,
): ImportedItem[] {
  const parser = PARSERS[sourceId];
  const items = parser(files);
  // Dedupe by content+kind
  const seen = new Set<string>();
  const unique: ImportedItem[] = [];
  for (const it of items) {
    const key = `${it.kind}|${it.content}|${it.occurredAt ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(it);
  }
  return unique;
}

export function importedItemToMemory(item: ImportedItem): Memory {
  const now = new Date().toISOString();
  const kind: MemoryKind =
    item.kind === "foto"
      ? "foto"
      : item.kind === "evento"
        ? "evento"
        : "frase";
  const sourceLabel =
    item.sourceId === "x"
      ? "X"
      : item.sourceId === "google_photos"
        ? "Google Fotos"
        : item.sourceId === "apple_photos"
          ? "Apple Fotos"
          : item.sourceId === "instagram"
            ? "Instagram"
            : "Facebook";
  const when = item.occurredAt
    ? ` (${new Date(item.occurredAt).toLocaleDateString("es-MX")})`
    : "";
  const content =
    item.kind === "foto"
      ? `${item.content}\n\n[Importado de ${sourceLabel}${when}]`
      : item.kind === "evento"
        ? `${item.content}\n\n[Evento importado de ${sourceLabel}${when}]`
        : `${item.content}\n\n[Frase/post de ${sourceLabel}${when}]`;

  return {
    id: createId("mem"),
    kind,
    title: item.title || `${sourceLabel}`,
    content,
    createdAt: item.occurredAt || now,
    updatedAt: now,
    sourceId: item.sourceId,
    importItemId: item.id,
  };
}

export function mergeImportedMemories(
  existing: Memory[],
  items: ImportedItem[],
): { memories: Memory[]; created: number } {
  const existingKeys = new Set(
    existing
      .filter((m) => m.importItemId || m.sourceId)
      .map((m) => `${m.sourceId}|${m.content}`),
  );
  const contentKeys = new Set(existing.map((m) => m.content.trim()));
  const added: Memory[] = [];
  for (const it of items) {
    const mem = importedItemToMemory(it);
    const key = `${mem.sourceId}|${mem.content}`;
    if (existingKeys.has(key) || contentKeys.has(mem.content.trim())) continue;
    existingKeys.add(key);
    contentKeys.add(mem.content.trim());
    added.push(mem);
  }
  return { memories: [...added, ...existing], created: added.length };
}
