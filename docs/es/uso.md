# Uso de LEGADO

Guía práctica: requisitos mínimos, configurar el equipo e instrucciones de uso (entrenamiento, consulta y temas de interfaz).

Documentación relacionada: [plan](./plan.md) · [equipo local](./equipo-local.md) · [contribuir](./contribuir.md)

---

## 1. Requisitos mínimos

| Requisito | Mínimo | Notas |
| --- | --- | --- |
| **Node.js** | **20+** | Necesario para las apps Next.js. |
| **npm** | 10+ (viene con Node) | Workspaces del monorepo. |
| **Navegador** | Chromium / Firefox / Safari recientes | Desktop o móvil. |
| **RAM (solo app)** | 4 GB libres | Sin modelo local aún. |
| **RAM / VRAM (con Ollama)** | Ver [equipo-local.md](./equipo-local.md) | ~16 GB unificados (Mac) o 8 GB VRAM + 16 GB RAM (PC) para un 7B. |
| **Disco** | ≥2 GB libres (+ modelos) | Reserva ≥50 GB si vas a probar varios modelos. |
| **Sistema** | macOS, Windows o Linux | Local-first: todo corre en tu máquina. |
| **Ollama** | Opcional | Si no hay modelo, LEGADO usa **mock** con tus memorias. |

No hace falta cuenta en la nube, base de datos remota ni API key para el camino recomendado.

---

## 2. Configurar el equipo

### Clonar e instalar

```bash
git clone https://github.com/xoginger/LEGADO.git
cd LEGADO
npm install
```

En el Mac Air del mantenedor el checkout vive en la unidad externa XR: `/Volumes/XR/LEGADO`.

### Arrancar las apps

```bash
npm run dev:entrenamiento   # http://127.0.0.1:43127
npm run dev:consulta        # http://127.0.0.1:43128  (otra terminal)
```

También: `npm run build` / `npm run build:entrenamiento` / `npm run build:consulta`.

### Modelo local (recomendado)

1. Instala [Ollama](https://ollama.com).
2. Descarga un modelo, por ejemplo: `ollama pull llama3.2`.
3. En **Entrenamiento → Ajustes**, deja el motor en **Ollama / runtime local** (URL por defecto `http://127.0.0.1:11434`).
4. Si Ollama no responde, LEGADO cae al **mock** automáticamente.

Guía de compra / rangos de hardware (MXN): [equipo-local.md](./equipo-local.md).

---

## 3. Instrucciones de uso

### Entrenamiento (`apps/entrenamiento`)

1. Abre http://127.0.0.1:43127.
2. Crea **memorias** (recuerdo, frase, comentario, conocimiento).
3. Prueba el **chat** con el contexto de esas memorias.
4. En **Ajustes**: nombre de la persona, motor (Ollama / mock / cloud opcional), **tema de interfaz** y export JSON.

### Consulta (`apps/consulta`)

1. Abre http://127.0.0.1:43128.
2. **Importa** un JSON exportado desde Entrenamiento, o usa el store en disco si ambas apps apuntan al mismo equipo.
3. Solo conversas: no se editan memorias.
4. Botón **Tema**: misma paleta de skins que Entrenamiento (persistida en este navegador).

### Temas de interfaz (skins)

En **Ajustes** (Entrenamiento) o **Tema** (Consulta) puedes elegir:

| Tema | Idea |
| --- | --- |
| **Legado** | Por defecto: cálido, memorial, verde salvia + dorado. |
| **Matrix** | Terminal verde, tipografía mono. |
| **Jarvis** | HUD cian / asistente técnico. |
| **Anime** | Pastel expresivo, tipografía redondeada. |
| **Pergamino** | Tinta sepia sobre papel antiguo. |
| **Noche mínima** | Oscuro sobrio, tipografía clara. |

- Al pasar el cursor / enfocar una tarjeta ves una **vista previa**.
- La elección se guarda en `localStorage` (`legado.theme.v1` + ajustes) y la **comparten** Entrenamiento y Consulta en el mismo navegador.
- Tipografías y motion sutil cambian por skin (CSS variables en `packages/shared/themes`).

### Icono de marca

Assets en `packages/shared/assets/` (SVG + PNG), copiados a `apps/*/public/brand/` y `web/brand/` para landing / GitHub. Favicon y cabecera de ambas apps usan la marca LEGADO (libro + brote).

### Export / backup

Desde Ajustes de Entrenamiento: **Exportar memorias (JSON)**. Ese archivo se puede importar en Consulta.

---

## 4. Uso gratuito y donativos

LEGADO es **gratis** (MIT). Donativos opcionales vía **Ko-fi (Stripe)**: https://ko-fi.com/xoginger — detalles en [DONATIONS.md](../../DONATIONS.md).

---

## 5. Fuera de esta guía (fases posteriores)

Voz clonada, avatar y modo quiosco / lockdown del OS **no bloquean** el uso actual de texto. Ver [plan.md](./plan.md).
