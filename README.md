# LEGADO

**Free and open source.** Local-first personal legacy AI: capture your memories, phrases, and knowledge; let family talk with that presence later.

> Spanish README: [README.es.md](./README.es.md)

## Two apps

| App | Path | Purpose | Dev URL |
| --- | --- | --- | --- |
| **Training / Entrenamiento** | `apps/entrenamiento` | Capture & edit memories, configure local LLM, test chat | http://127.0.0.1:43127 |
| **Consultation / Consulta** | `apps/consulta` | Heir-facing legacy interface — chat only (import JSON or shared disk store) | http://127.0.0.1:43128 |

Shared logic lives in `packages/shared`.

**Priority:** training + text chat first. Voice cloning, avatar, and OS kiosk mode come later.

## Quick start

```bash
npm install
npm run dev:entrenamiento   # training app
npm run dev:consulta        # consultation app (another terminal)
```

Optional local model: install [Ollama](https://ollama.com), pull a model (e.g. `ollama pull llama3.2`), keep the default provider in Training settings.

## Free to use · Donations

LEGADO is free under the [MIT License](./LICENSE). If it helps you, you can support the project via **Ko-fi (Stripe)** — see [DONATIONS.md](./DONATIONS.md) (Ko-fi page URL: *coming soon*).

## Documentation

| Topic | English | Español |
| --- | --- | --- |
| Product plan / architecture | [docs/en/plan.md](./docs/en/plan.md) | [docs/es/plan.md](./docs/es/plan.md) |
| Local hardware guide | [docs/en/hardware.md](./docs/en/hardware.md) | [docs/es/equipo-local.md](./docs/es/equipo-local.md) |
| Contributing | [docs/en/contributing.md](./docs/en/contributing.md) | [docs/es/contribuir.md](./docs/es/contribuir.md) |
| Code of conduct | [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | — |

## License

[MIT](./LICENSE)
