# LEGADO — Product plan (English)

This is the English companion to [`../es/plan.md`](../es/plan.md). The Agent Store copies at `/cursor/stores/self/docs/legado-plan.md` remain the working product context for the Cursor project; keep them in sync when the plan changes.

## What it is

LEGADO is a personal AI trained on someone’s knowledge, memories, phrases, and comments. Over time it becomes a warm conversational legacy for their children — not a generic chatbot.

## Principles

- Text first; voice/avatar later
- Warm, never sinister
- **Local-first** — data and model on the owner’s machine
- **Usable AI first** — training + text chat before kiosk, voice clone, or avatar
- Spanish UI copy; docs primarily ES + EN
- Free and open source (MIT) with optional donations

## Monorepo apps

| App | Role |
| --- | --- |
| `apps/entrenamiento` | Training: CRUD memories, configure Ollama/mock, test chat |
| `apps/consulta` | Consultation: heirs chat with the legacy (no memory editing) |
| `packages/shared` | Shared types, storage, ranking/mock chat, disk store |

## MVP (this slice)

- Local memories + text chat (Ollama preferred, mock fallback)
- Export/import JSON; optional shared disk store under `.legado-data/`
- Empty / loading / error states; desktop + mobile
- **Out of scope:** OS kiosk lockdown, heir auth, voice clone, avatar, cloud accounts

## Later phases (summary)

1. Stronger backup + local RAG embeddings  
2. Cloned voice TTS + visual avatar (local-first preferred; hybrid clone-once / play-local if needed)  
3. Roles (owner vs heir) + kiosk / appliance mode (OS is hidden, not removed)  
4. Richer presence (speech style, rituals)  
5. Cloud only if explicitly requested  

## Hardware

See [hardware.md](./hardware.md) / [equipo-local.md](../es/equipo-local.md). MXN ranges; recommended band for long-term legacy when starting from scratch.
