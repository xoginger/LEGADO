# LEGADO

**Free and open source.** Local-first personal legacy AI: capture your memories, phrases, and knowledge; let family talk with that presence later.

<p align="center">
  <img src="./packages/shared/assets/legado-mark.svg" alt="LEGADO" width="96" height="96" />
</p>

> Spanish README: [README.es.md](./README.es.md)  
> **Website:** [https://xoginger.github.io/LEGADO/](https://xoginger.github.io/LEGADO/) (`web/` → GitHub Pages)

## How to use

Start here: **[docs/en/usage.md](./docs/en/usage.md)** — minimum requirements, machine setup, and step-by-step usage (Training → Consultation). Español: [docs/es/uso.md](./docs/es/uso.md).

## Two apps

| App | Purpose |
| --- | --- |
| **Training** (`apps/entrenamiento`) | Capture memories and test chat locally |
| **Consultation** (`apps/consulta`) | Read-only conversation with an exported legacy |

## Quick start

```bash
npm install
npm run dev:entrenamiento   # http://127.0.0.1:43127
npm run dev:consulta        # http://127.0.0.1:43128
```

Needs [Node.js](https://nodejs.org/) 20+ and optionally [Ollama](https://ollama.com/) for local models.

## Free to use · Donations

LEGADO is free under the [MIT License](./LICENSE). If it helps you, you can support the project on **[Ko-fi](https://ko-fi.com/xoginger)** (Stripe) — details in [DONATIONS.md](./DONATIONS.md).

## Documentation

| Topic | English | Español |
| --- | --- | --- |
| **How to use** (requirements, setup, steps, themes) | [docs/en/usage.md](./docs/en/usage.md) | [docs/es/uso.md](./docs/es/uso.md) |
| Product plan / architecture | [docs/en/plan.md](./docs/en/plan.md) | [docs/es/plan.md](./docs/es/plan.md) |
| Local hardware guide | [docs/en/hardware.md](./docs/en/hardware.md) | [docs/es/equipo-local.md](./docs/es/equipo-local.md) |
| Contributing | [docs/en/contributing.md](./docs/en/contributing.md) | [docs/es/contribuir.md](./docs/es/contribuir.md) |
| Public landing (Pages) | [web/](./web/) · [web/README.md](./web/README.md) | — |
| Code of conduct | [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | — |

## License

[MIT](./LICENSE)
