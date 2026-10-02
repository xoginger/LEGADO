export type ThemeId =
  | "legado"
  | "matrix"
  | "jarvis"
  | "anime"
  | "pergamino"
  | "noche";

export type ThemeMeta = {
  id: ThemeId;
  label: string;
  description: string;
  preview: {
    bg: string;
    fg: string;
    accent: string;
    panel: string;
  };
};

export const THEME_STORAGE_KEY = "legado.theme.v1";

export const THEMES: ThemeMeta[] = [
  {
    id: "legado",
    label: "Legado",
    description: "Cálido y memorial: verde salvia y destello dorado.",
    preview: {
      bg: "#e8f0ea",
      fg: "#1a2c26",
      accent: "#c9a45c",
      panel: "#f4f8f5",
    },
  },
  {
    id: "matrix",
    label: "Matrix",
    description: "Terminal verde: código, lluvia y tipografía mono.",
    preview: {
      bg: "#020805",
      fg: "#b7ffb0",
      accent: "#39ff14",
      panel: "#07140c",
    },
  },
  {
    id: "jarvis",
    label: "Jarvis",
    description: "HUD técnico: cian, rejillas y asistente de cabina.",
    preview: {
      bg: "#071018",
      fg: "#d7f4ff",
      accent: "#3ecbff",
      panel: "#0c1c2a",
    },
  },
  {
    id: "anime",
    label: "Anime",
    description: "Pastel expresivo: cielo suave y tipografía redondeada.",
    preview: {
      bg: "#f3f7ff",
      fg: "#2a3350",
      accent: "#ff7aa2",
      panel: "#ffffff",
    },
  },
  {
    id: "pergamino",
    label: "Pergamino",
    description: "Herencia escrita: tinta sepia sobre papel antiguo.",
    preview: {
      bg: "#efe2c6",
      fg: "#3a2a1a",
      accent: "#8b5a2b",
      panel: "#f7ecd4",
    },
  },
  {
    id: "noche",
    label: "Noche mínima",
    description: "Oscuro sobrio: tipografía clara, sin adornos.",
    preview: {
      bg: "#121417",
      fg: "#e8eaed",
      accent: "#9aa7b5",
      panel: "#1a1d22",
    },
  },
];

export const DEFAULT_THEME_ID: ThemeId = "legado";

const THEME_IDS = new Set(THEMES.map((t) => t.id));

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && THEME_IDS.has(value as ThemeId);
}

export function getTheme(id: ThemeId): ThemeMeta {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export function loadThemeId(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(raw)) return raw;
  } catch {
    // ignore
  }
  return DEFAULT_THEME_ID;
}

export function saveThemeId(id: ThemeId): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, id);
  try {
    window.dispatchEvent(
      new CustomEvent("legado:theme", { detail: { themeId: id } }),
    );
  } catch {
    // ignore
  }
}

export function applyTheme(id: ThemeId): void {
  if (typeof document === "undefined") return;
  const theme = isThemeId(id) ? id : DEFAULT_THEME_ID;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme =
    theme === "matrix" || theme === "jarvis" || theme === "noche"
      ? "dark"
      : "light";
}
