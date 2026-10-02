# LEGADO — Plan de producto

## Qué es

LEGADO es una IA personal entrenada con los conocimientos, recuerdos, frases y comentarios de una persona. Se alimenta con el tiempo. Cuando esa persona ya no esté, debe servir de recuerdo y de contacto póstumo para sus hijos: una forma cálida de seguir escuchando su voz, su criterio y su forma de hablar.

No es un chatbot genérico. Es un legado conversacional.

## Principios

- **Texto primero.** La base son memorias escritas; voz y multimedia vienen después.
- **Cálido, no siniestro.** El tono es de legado, cariño y continuidad; nunca de horror o dramatismo morboso.
- **Local-first (decisión tomada).** Datos y modelo viven en el equipo privado del legador. La nube ajena no es el hogar de la IA.
- **Primero IA usable (decisión tomada).** El MVP entrega memorias + chat **texto** local. Quiosco, **voz clonada** y **avatar** son fases posteriores y **no bloquean** el primer slice.
- **Entrenamiento gradual.** No hace falta “terminar” el legado: se va construyendo memoria a memoria.
- **Español.** Conversación y copy de la interfaz en español.

## Arquitectura local-first

```
┌─────────────────────────────────────────────┐
│  Equipo privado del legador                 │
│                                             │
│  ┌──────────────┐    ┌───────────────────┐  │
│  │ App LEGADO   │───▶│ Memorias (local)  │  │
│  │ (Next.js)    │    │ localStorage /    │  │
│  │              │    │ futuro: SQLite    │  │
│  └──────┬───────┘    └───────────────────┘  │
│         │                                   │
│         ▼                                   │
│  ┌──────────────────┐                       │
│  │ Runtime local    │  Ollama (Win/Linux/  │
│  │ LLM + RAG        │  Mac) o MLX (Mac)    │
│  └──────────────────┘                       │
│         │                                   │
│         ▼                                   │
│  ┌──────────────────┐                       │
│  │ Export / backup  │  JSON → herederos    │
│  │ (Fase 2+)        │  (+ voz/avatar lue.) │
│  └──────────────────┘                       │
└─────────────────────────────────────────────┘
```

| Capa | Dónde vive | Notas |
| --- | --- | --- |
| Memorias y chat texto | Máquina del usuario | Hoy: `localStorage`. Luego: archivo/SQLite en disco. |
| Modelo LLM | Máquina del usuario | Ollama o MLX; sin dependencia de nube. |
| Retrieval (RAG) | Máquina del usuario | Ranking local; embeddings locales más adelante. |
| Voz / avatar | Fase siguiente | Preferir local-first; ver sección dedicada. |
| Entrega a hijos | Export/backup offline | Paquete exportable; no cuenta en la nube como camino principal. |
| Quiosco / lockdown OS | Fase posterior | El OS no se omite: se oculta y bloquea. |

**Fallbacks del MVP:** si no hay runtime local → respuesta **mock** a partir de las memorias. API cloud solo como escape hatch opcional.

Guía de hardware: [`equipo-local.md`](./equipo-local.md).

## Personas y roles (visión)

| Rol | Quién | Qué puede hacer |
| --- | --- | --- |
| **Titular** (legador) | Quien escribe y configura | Crear/editar memorias, ajustes, export, entrenar presencia (voz/avatar más adelante). Auth real = fase posterior. |
| **Heredero** | Hijos / familia | Idealmente **solo chat** (texto, luego voz/avatar). Quiosco + modo heredero = fase posterior. |

En el **MVP actual** no hay separación de roles con auth: el mismo usuario ve memorias y chat texto.

## Aparato / quiosco — honestidad y aplazamiento

**Pregunta frecuente:** “¿Un Mac que inicie directo la IA sin pasar por macOS?”

**Respuesta honesta:** no se omite el sistema operativo. macOS (o Linux) sigue arrancando por debajo. Lo que se busca es un **modo quiosco / aparato**: autoarranque de LEGADO a pantalla completa, escritorio oculto y salida protegida con contraseña.

| Opción | Cómo se siente | Notas |
| --- | --- | --- |
| **macOS** | Auto-login + app/navegador a pantalla completa; salir pide clave. | Viable; el OS sigue ahí, escondido. |
| **Linux kiosk** | Sesión mínima que solo lanza LEGADO (+ Ollama). | A menudo más “aparato” y más fácil de endurecer. |

**Alcance:** lockdown OS y modo heredero con auth = **fuera del MVP**. Primero IA usable en texto.

## MVP (este primer slice)

Objetivo: **IA usable en texto** — guardar memorias y chatear en local, en español, con tono cálido.

### Incluye

1. **Memorias (CRUD local)** — recuerdo, frase, comentario, conocimiento; `localStorage`.
2. **Chat texto** — contexto desde memorias; **Ollama** preferido; **mock** si no hay modelo; API cloud opcional.
3. **Estados** — vacío, carga, error.
4. **Responsive** — escritorio y móvil.
5. **Preparación barata** — export JSON; ajustes de Ollama; layout que no rompa en fullscreen (sin lockdown).

### Fuera del MVP (explícito)

