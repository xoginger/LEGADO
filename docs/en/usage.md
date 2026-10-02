# Using LEGADO

Practical guide: minimum requirements, machine setup, and how to use Training, Consultation, and UI themes.

Related docs: [plan](./plan.md) · [hardware](./hardware.md) · [contributing](./contributing.md)

Spanish version: [`../es/uso.md`](../es/uso.md)

---

## 1. Minimum requirements

| Requirement | Minimum | Notes |
| --- | --- | --- |
| **Node.js** | **20+** | Required for the Next.js apps. |
| **npm** | 10+ (ships with Node) | Monorepo workspaces. |
| **Browser** | Recent Chromium / Firefox / Safari | Desktop or mobile. |
| **RAM (app only)** | 4 GB free | Without a local model yet. |
| **RAM / VRAM (with Ollama)** | See [hardware.md](./hardware.md) | ~16 GB unified (Mac) or 8 GB VRAM + 16 GB RAM (PC) for a 7B model. |
| **Disk** | ≥2 GB free (+ models) | Reserve ≥50 GB if you try several models. |
| **OS** | macOS, Windows, or Linux | Local-first: everything runs on your machine. |
| **Ollama** | Optional | If no model is available, LEGADO uses a **mock** built from your memories. |

No cloud account, remote database, or API key is required for the recommended path.

---

## 2. Configure the machine

### Clone and install

```bash
git clone https://github.com/xoginger/LEGADO.git
cd LEGADO
npm install
```

### Start the apps

```bash
npm run dev:entrenamiento   # http://127.0.0.1:43127
npm run dev:consulta        # http://127.0.0.1:43128  (second terminal)
```

Also available: `npm run build` / `npm run build:entrenamiento` / `npm run build:consulta`.

### Local model (recommended)

1. Install [Ollama](https://ollama.com).
2. Pull a model, e.g. `ollama pull llama3.2`.
3. In **Training → Settings**, keep the engine on **Ollama / local runtime** (default URL `http://127.0.0.1:11434`).
4. If Ollama is down, LEGADO falls back to **mock** automatically.

Hardware purchase ranges (MXN): see the Spanish guide [equipo-local.md](../es/equipo-local.md) and the English summary [hardware.md](./hardware.md).

---

## 3. How to use

### Training (`apps/entrenamiento`)

1. Open http://127.0.0.1:43127.
2. Create **memories** (recollection, phrase, comment, knowledge).
3. Try **chat** with those memories as context.
4. In **Settings**: person name, engine (Ollama / mock / optional cloud), **UI theme**, and JSON export.

### Consultation (`apps/consulta`)

1. Open http://127.0.0.1:43128.
2. **Import** a JSON export from Training, or use the on-disk store when both apps share the same machine.
3. Chat only — memories are not edited here.
4. **Theme** button: same skins as Training (persisted in this browser).

### UI themes (skins)

In **Settings** (Training) or **Theme** (Consultation):

| Theme | Feel |
| --- | --- |
| **Legado** | Default: warm memorial sage + gold. |
| **Matrix** | Green terminal, mono type. |
| **Jarvis** | Cyan HUD / assistant cockpit. |
| **Anime** | Soft pastel, rounded type. |
| **Pergamino** | Sepia ink on aged paper. |
| **Noche mínima** | Quiet dark, clear type. |

- Hover / focus a card for a **live preview**.
- Choice is stored in `localStorage` (`legado.theme.v1` + settings) and **shared** by Training and Consultation in the same browser.
- Fonts and subtle motion follow each skin (CSS variables in `packages/shared/themes`).

### Brand icon

Assets live in `packages/shared/assets/` (SVG + PNG), copied to `apps/*/public/brand/` and `web/brand/` for landing / GitHub. Both apps use the LEGADO mark (book + seedling) in favicon and header.

### Export / backup

From Training settings: **Export memories (JSON)**. Import that file in Consultation.

---

## 4. Free to use · donations

LEGADO is **free** (MIT). Optional donations via **Ko-fi (Stripe)**: https://ko-fi.com/xoginger — see [DONATIONS.md](../../DONATIONS.md).

---

## 5. Out of scope here (later phases)

Cloned voice, avatar, and OS kiosk / lockdown **do not block** the current text workflow. See [plan.md](./plan.md).
