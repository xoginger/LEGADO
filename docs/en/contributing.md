# Contributing

Thanks for helping LEGADO stay free, local-first, and useful for families.

## Principles

1. **Training first** — improve memory capture and text chat before voice/avatar/kiosk.
2. **Local-first** — do not make cloud accounts or remote DBs required.
3. **UI copy in Spanish** for product surfaces; docs in **Spanish and English**.
4. **Warm tone** — legacy presence, never sinister.

## Setup

```bash
npm install
npm run dev:entrenamiento
npm run dev:consulta
```

## Structure

- `apps/entrenamiento` — training platform
- `apps/consulta` — heir consultation UI
- `packages/shared` — types, storage, chat helpers, disk store
- `docs/en`, `docs/es` — documentation

## Pull requests

- Keep PRs focused.
- Do not add auth/cloud unless discussed.
- Update EN and ES docs when behavior changes.

## License

By contributing, you agree your contributions are licensed under the MIT License.
