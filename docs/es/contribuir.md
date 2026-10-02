# Contribuir

Gracias por ayudar a que LEGADO siga siendo gratis, local-first y útil para familias.

## Principios

1. **Entrenamiento primero** — mejorar captura de memorias y chat de texto antes de voz/avatar/quiosco.
2. **Local-first** — no exigir cuentas en la nube ni bases remotas.
3. **Copy de UI en español**; documentación en **español e inglés**.
4. **Tono cálido** — presencia de legado, nunca siniestro.

## Setup

```bash
npm install
npm run dev:entrenamiento
npm run dev:consulta
```

## Estructura

- `apps/entrenamiento` — plataforma de entrenamiento
- `apps/consulta` — interfaz de consulta para herederos
- `packages/shared` — tipos, storage, chat, store en disco
- `docs/en`, `docs/es` — documentación

## Pull requests

- PRs enfocados.
- No añadir auth/nube sin discutirlo.
- Actualizar docs EN y ES si cambia el comportamiento.

## Licencia

Al contribuir, aceptas que tus aportes se licencian bajo MIT.
