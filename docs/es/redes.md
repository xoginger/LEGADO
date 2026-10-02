# Redes y perfil — alimentar el legado

Cómo conectar fuentes sociales y álbumes para crecer el **perfil** y la **base de conocimientos** (memorias), siempre **local-first**.

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
| Estado de conectores | `legado.importSources.v1` |
| Cola de importación | `legado.importJobs.v1` |
| Memorias resultantes | Igual que el resto del legado |

Nada de esto es el hogar de una nube ajena: los exports se leen **en el navegador / equipo**.

## Fuentes (UI Perfil / Fuentes)

Las cinco fuentes confirmadas aparecen siempre en Entrenamiento → **Perfil / Fuentes**:

| Fuente | Import MVP (sin secrets) | OAuth |
| --- | --- | --- |
| **Instagram** | ZIP/JSON de descarga de datos Meta | Stub — `LEGADO_META_APP_ID`, `LEGADO_META_APP_SECRET` |
| **Facebook** | ZIP/JSON export Meta (posts + eventos) | Mismo Meta stub |
| **X (Twitter)** | Archivo de X (JS/JSON/CSV/ZIP) | Stub — `LEGADO_X_CLIENT_ID`, `LEGADO_X_CLIENT_SECRET` |
| **Google Fotos** | Google Takeout (ZIP + JSON de metadatos) | Stub — `LEGADO_GOOGLE_CLIENT_ID`, `LEGADO_GOOGLE_CLIENT_SECRET` |
| **Apple Fotos** | Carpeta/álbum exportado o ZIP (sin OAuth) | No aplica (sandbox macOS intacto) |

### Cómo pedir el export oficial

1. **Instagram:** Configuración → Tu actividad → Descargar información (JSON/ZIP).
2. **Facebook:** Configuración → Tu información → Descargar tu información (JSON).
3. **X:** Ajustes → Tu cuenta → Descargar un archivo de tus datos.
4. **Google Fotos:** [Google Takeout](https://takeout.google.com) → Google Fotos.
5. **Apple Fotos (Mac):** selecciona álbum → Archivo → Exportar → Exportar fotos sin modificar (carpeta o ZIP). Opcional: un `manifest.json` con `assets[]`.

### Conectar (demo) vs OAuth real

- **Conectar (demo)** marca la fuente como conectada en local para demostrar el flujo (sin tokens).
- **Importar** siempre funciona con archivo/carpeta — **no bloquea** si faltan secrets.
- OAuth real queda documentado y stubbed: cuando existan las env vars, el estado puede pasar a «OAuth listo»; el MVP no llama a Meta/X/Google.

## Privacidad (tensión OAuth)

Las APIs de Meta, X y Google exigen registrar una app y, a menudo, mandar tráfico por sus servidores. Eso choca con **local-first**.

LEGADO prioriza:

1. Export oficial → parseo local → memorias.
2. OAuth solo como mejora opcional (nunca requisito del MVP).

La foto de perfil se guarda como data URL en el equipo; no se sube a un servicio de LEGADO.

## Uso rápido

1. Arranca Entrenamiento: `npm run dev:entrenamiento` → http://127.0.0.1:43127  
2. Pestaña **Perfil / Fuentes**.  
3. Edita nombre/bio/foto.  
4. En una fuente: **Conectar (demo)** opcional → **Importar** el ZIP/JSON/carpeta.  
5. Revisa la **cola** (vacío / carga / error / listo).  
6. Ve a **Memorias** o **Conversar**: el perfil enriquecido influye el chat.

### Fixture de prueba

En el repo: `docs/fixtures/social-sample.json` — formato genérico LEGADO (`items[]` con `kind`: `frase` | `foto` | `evento`). Puedes importarlo eligiendo p. ej. Instagram u otra fuente que acepte JSON.

## Variables de entorno (opcionales)

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

Sin ellas la app sigue usable al 100 % con import manual.

## Relacionado

- Uso general: [uso.md](./uso.md)
- Plan: [plan.md](./plan.md)
- English: [../en/social.md](../en/social.md)
