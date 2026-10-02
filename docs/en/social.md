# Social sources & profile — feeding the legacy

How to connect social sources and photo libraries to grow the **profile** and **knowledge base** (memories), always **local-first**.

## What gets imported

| Kind | Examples | LEGADO memory |
| --- | --- | --- |
| **Photos** (+ caption) | IG/FB posts, Google/Apple Photos | `foto` |
| **Phrases / posts** | Captions, tweets, status updates | `frase` |
| **Events** | Facebook / social calendar events | `evento` |

Everything normalizes to local memories (`localStorage` + `.legado-data/`). **Consultation** and **Training** chat use the profile (name, bio) plus those memories as context.

## Where it lives

| Data | Where |
| --- | --- |
| Profile (name, bio, photo) | `legado.profile.v1` + disk |
| Connector state | `legado.importSources.v1` |
| Import queue | `legado.importJobs.v1` |
| Resulting memories | Same as the rest of the legacy |

No third-party cloud is the home for this data: exports are read **on the browser / machine**.

## Sources (Profile / Sources UI)

These five confirmed sources always appear in Training → **Perfil / Fuentes**:

| Source | MVP import (no secrets) | OAuth |
| --- | --- | --- |
| **Instagram** | Meta data download ZIP/JSON | Stub — `LEGADO_META_APP_ID`, `LEGADO_META_APP_SECRET` |
| **Facebook** | Meta export ZIP/JSON (posts + events) | Same Meta stub |
| **X (Twitter)** | X archive (JS/JSON/CSV/ZIP) | Stub — `LEGADO_X_CLIENT_ID`, `LEGADO_X_CLIENT_SECRET` |
| **Google Photos** | Google Takeout (ZIP + metadata JSON) | Stub — `LEGADO_GOOGLE_CLIENT_ID`, `LEGADO_GOOGLE_CLIENT_SECRET` |
| **Apple Photos** | Exported album/folder or ZIP (no OAuth) | N/A (macOS sandbox untouched) |

### Official export tips

1. **Instagram:** Settings → Your activity → Download information (JSON/ZIP).
2. **Facebook:** Settings → Your information → Download your information (JSON).
3. **X:** Settings → Your account → Download an archive of your data.
4. **Google Photos:** [Google Takeout](https://takeout.google.com) → Google Photos.
5. **Apple Photos (Mac):** select album → File → Export → Export Unmodified Original (folder or ZIP). Optional: `manifest.json` with `assets[]`.

### Demo connect vs real OAuth

- **Connect (demo)** marks the source connected locally to show the flow (no tokens).
- **Import** always works via file/folder — **does not block** if secrets are missing.
- Real OAuth is documented and stubbed; when env vars exist, status can become “OAuth ready”. The MVP does not call Meta/X/Google.

## Privacy (OAuth tension)

Meta, X, and Google APIs require app registration and often route traffic through their servers. That conflicts with **local-first**.

LEGADO prioritizes:

1. Official export → local parse → memories.
2. OAuth only as an optional upgrade (never an MVP requirement).

The profile photo is stored as a local data URL; it is not uploaded to any LEGADO service.

## Quick start

1. Start Training: `npm run dev:entrenamiento` → http://127.0.0.1:43127  
2. Open **Perfil / Fuentes**.  
3. Edit name/bio/photo.  
4. On a source: optional **Connect (demo)** → **Import** ZIP/JSON/folder.  
5. Check the **queue** (empty / loading / error / done).  
6. Open **Memorias** or **Conversar**: the enriched profile shapes chat context.

### Test fixture

Repo file: `docs/fixtures/social-sample.json` — generic LEGADO format (`items[]` with `kind`: `frase` | `foto` | `evento`). Import it via any JSON-accepting source (e.g. Instagram).

## Optional environment variables

```bash
LEGADO_META_APP_ID=
LEGADO_META_APP_SECRET=
LEGADO_X_CLIENT_ID=
LEGADO_X_CLIENT_SECRET=
LEGADO_GOOGLE_CLIENT_ID=
LEGADO_GOOGLE_CLIENT_SECRET=
```

Without them the app remains fully usable with manual import.

## Related

- Usage: [usage.md](./usage.md)
- Plan: [plan.md](./plan.md)
- Español: [../es/redes.md](../es/redes.md)
