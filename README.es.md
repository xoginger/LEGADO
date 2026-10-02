# LEGADO

**Libre y de código abierto.** IA de legado personal local-first: captura memorias, frases y conocimiento; deja que tu familia converse con esa presencia después.

<p align="center">
  <img src="./packages/shared/assets/legado-mark.svg" alt="LEGADO" width="96" height="96" />
</p>

> English README: [README.md](./README.md)  
> **Sitio:** [https://xoginger.github.io/LEGADO/](https://xoginger.github.io/LEGADO/) (`web/` → GitHub Pages)

## Cómo usar

Empieza aquí: **[docs/es/uso.md](./docs/es/uso.md)** — requisitos mínimos, preparación del equipo y uso paso a paso (Entrenamiento → Consulta). English: [docs/en/usage.md](./docs/en/usage.md).

## Dos apps

| App | Propósito |
| --- | --- |
| **Entrenamiento** (`apps/entrenamiento`) | Capturar memorias y probar el chat en local |
| **Consulta** (`apps/consulta`) | Conversación de solo lectura con un legado exportado |

## Arranque rápido

```bash
npm install
npm run dev:entrenamiento   # http://127.0.0.1:43127
npm run dev:consulta        # http://127.0.0.1:43128
```

Necesitas [Node.js](https://nodejs.org/) 20+ y opcionalmente [Ollama](https://ollama.com/) para modelos locales.

## Gratis · Donativos

LEGADO es gratis bajo la [licencia MIT](./LICENSE). Si te ayuda, puedes apoyar el proyecto en **[Ko-fi](https://ko-fi.com/xoginger)** (Stripe) — detalles en [DONATIONS.md](./DONATIONS.md).

## Documentación

| Tema | Español | English |
| --- | --- | --- |
| **Cómo usar** (requisitos, setup, pasos, temas) | [docs/es/uso.md](./docs/es/uso.md) | [docs/en/usage.md](./docs/en/usage.md) |
| Plan / arquitectura | [docs/es/plan.md](./docs/es/plan.md) | [docs/en/plan.md](./docs/en/plan.md) |
| Guía de hardware local | [docs/es/equipo-local.md](./docs/es/equipo-local.md) | [docs/en/hardware.md](./docs/en/hardware.md) |
| Contribuir | [docs/es/contribuir.md](./docs/es/contribuir.md) | [docs/en/contributing.md](./docs/en/contributing.md) |
| Landing pública (Pages) | [web/](./web/) · [web/README.md](./web/README.md) | — |
| Código de conducta | [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | — |

## Licencia

[MIT](./LICENSE)
