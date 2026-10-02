# LEGADO

**Free and open source.** Local-first personal legacy AI: capture your memories, phrases, and knowledge; let family talk with that presence later.

<p align="center">
  <img src="./packages/shared/assets/legado-mark.svg" alt="LEGADO" width="96" height="96" />
</p>

> Spanish README: [README.es.md](./README.es.md)

## Two apps

| App | Path | Purpose | Dev URL |
| --- | --- | --- | --- |
| **Training / Entrenamiento** | `apps/entrenamiento` | Capture & edit memories, configure local LLM, test chat, pick UI theme | http://127.0.0.1:43127 |
| **Consultation / Consulta** | `apps/consulta` | Heir-facing legacy interface — chat only (import JSON or shared disk store) | http://127.0.0.1:43128 |

Shared logic lives in `packages/shared` (including **theme skins** and brand assets).

**Priority:** training + text chat first. Voice cloning, avatar, and OS kiosk mode come later.

## Quick start

```bash
npm install
npm run dev:entrenamiento   # training app
npm run dev:consulta        # consultation app (another terminal)
```

Optional local model: install [Ollama](https://ollama.com), pull a model (e.g. `ollama pull llama3.2`), keep the default provider in Training settings.

## Free to use · Donations

LEGADO is free under the [MIT License](./LICENSE). Optional support via **Ko-fi (Stripe)**: [ko-fi.com/xoginger](https://ko-fi.com/xoginger) — see [DONATIONS.md](./DONATIONS.md).

## Documentation

| Topic | English | Español |
| --- | --- | --- |
| **Requirements & usage** | [docs/en/usage.md](./docs/en/usage.md) | [docs/es/uso.md](./docs/es/uso.md) |
| Product plan / architecture | [docs/en/plan.md](./docs/en/plan.md) | [docs/es/plan.md](./docs/es/plan.md) |
| Local hardware guide | [docs/en/hardware.md](./docs/en/hardware.md) | [docs/es/equipo-local.md](./docs/es/equipo-local.md) |
| Contributing | [docs/en/contributing.md](./docs/en/contributing.md) | [docs/es/contribuir.md](./docs/es/contribuir.md) |
| Code of conduct | [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | — |

UI themes (Legado, Matrix, Jarvis, Anime, Pergamino, Noche mínima) are documented in the usage guides and selectable under **Settings / Tema**.

## License

[MIT](./LICENSE)
