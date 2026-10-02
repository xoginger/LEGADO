# LEGADO

**Gratis y open source.** IA personal local-first: captura tus memorias, frases y conocimientos; más adelante, tu familia puede conversar con esa presencia.

<p align="center">
  <img src="./packages/shared/assets/legado-mark.svg" alt="LEGADO" width="96" height="96" />
</p>

> English README: [README.md](./README.md)

## Dos aplicaciones

| App | Ruta | Propósito | URL de desarrollo |
| --- | --- | --- | --- |
| **Entrenamiento** | `apps/entrenamiento` | Capturar y editar memorias, configurar LLM local, probar el chat, elegir tema | http://127.0.0.1:43127 |
| **Consulta** | `apps/consulta` | Interfaz para hijos/familia — solo chat (importar JSON o store en disco compartido) | http://127.0.0.1:43128 |

La lógica compartida está en `packages/shared` (incluye **skins/temas** y assets de marca).

**Prioridad:** primero entrenamiento + chat de texto. Voz clonada, avatar y modo quiosco vienen después.

## Arranque rápido

```bash
npm install
npm run dev:entrenamiento   # app de entrenamiento
npm run dev:consulta        # app de consulta (otra terminal)
```

Modelo local opcional: instala [Ollama](https://ollama.com), descarga un modelo (p. ej. `ollama pull llama3.2`) y deja el proveedor por defecto en Ajustes de Entrenamiento.

## Uso gratuito · Donativos

LEGADO es gratuito bajo la [licencia MIT](./LICENSE). Apoyo opcional vía **Ko-fi (Stripe)**: [ko-fi.com/xoginger](https://ko-fi.com/xoginger) — ver [DONATIONS.md](./DONATIONS.md).

## Documentación

| Tema | Español | English |
| --- | --- | --- |
| **Requisitos y uso** | [docs/es/uso.md](./docs/es/uso.md) | [docs/en/usage.md](./docs/en/usage.md) |
| Plan / arquitectura | [docs/es/plan.md](./docs/es/plan.md) | [docs/en/plan.md](./docs/en/plan.md) |
| Guía de equipo local | [docs/es/equipo-local.md](./docs/es/equipo-local.md) | [docs/en/hardware.md](./docs/en/hardware.md) |
| Contribuir | [docs/es/contribuir.md](./docs/es/contribuir.md) | [docs/en/contributing.md](./docs/en/contributing.md) |
| Código de conducta | [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | — |

Los temas de interfaz (Legado, Matrix, Jarvis, Anime, Pergamino, Noche mínima) están en la guía de uso y se eligen en **Ajustes / Tema**.

## Licencia

[MIT](./LICENSE)
