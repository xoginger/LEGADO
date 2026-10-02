const translations = {
  es: {
    "nav.what": "Qué es",
    "nav.apps": "Apps",
    "nav.local": "Local-first",
    "nav.use": "Cómo usar",
    "nav.skins": "Temas",
    "nav.oss": "Open source",
    "nav.github": "GitHub",
    "hero.headline": "Un legado conversacional, en tu equipo.",
    "hero.lede":
      "Guarda memorias, frases y conocimientos. Cuando tú no estés, tu familia podrá seguir escuchando tu criterio — en local, con cariño, sin entregar el hogar de la IA a la nube.",
    "hero.ctaGithub": "Ver en GitHub",
    "hero.ctaDocs": "Cómo usar LEGADO",
    "what.eyebrow": "Qué es",
    "what.title": "No es un chatbot genérico.",
    "what.lede":
      "LEGADO es una IA personal entrenada con lo que tú escribes: recuerdos, frases, comentarios y saber práctico. Se alimenta con el tiempo. El tono es de continuidad y cariño — nunca de dramatismo morboso.",
    "what.forWhomTitle": "Para quién",
    "what.forWhom":
      "Para quien quiere dejar una presencia conversacional a hijos y familia: un lugar donde preguntar, recordar y oír el criterio de quien escribió el legado.",
    "what.mvpTitle": "Prioridad ahora",
    "what.mvp":
      "Primero IA usable en texto: memorias + chat local. Voz clonada, avatar y modo quiosco vienen después — no bloquean el primer slice.",
    "apps.eyebrow": "Dos apps",
    "apps.title": "Entrenamiento y consulta.",
    "apps.lede":
      "Un monorepo, dos superficies claras. Lógica compartida en packages/shared.",
    "apps.trainTitle": "Entrenamiento",
    "apps.trainBody":
      "Captura y edita memorias, configura el LLM local (Ollama) y prueba el chat. Aquí vive quien construye el legado.",
    "apps.consultTitle": "Consulta",
    "apps.consultBody":
      "Interfaz para herederos: conversar con el legado. Importa JSON o comparte el store en disco — sin cuenta en la nube.",
    "local.eyebrow": "Local-first",
    "local.title": "Los datos viven en tu equipo.",
    "local.lede":
      "Memorias y chat en la máquina del legador. Ollama (o MLX en Mac) como runtime preferido; si no hay modelo, hay fallback mock para no bloquearte. La nube ajena no es el hogar de la IA.",
    "local.p1": "Texto primero; voz y multimedia después.",
    "local.p2": "Entrenamiento gradual — memoria a memoria.",
    "local.p3": "Export / backup offline hacia quienes heredan.",
    "use.eyebrow": "Cómo usar",
    "use.title": "Requisitos, equipo y pasos.",
    "use.lede":
      "Tres piezas que siempre documentamos: qué necesitas, cómo preparar la máquina, y cómo usarlo día a día.",
    "use.reqTitle": "1. Requisitos mínimos",
    "use.reqBody":
      "Node.js 20+, Git, navegador actual. Mac / Windows / Linux. Ollama opcional (sin él hay mock). Chat local cómodo: ~16 GB RAM para 7B; ver guía de uso y equipo-local.",
    "use.setupTitle": "2. Configurar el equipo",
    "use.setupBody":
      "Instala Node → clona el repo → npm install → (opcional) Ollama + ollama pull llama3.2 → arranca entrenamiento en :43127 y consulta en :43128. En MacBook Air con poco disco interno: /Volumes/XR/LEGADO.",
    "use.stepsTitle": "3. Instrucciones de uso",
    "use.stepsBody":
      "Primero Entrenamiento: memorias → chat. Exporta JSON. Luego Consulta: importar y conversar. Temas/skins se eligen en las apps cuando existan.",
    "use.cta": "Abrir guía completa (ES)",
    "skins.eyebrow": "Personaliza la interfaz",
    "skins.title": "Temas visuales (preview).",
    "skins.lede":
      "El selector completo vive en las apps. Aquí solo un vistazo — icono y skins canónicos los aporta el agente de marca cuando aterrizan en el repo.",
    "skins.note":
      "Placeholders en web/assets/skins/. Si aparecen brand/ o packages/shared/brand/, la landing los preferirá.",
    "skins.default": "Por defecto",
    "skins.matrix": "Matrix",
    "skins.jarvis": "Jarvis",
    "skins.anime": "Anime",
    "oss.eyebrow": "Open source",
    "oss.title": "MIT. Gratis. Donativos opcionales.",
    "oss.lede":
      "Usa LEGADO sin coste bajo licencia MIT. Si te sirve, puedes apoyar el desarrollo en Ko-fi (pagos vía Stripe). Ningún donativo es requisito para entrenar, consultar o exportar.",
    "oss.ctaGithub": "Repositorio",
    "oss.ctaKofi": "Apoyar en Ko-fi",
    "oss.ctaReadme": "README del repo",
    "footer.tag": "Open source · MIT · local-first",
    "footer.docs": "Docs",
    "footer.use": "Cómo usar",
  },
  en: {
    "nav.what": "About",
    "nav.apps": "Apps",
    "nav.local": "Local-first",
    "nav.use": "How to use",
    "nav.skins": "Themes",
    "nav.oss": "Open source",
    "nav.github": "GitHub",
    "hero.headline": "A conversational legacy, on your machine.",
    "hero.lede":
      "Capture memories, phrases, and knowledge. When you are gone, your family can still hear your judgment — locally, warmly, without making someone else’s cloud the home of the AI.",
    "hero.ctaGithub": "View on GitHub",
    "hero.ctaDocs": "How to use LEGADO",
    "what.eyebrow": "What it is",
    "what.title": "Not a generic chatbot.",
    "what.lede":
      "LEGADO is a personal AI trained on what you write: recollections, phrases, comments, and practical knowledge. It grows over time. The tone is continuity and care — never morbid drama.",
    "what.forWhomTitle": "Who it’s for",
    "what.forWhom":
      "Anyone who wants to leave a conversational presence for children and family: a place to ask, remember, and hear the judgment of the person who wrote the legacy.",
    "what.mvpTitle": "Priority now",
    "what.mvp":
      "Usable text AI first: memories + local chat. Cloned voice, avatar, and kiosk mode come later — they do not block the first slice.",
    "apps.eyebrow": "Two apps",
    "apps.title": "Training and consultation.",
    "apps.lede":
      "One monorepo, two clear surfaces. Shared logic in packages/shared.",
    "apps.trainTitle": "Training",
    "apps.trainBody":
      "Capture and edit memories, configure the local LLM (Ollama), and test chat. This is where the legacy is built.",
    "apps.consultTitle": "Consultation",
    "apps.consultBody":
      "Heir-facing UI: talk with the legacy. Import JSON or share an on-disk store — no cloud account.",
    "local.eyebrow": "Local-first",
    "local.title": "Data lives on your machine.",
    "local.lede":
      "Memories and chat on the owner’s computer. Ollama (or MLX on Mac) preferred; mock fallback if no model. Someone else’s cloud is not the home of the AI.",
    "local.p1": "Text first; voice and media later.",
    "local.p2": "Gradual training — memory by memory.",
    "local.p3": "Offline export / backup for heirs.",
    "use.eyebrow": "How to use",
    "use.title": "Requirements, setup, and steps.",
    "use.lede":
      "Three pieces we always document: what you need, how to prepare the machine, and how to use it day to day.",
    "use.reqTitle": "1. Minimum requirements",
    "use.reqBody":
      "Node.js 20+, Git, current browser. Mac / Windows / Linux. Ollama optional (mock otherwise). Comfortable local chat: ~16 GB RAM for 7B; see usage + hardware guides.",
    "use.setupTitle": "2. Configure the machine",
    "use.setupBody":
      "Install Node → clone → npm install → (optional) Ollama + ollama pull llama3.2 → start training on :43127 and consultation on :43128. On a MacBook Air with tight internal disk: /Volumes/XR/LEGADO.",
    "use.stepsTitle": "3. Usage instructions",
    "use.stepsBody":
      "Training first: memories → chat. Export JSON. Then Consultation: import and talk. Themes/skins are chosen in the apps when available.",
    "use.cta": "Open full guide (EN)",
    "skins.eyebrow": "Customize the UI",
    "skins.title": "Visual themes (preview).",
    "skins.lede":
      "The full picker lives in the apps. This is only a glance — canonical icon and skins come from the brand agent when they land in the repo.",
    "skins.note":
      "Placeholders in web/assets/skins/. If brand/ or packages/shared/brand/ appear, the landing will prefer them.",
    "skins.default": "Default",
    "skins.matrix": "Matrix",
    "skins.jarvis": "Jarvis",
    "skins.anime": "Anime",
    "oss.eyebrow": "Open source",
    "oss.title": "MIT. Free. Optional donations.",
    "oss.lede":
      "Use LEGADO at no cost under the MIT license. If it helps, support development on Ko-fi (Stripe). No donation is required to train, consult, or export.",
    "oss.ctaGithub": "Repository",
    "oss.ctaKofi": "Support on Ko-fi",
    "oss.ctaReadme": "Repo README",
    "footer.tag": "Open source · MIT · local-first",
    "footer.docs": "Docs",
    "footer.use": "How to use",
  },
};

