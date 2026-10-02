# How to use LEGADO

Practical guide: **minimum requirements**, **machine setup**, and **step-by-step usage**.  
For hardware purchase ranges (MXN, Mac vs PC), see [hardware.md](./hardware.md) and the Spanish [equipo-local.md](../es/equipo-local.md).

---

## 1. Minimum requirements

### Software

| Requirement | Detail |
| --- | --- |
| **Node.js** | **20+** (`node -v`) |
| **npm** | Bundled with Node |
| **Git** | To clone the repo |
| **Browser** | Current Chromium, Safari, or Firefox |
| **OS** | macOS, Windows, or Linux |

### Hardware (to run the apps)

| Use | Guidance |
| --- | --- |
| UI + **mock mode** only (no local model) | Any recent laptop with **8 GB RAM** is enough to write memories and try the UI |
| Local chat with Ollama (~7B) | **16 GB RAM** (Apple Silicon unified) or **16 GB RAM + ~8 GB VRAM** (NVIDIA PC) — see [hardware.md](./hardware.md) |
| Comfortable ~13–14B | **32 GB** unified (Mac) or **32 GB RAM + ≥12 GB VRAM** (PC) |
| Disk | Room for the repo + `node_modules`; with Ollama, reserve **several GB per model** (≥50 GB free if you try several) |

**Ollama is optional.** Without it, LEGADO answers in **mock mode** from your memories (good for UI and flow).

### Ports

| App | Port | URL |
| --- | --- | --- |
| Training | **43127** | http://127.0.0.1:43127 |
| Consultation | **43128** | http://127.0.0.1:43128 |
| Ollama (if used) | **11434** | http://127.0.0.1:11434 |

---

## 2. Configure the machine

### 2.1 Install Node and Git

- **macOS:** [nodejs.org](https://nodejs.org) (LTS 20+) or `brew install node`; Git via Xcode CLT (`xcode-select --install`).
- **Windows:** Node LTS installer + Git for Windows.
- **Linux:** Node 20+ from your distro or NodeSource; system `git`.

Check:

```bash
node -v   # v20 or newer
npm -v
git --version
```

### 2.2 Clone the repository

```bash
git clone https://github.com/xoginger/LEGADO.git
cd LEGADO
npm install
```

#### Recommended path on MacBook Air (external XR volume)

If internal SSD space is tight, clone onto the external **XR** volume (not `$HOME` / internal disk):

```bash
# XR mounted at /Volumes/XR
git clone https://github.com/xoginger/LEGADO.git /Volumes/XR/LEGADO
cd /Volumes/XR/LEGADO
npm install
```

### 2.3 (Optional) Ollama + model

1. Install [Ollama](https://ollama.com) for your OS.
2. Pull a small starter model:

```bash
ollama pull llama3.2
```

3. Keep Ollama running. In the **Training** app, the default provider targets local Ollama.
4. Smoke-test: `curl http://127.0.0.1:11434` — a response means the runtime is up.

No Ollama is fine: use **mock** and keep writing memories.

### 2.4 Start the apps

```bash
# Terminal 1 — always start with training
npm run dev:entrenamiento
# → http://127.0.0.1:43127

# Terminal 2 — consultation (heir-facing UI)
npm run dev:consulta
# → http://127.0.0.1:43128
```

If a port is busy, stop other `next dev` processes or free 43127/43128.

---

## 3. Step-by-step usage

### Step A — Training first

1. Open http://127.0.0.1:43127
2. Create **3–5 memories** (phrase, recollection, comment, knowledge, photo, or event).
3. (Optional) In **Perfil / Fuentes**, edit the profile and import social/album exports — see [social.md](./social.md).
4. Open **chat** in the same app and ask something that only exists in those memories.
5. With Ollama: confirm local-model answers. Without: **mock** uses your memory text.

### Step B — Export

1. In Training, **export** the legacy to JSON (backup + bridge to consultation).
2. Keep the file safe (ideally also on external disk / backup).

### Step C — Consultation (heirs)

1. Open http://127.0.0.1:43128
2. **Import** the JSON (or use a shared on-disk store when configured).
3. Chat only — consultation is for family, not for editing the legacy.

### Step D — UI themes / skins

Visual themes (e.g. Matrix, Jarvis, anime, default) live **in the apps**, not on this landing page.  
When the theme picker ships in Training/Consultation, choose a skin in app settings. The public site only shows a **preview**; the full switcher is not implemented on GitHub Pages.

### Quick checklist

- [ ] Node 20+ and `npm install` OK  
- [ ] Training on `:43127`  
- [ ] Memories created + chat tried (mock or Ollama)  
- [ ] (Optional) Profile / Sources: import at least one network or album  
- [ ] JSON export  
- [ ] Consultation on `:43128` with import  
- [ ] Offline (no third-party cloud required)

---

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Old `node` | Upgrade to Node 20+ |
| Port in use | Stop other Next apps; confirm 43127 / 43128 |
| Ollama not connecting | `curl http://127.0.0.1:11434` and Training settings |
| Low disk on Mac | Clone to `/Volumes/XR/LEGADO` (see above) |
| Empty social import | Use an official JSON/ZIP export; see [social.md](./social.md) |

---

## Links

- Plan: [plan.md](./plan.md)
- Social / profile: [social.md](./social.md)
- Hardware: [hardware.md](./hardware.md) · [equipo-local.md](../es/equipo-local.md)
- Contributing: [contributing.md](./contributing.md)
- Donations: [../../DONATIONS.md](../../DONATIONS.md) · [Ko-fi](https://ko-fi.com/xoginger)
- Repo: https://github.com/xoginger/LEGADO
- Landing (GitHub Pages): https://xoginger.github.io/LEGADO/

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
