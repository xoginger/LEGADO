# Cómo usar LEGADO

Guía práctica: **requisitos mínimos**, **configuración del equipo** e **instrucciones de uso**.  
Para decidir compra de hardware (rangos MXN, Mac vs PC), ver [equipo-local.md](./equipo-local.md).

---

## 1. Requisitos mínimos

### Software

| Requisito | Detalle |
| --- | --- |
| **Node.js** | **20+** (`node -v`) |
| **npm** | Viene con Node |
| **Git** | Para clonar el repo |
| **Navegador** | Chromium, Safari o Firefox actual |
| **SO** | macOS, Windows o Linux |

### Hardware (para correr las apps)

| Uso | Orientación |
| --- | --- |
| Solo UI + **modo mock** (sin modelo local) | Cualquier portátil reciente con **8 GB RAM** sirve para escribir memorias y probar la interfaz |
| Chat local con Ollama (~7B) | **16 GB RAM** (Mac unificada) o **16 GB RAM + ~8 GB VRAM** (PC NVIDIA) — ver [equipo-local.md](./equipo-local.md) |
| Modelos ~13–14B cómodos | **32 GB** unificados (Mac) o **32 GB RAM + ≥12 GB VRAM** (PC) |
| Disco | Espacio para el repo + `node_modules`; si usas Ollama, reserva **varios GB por modelo** (y ≥50 GB libres si pruebas varios) |

**Ollama es opcional.** Sin él, LEGADO responde en **modo mock** a partir de tus memorias (útil para UI y flujo).

### Puertos

| App | Puerto | URL |
| --- | --- | --- |
| Entrenamiento | **43127** | http://127.0.0.1:43127 |
| Consulta | **43128** | http://127.0.0.1:43128 |
| Ollama (si lo usas) | **11434** | http://127.0.0.1:11434 |

---

## 2. Configurar el equipo

### 2.1 Instalar Node y Git

- **macOS:** [nodejs.org](https://nodejs.org) (LTS 20+) o `brew install node`; Git suele venir con Xcode CLT (`xcode-select --install`).
- **Windows:** instalador LTS de Node + Git for Windows.
- **Linux:** Node 20+ desde el gestor de tu distro o NodeSource; `git` del sistema.

Comprueba:

```bash
node -v   # v20 o superior
npm -v
git --version
```

### 2.2 Clonar el repositorio

```bash
git clone https://github.com/xoginger/LEGADO.git
cd LEGADO
npm install
```

#### Path recomendado en MacBook Air (disco externo XR)

Si el SSD interno va justo de espacio, clona en la unidad externa **XR** (no en `$HOME` ni en el disco interno):

```bash
# XR montada en /Volumes/XR
git clone https://github.com/xoginger/LEGADO.git /Volumes/XR/LEGADO
cd /Volumes/XR/LEGADO
npm install
```

### 2.3 (Opcional) Ollama + modelo

1. Instala [Ollama](https://ollama.com) para tu SO.
2. Descarga un modelo pequeño para empezar:

```bash
ollama pull llama3.2
```

3. Deja Ollama en marcha. En la app de **Entrenamiento**, el proveedor por defecto apunta a Ollama local.
4. Prueba: `curl http://127.0.0.1:11434` — si responde, el runtime está vivo.

Sin Ollama no pasa nada: usa el **mock** y sigue creando memorias.

### 2.4 Arrancar las apps

```bash
# Terminal 1 — primero siempre entrenamiento
npm run dev:entrenamiento
# → http://127.0.0.1:43127

# Terminal 2 — consulta (cuando quieras la vista heredero)
npm run dev:consulta
# → http://127.0.0.1:43128
```

Si el puerto está ocupado, cierra otros `next dev` o libera 43127/43128.

---

## 3. Instrucciones de uso (paso a paso)

### Paso A — Entrenamiento primero

1. Abre http://127.0.0.1:43127
2. Crea **3–5 memorias** (frase, recuerdo, comentario, conocimiento).
3. Abre el **chat** en la misma app y pregunta algo que solo esté en esas memorias.
4. Si tienes Ollama: confirma respuestas con el modelo local. Si no: el **mock** usa el texto de tus memorias.

### Paso B — Exportar

1. En Entrenamiento, **exporta** el legado a JSON (respaldo y puente hacia consulta).
2. Guarda el archivo en un sitio seguro (idealmente también en disco externo / backup).

### Paso C — Consulta (herederos)

1. Abre http://127.0.0.1:43128
2. **Importa** el JSON (o usa el store en disco compartido cuando esté configurado).
3. Conversar solo — la interfaz de consulta está pensada para hijos/familia, no para editar el legado.

### Paso D — Temas / skins de interfaz

La personalización visual (p. ej. Matrix, Jarvis, anime, tema por defecto) vive **en las apps**, no en esta landing.  
Cuando el selector de temas esté disponible en Entrenamiento/Consulta, elige el skin en ajustes de la app. La landing solo muestra un **preview**; el switcher completo no se implementa en GitHub Pages.

### Checklist rápido

- [ ] Node 20+ e `npm install` OK  
- [ ] Entrenamiento en `:43127`  
- [ ] Memorias creadas + chat probado (mock u Ollama)  
- [ ] Export JSON  
- [ ] Consulta en `:43128` con import  
- [ ] Todo offline (sin depender de nube ajena)

---

## Si algo falla

| Síntoma | Qué mirar |
| --- | --- |
| `node` viejo | Actualiza a Node 20+ |
| Puerto ocupado | Cierra otros Next; confirma 43127 / 43128 |
| Ollama no conecta | `curl http://127.0.0.1:11434` y ajustes en Entrenamiento |
| Poco espacio en Mac | Clona en `/Volumes/XR/LEGADO` (ver arriba) |

---

## Enlaces

- Plan: [plan.md](./plan.md)
- Hardware / compra: [equipo-local.md](./equipo-local.md)
- Contribuir: [contribuir.md](./contribuir.md)
- Donativos: [../../DONATIONS.md](../../DONATIONS.md) · [Ko-fi](https://ko-fi.com/xoginger)
- Repo: https://github.com/xoginger/LEGADO
- Landing (GitHub Pages): https://xoginger.github.io/LEGADO/

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