const DOC_LINKS = {
  es: {
    use: "https://github.com/xoginger/LEGADO/blob/main/docs/es/uso.md",
    plan: "https://github.com/xoginger/LEGADO/blob/main/docs/es/plan.md",
    readme: "https://github.com/xoginger/LEGADO/blob/main/README.es.md",
  },
  en: {
    use: "https://github.com/xoginger/LEGADO/blob/main/docs/en/usage.md",
    plan: "https://github.com/xoginger/LEGADO/blob/main/docs/en/plan.md",
    readme: "https://github.com/xoginger/LEGADO/blob/main/README.md",
  },
};

/** Paths the brand/skins agent may publish into web/assets/ for Pages. */
const CANONICAL_BRAND_CANDIDATES = [
  "./assets/legado-icon.svg",
  "./assets/brand-icon.svg",
];

function applyTranslations(lang) {
  const next = lang === "en" ? "en" : "es";
  const dict = translations[next];
  document.documentElement.lang = next;
  // Use a distinct attribute — NOT data-lang — so it never collides with
  // .lang-btn[data-lang="es|en"] selectors (html[data-lang] was matching first).
  document.documentElement.setAttribute("data-legado-lang", next);
  document.documentElement.removeAttribute("data-lang");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = dict[key];
    if (typeof value === "string") el.textContent = value;
  });

  document.querySelectorAll("[data-link]").forEach((el) => {
    const kind = el.getAttribute("data-link");
    const href = DOC_LINKS[next][kind];
    if (href) el.setAttribute("href", href);
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const active = btn.getAttribute("data-lang") === next;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });

  try {
    localStorage.setItem("legado-landing-lang", next);
  } catch {
    /* ignore */
  }

  // Reflect in URL without reload (shareable, and survives bad localStorage)
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState({}, "", url);
  } catch {
    /* ignore */
  }
  return next;
}

