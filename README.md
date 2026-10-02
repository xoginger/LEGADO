# LEGADO

IA personal entrenada con tus conocimientos, recuerdos, frases y comentarios. La vas alimentando con el tiempo; el día que ya no estés, puede servir de recuerdo y contacto póstumo para tus hijos — con tono cálido, nunca siniestro.

## Qué incluye este MVP

- **Memorias locales**: crear, editar y eliminar recuerdos, frases, comentarios y conocimientos (guardados en el navegador).
- **Chat**: conversación en español que usa esas memorias como contexto.
- **Local-first**: motor preferido **Ollama** en `localhost`; **mock** si no hay modelo; API cloud solo como escape hatch.
- **Exportar memorias** a JSON desde Ajustes (base para backup/herederos).
- Interfaz en español, usable en escritorio y móvil.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre [http://127.0.0.1:43127](http://127.0.0.1:43127).

Otros comandos:

```bash
npm run build
npm start
npm run lint
```

## Privacidad

Las memorias y el historial de chat viven en `localStorage` de este navegador. No hay cuentas ni base de datos remota en este slice. Si configuras una API key, se guarda solo en el navegador y se envía desde tu máquina a la ruta local `/api/chat` (y de ahí al proveedor, si activas el modo API).

## Stack

Next.js, TypeScript, Tailwind CSS, shadcn/ui.