- Voz clonada / TTS con su voz.
- Avatar / retrato animado / talking head.
- Modo quiosco / autoarranque / ocultar escritorio.
- Auth titular vs heredero.
- Cuentas, nube, DB remota, fine-tuning, app nativa.

## Después del MVP (roadmap)

### Fase 2 — Respaldo + retrieval

- Export/import robusto; SQLite en disco; embeddings locales.
- (Opcional) pulir fullscreen; **aún no** lockdown OS ni voz/avatar.

### Fase 3 — Voz clonada + avatar (presencia)

**Después** del chat texto usable. No bloquean ni forman parte del MVP.

#### Voz (TTS con voz suya)

- Objetivo: oír las respuestas con una **voz clonada** del legador (español).
- **Preferencia local-first:** sintetizar en el equipo cuando el stack lo permita (TTS local + perfil/checkpoint del titular).
- **Tensión con la nube:** muchos clonadores de alta calidad piden subir audio a terceros — choca con local-first.
- **Híbrido aceptable si hace falta:** (1) clonar/entrenar el timbre una vez (cloud u offline dedicado), (2) exportar un **perfil de voz portable**, (3) **reproducir siempre en local** (el chat no manda frases a la nube).
- Fallback: TTS genérico en español o solo texto.

#### Avatar (representación visual suya)

- De menos a más: **retrato** → retrato animado leve → **avatar parlante** (labios/gesto con la voz).
- **Preferencia local-first:** assets e inferencia en disco privado; evitar SaaS que suban la cara en cada conversación.
- Híbrido posible: generar el asset una vez, reproducir offline.

#### Captura: qué necesita grabar/fotografiar

| Material | Para qué | Orientación |
| --- | --- | --- |
| **Audio limpio** | Clonar voz | Varios minutos (ideal ~5–30+ min) de habla en español; lectura + conversación; poco eco, sin música. |
| **Frases suyas** | Naturalidad | Cómo habla de verdad, no solo lectura plana. |
| **Fotos claras del rostro** | Avatar / retrato | Frontales y ¾, buena luz; varias tomas. |
| **Vídeo corto (opcional)** | Avatar parlante | 1–5 min a cámara ayuda lip-sync y gesto. |

**Estado:** se preguntó al usuario si **ya tiene** grabaciones y fotos; hasta responder, se asume captura más adelante. **No bloquea** el MVP texto.

#### Hardware

Voz + avatar **suben** RAM/VRAM/disco vs solo chat. Detalle en [`equipo-local.md`](./equipo-local.md): rango Recomendado sigue siendo base para texto; voz+avatar empujan a Recomendado alto u Holgado.

### Fase 4 — Roles y aparato (quiosco)

- Modo heredero (solo chat) vs titular (config con contraseña).
- Lockdown OS (macOS quiosco o Linux kiosk).
- Paquete offline: memorias + perfil de voz + assets de avatar.

### Fase 5 — Presencia ampliada

- Manera de hablar; rituales suaves; mensajes/cartas.

### Fase 6 — Nube solo si el usuario lo pide

- Nunca default.

## Decisiones por defecto

| Tema | Default |
| --- | --- |
| Medio | **Texto primero** (MVP) |
| Voz / avatar | **Fase siguiente** (no bloquean MVP) |
| Almacenamiento | Local (`localStorage` hoy) |
| LLM | Ollama/MLX → mock |
| Idioma | Español |
| Prioridad entrega | **IA usable** (memorias + chat texto) |
| Quiosco | Fase posterior |
| Clonación voz/avatar | Local-first preferido; híbrido solo si hace falta |
| Hardware | Parte de cero; MXN; sin tope → **Recomendado** para texto; holgura extra si se planea voz+avatar |

## Métricas de éxito del MVP

- CRUD de memorias en local.
- Chat texto cálido en español (mock u Ollama).
- Mock no bloquea si falta runtime.
- UI clara en móvil y escritorio.
- Quiosco, voz y avatar **no** son criterio de “listo”.

## Riesgos y cuidados

- Expectativas: recuerdo conversacional, no “ser” la persona.
- Pérdida de datos locales → export pronto (Fase 2).
- Hardware 7B–14B + holgura si hay voz/avatar.
- No vender “Mac sin macOS”: es quiosco, no omisión del OS.
- Clonación cloud: riesgo de subir voz/cara — preferir local o híbrido con reproducción offline.

## Monorepo open source

| Ruta | Rol |
| --- | --- |
| `apps/entrenamiento` | Plataforma de entrenamiento (primero): memorias + config + chat de prueba |
| `apps/consulta` | Interfaz de consulta para hijos/familia (solo chat) |
| `packages/shared` | Tipos, storage, ranking/mock, store en disco (`.legado-data/`) |

Licencia MIT · uso gratuito · donativos opcionales (`DONATIONS.md`, enlace pendiente).

## Stack del primer slice

- Next.js + TypeScript + Tailwind + shadcn/ui (npm workspaces)
- Persistencia: `localStorage` + store en disco compartido
- Chat: Ollama local (preferido) + mock + API cloud opcional

## Resumen

**MVP = memorias locales + chat texto cálido (Ollama o mock) en dos apps (entrenamiento y consulta). Voz clonada, avatar, quiosco y roles con auth son fases siguientes y no frenan la IA usable.**