/** Public API for inline onclick + console debugging */
function setLegadoLang(lang) {
  return applyTranslations(lang);
}
window.setLegadoLang = setLegadoLang;

function initLang() {
  // Precedence: ?lang= → localStorage → Spanish default (never navigator.language)
  let lang = "es";
  try {
    const fromUrl = new URL(window.location.href).searchParams.get("lang");
    if (fromUrl === "en" || fromUrl === "es") lang = fromUrl;
    else {
      const saved = localStorage.getItem("legado-landing-lang");
      if (saved === "en" || saved === "es") lang = saved;
    }
  } catch {
    /* ignore */
  }
  applyTranslations(lang);

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setLegadoLang(btn.getAttribute("data-lang"));
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    const el = target instanceof Element ? target : target?.parentElement;
    const btn = el?.closest?.(".lang-btn");
    if (!btn) return;
    event.preventDefault();
    setLegadoLang(btn.getAttribute("data-lang"));
  });
}

async function preferCanonicalBrandIcon() {
  const img = document.querySelector("[data-brand-icon]");
  if (!img) return;

  // Only probe paths that can exist inside the Pages artifact (web/).
  // Do not HEAD ../brand — that 404-spams the console and never ships on Pages.
  const candidates = [
    "./assets/brand-icon.svg",
    "./assets/legado-icon.svg",
  ];

  for (const path of candidates) {
    try {
      const res = await fetch(path, { method: "HEAD" });
      if (res.ok) {
        if (!img.getAttribute("src")?.endsWith(path.replace("./", ""))) {
          img.src = path;
        }
        return;
      }
    } catch {
      /* keep current placeholder */
    }
  }
}

function boot() {
  initLang();
  preferCanonicalBrandIcon();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
