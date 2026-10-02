# Redes y perfil — alimentar el legado

Cómo usar fuentes sociales y álbumes para crecer el **perfil** y la **base de conocimientos** (memorias), siempre **local-first**.

## Qué se importa

| Tipo | Ejemplos | Memoria LEGADO |
| --- | --- | --- |
| **Fotos** (+ caption) | Posts IG/FB, Google/Apple Fotos | `foto` |
| **Frases / posts** | Captions, tweets, publicaciones | `frase` |
| **Eventos** | Eventos de Facebook / calendario social | `evento` |

Todo se normaliza a memorias locales (`localStorage` + `.legado-data/`). El chat de **Consulta** y **Entrenamiento** usa el perfil (nombre, bio) + esas memorias como contexto.

## Dónde vive

| Dato | Dónde |
| --- | --- |
| Perfil (nombre, bio, foto) | `legado.profile.v1` + disco |
| Estado de fuentes | `legado.importSources.v1` |
| Cola de importación | `legado.importJobs.v1` |
| Memorias resultantes | Igual que el resto del legado |

Nada de esto es el hogar de una nube ajena: los exports se leen **en el navegador / equipo**.

## Fuentes (UI Perfil / Fuentes)

Las cinco fuentes confirmadas aparecen siempre en Entrenamiento → **Perfil / Fuentes**:

| Fuente | Camino usable hoy | «Conectar» |
| --- | --- | --- |
| **Instagram** | **Importar archivo** (ZIP/JSON de descarga de datos Meta) | Próximamente (modal; no vincula cuenta) |
| **Facebook** | **Importar archivo** (ZIP/JSON export Meta: posts + eventos) | Próximamente (modal; no vincula cuenta) |
| **X (Twitter)** | **Importar archivo** (JS/JSON/CSV/ZIP del archivo de X) | Próximamente (modal; no vincula cuenta) |
| **Google Fotos** | **Importar archivo** (Google Takeout ZIP + JSON) | Próximamente (modal; no vincula cuenta) |
| **Apple Fotos** | **Importar carpeta** / ZIP (export desde Fotos en Mac) | No aplica (solo local; sandbox macOS intacto) |

### Cómo pedir el export oficial

1. **Instagram:** Configuración → Tu actividad → Descargar información (JSON/ZIP).
2. **Facebook:** Configuración → Tu información → Descargar tu información (JSON).
3. **X:** Ajustes → Tu cuenta → Descargar un archivo de tus datos.
4. **Google Fotos:** [Google Takeout](https://takeout.google.com) → Google Fotos.
5. **Apple Fotos (Mac):** selecciona álbum → Archivo → Exportar → Exportar fotos sin modificar (carpeta o ZIP). Opcional: un `manifest.json` con `assets[]`.

Cada tarjeta en la UI muestra un bloque **Cómo pedir el export** con la misma pista corta.

### Honestidad: no hay OAuth falso

- **Importar archivo / Importar carpeta** es la acción principal y el único camino que alimenta memorias hoy.
- **Conectar (próximamente)** abre un modal que explica que **no** hay login real: hace falta el export oficial. No marca la fuente como «conectada a Instagram» (ni a FB/X/Google).
- Estados en UI: **Sin importar** · **Listo para importar** (si quedó un estado demo antiguo) · **Importado** (tras un import exitoso). Nunca «conectado a …».
- OAuth real queda documentado con variables opcionales; el MVP **no** llama a Meta/X/Google. Sin secrets no se inventa una conexión.

## Privacidad (tensión OAuth)

Las APIs de Meta, X y Google exigen registrar una app y, a menudo, mandar tráfico por sus servidores. Eso choca con **local-first**.

LEGADO prioriza:

1. Export oficial → parseo local → memorias.
2. OAuth solo como mejora futura (nunca requisito del MVP).

La foto de perfil se guarda como data URL en el equipo; no se sube a un servicio de LEGADO.

## Uso rápido

1. Arranca Entrenamiento: `npm run dev:entrenamiento` → http://127.0.0.1:43127  
2. Pestaña **Perfil / Fuentes**.  
3. Edita nombre/bio/foto.  
4. En una fuente: lee **Cómo pedir el export** → **Importar archivo** o **Importar carpeta**.  
5. Revisa la **cola** (vacío / carga / error / listo).  
6. Ve a **Memorias** o **Conversar**: el perfil enriquecido influye el chat.

### Fixture de prueba

En el repo: `docs/fixtures/social-sample.json` — formato genérico LEGADO (`items[]` con `kind`: `frase` | `foto` | `evento`). Puedes importarlo eligiendo p. ej. Instagram u otra fuente que acepte JSON.

## Variables de entorno (opcionales, futuras)

```bash
# Meta (Instagram + Facebook) — futuras
LEGADO_META_APP_ID=
LEGADO_META_APP_SECRET=

# X
LEGADO_X_CLIENT_ID=
LEGADO_X_CLIENT_SECRET=

# Google Fotos
LEGADO_GOOGLE_CLIENT_ID=
LEGADO_GOOGLE_CLIENT_SECRET=
```

Sin ellas la app sigue usable al 100 % con import manual. Tenerlas no activa OAuth en este MVP.

## Relacionado

- Uso general: [uso.md](./uso.md)
- Plan: [plan.md](./plan.md)
- English: [../en/social.md](../en/social.md)
