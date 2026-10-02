# Redes y perfil — export → import

**Camino oficial (decisión tomada):** alimentar el perfil **importando las descargas** (ZIP / JSON / JS / CSV / carpeta). No hay OAuth automático por ahora.

En Entrenamiento → **Perfil / Fuentes**, la acción principal es **Importar archivo** o **Importar carpeta**. Todo se parsea **en tu equipo** (`localStorage` + `.legado-data/`).

OAuth / «conectar de verdad» queda como **futuro opcional y aplazado**. Detalle técnico: [oauth-fuentes.md](./oauth-fuentes.md).

## Qué se importa

| Tipo | Ejemplos | Memoria LEGADO |
| --- | --- | --- |
| **Fotos** (+ caption) | Posts IG/FB, Google/Apple Fotos | `foto` |
| **Frases / posts** | Captions, tweets, publicaciones | `frase` |
| **Eventos** | Eventos de Facebook / calendario social | `evento` |

El chat de **Consulta** y **Entrenamiento** usa el perfil (nombre, bio) + esas memorias.

## Flujo general (todas las fuentes)

1. En la red o app de fotos, pide el **export / descarga de datos** (pasos abajo).
2. Espera el archivo o carpeta (a veces tarda horas/días; Meta y Google avisan por correo).
3. Abre LEGADO Entrenamiento → http://127.0.0.1:43127 → pestaña **Perfil / Fuentes**.
4. En la tarjeta de la fuente → **Importar archivo** (o **Importar carpeta** en Apple Fotos).
5. Revisa la **cola** (vacío / cargando / listo / error).
6. Ve a **Memorias** o **Conversar**: el perfil enriquecido ya cuenta como contexto.

### Fixture de prueba

`docs/fixtures/social-sample.json` — formato genérico LEGADO (`items[]` con `kind`: `frase` | `foto` | `evento`). Impórtalo eligiendo cualquier fuente que acepte JSON (p. ej. Instagram).

---

## Por fuente: export → import

### Instagram

| | |
| --- | --- |
| **En Instagram** | Configuración → Tu actividad → **Descargar información** (o Centro de cuentas → Tu información y permisos → Descargar tu información). Elige JSON (o ZIP que lo contenga). |
| **Qué trae LEGADO** | Posts / captions → `frase` o `foto` según el ítem. |
| **En LEGADO** | Perfil / Fuentes → Instagram → **Importar archivo** → elige el ZIP o JSON. |

### Facebook

| | |
| --- | --- |
| **En Facebook** | Configuración y privacidad → Tu información de Facebook → **Descargar tu información**. Formato JSON; incluye publicaciones y, si lo marcas, eventos. |
| **Qué trae LEGADO** | Posts → `frase`/`foto`; eventos → `evento`. |
| **En LEGADO** | Perfil / Fuentes → Facebook → **Importar archivo** → ZIP o JSON. |

### X (Twitter)

| | |
| --- | --- |
| **En X** | Ajustes y privacidad → Tu cuenta → **Descargar un archivo de tus datos**. Espera el correo; descarga el ZIP. |
| **Qué trae LEGADO** | Tweets / media referenciados → `frase` / `foto` según el parseo. Acepta JS, JSON, CSV o ZIP. |
| **En LEGADO** | Perfil / Fuentes → X → **Importar archivo** → ZIP o archivo suelto del archive. |

### Google Fotos

| | |
| --- | --- |
| **En Google** | [Google Takeout](https://takeout.google.com) → desmarca todo → marca **Google Fotos** → exportar (ZIP, a menudo varios). |
| **Qué trae LEGADO** | Fotos + JSON de metadatos/captions → `foto` (y texto asociado si viene). |
| **En LEGADO** | Perfil / Fuentes → Google Fotos → **Importar archivo** → el ZIP de Takeout (o JSON si aplica). |

> Nota: no hace falta «conectar» Google con OAuth. Takeout es el camino bulk correcto.

### Apple Fotos (Mac)

| | |
| --- | --- |
| **En Fotos (Mac)** | Selecciona álbum o fotos → menú **Archivo → Exportar → Exportar fotos sin modificar** (carpeta) o comprime a ZIP. Opcional: un `manifest.json` con `assets[]` si lo tienes. |
| **Qué trae LEGADO** | Imágenes (y captions del manifest si existe) → `foto`. |
| **En LEGADO** | Perfil / Fuentes → Apple Fotos → **Importar carpeta** (o archivo ZIP). |

> Apple no ofrece login OAuth web para la biblioteca personal. Solo export local.

---

## Estados en la UI

| Badge | Significado |
| --- | --- |
| **Sin importar** | Aún no has traído un export. |
| **Listo para importar** | Estado antiguo de demo; no implica cuenta vinculada. |
| **Importado** | Hubo un import exitoso (ítems en memorias). |

Nunca «conectado a Instagram/FB/…». El botón **Conectar (próximamente)** solo explica que OAuth está **aplazado**; no vincula nada.

## Privacidad

- Parseo **local**; los exports no se suben a un servidor de LEGADO.
- OAuth automático está **aplazado** a propósito (local-first + decisión de producto). Si algún día se retoma: [oauth-fuentes.md](./oauth-fuentes.md).

## Relacionado

- OAuth (futuro aplazado): [oauth-fuentes.md](./oauth-fuentes.md)
- Uso general: [uso.md](./uso.md)
- Plan: [plan.md](./plan.md)
- English: [../en/social.md](../en/social.md)
