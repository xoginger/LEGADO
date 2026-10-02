# Social sources & profile — feeding the legacy

How to use social sources and photo libraries to grow the **profile** and **knowledge base** (memories), always **local-first**.

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
| Source state | `legado.importSources.v1` |
| Import queue | `legado.importJobs.v1` |
| Resulting memories | Same as the rest of the legacy |

No third-party cloud is the home for this data: exports are read **on the browser / machine**.

## Sources (Profile / Sources UI)

These five confirmed sources always appear in Training → **Perfil / Fuentes**:

| Source | Usable path today | “Connect” |
| --- | --- | --- |
| **Instagram** | **Import file** (Meta data download ZIP/JSON) | Coming soon (modal; does not link an account) |
| **Facebook** | **Import file** (Meta export ZIP/JSON: posts + events) | Coming soon (modal; does not link an account) |
| **X (Twitter)** | **Import file** (X archive JS/JSON/CSV/ZIP) | Coming soon (modal; does not link an account) |
| **Google Photos** | **Import file** (Google Takeout ZIP + JSON) | Coming soon (modal; does not link an account) |
| **Apple Photos** | **Import folder** / ZIP (export from Photos on Mac) | N/A (local only; macOS sandbox untouched) |

### Official export tips

1. **Instagram:** Settings → Your activity → Download information (JSON/ZIP).
2. **Facebook:** Settings → Your information → Download your information (JSON).
3. **X:** Settings → Your account → Download an archive of your data.
4. **Google Photos:** [Google Takeout](https://takeout.google.com) → Google Photos.
5. **Apple Photos (Mac):** select album → File → Export → Export Unmodified Original (folder or ZIP). Optional: `manifest.json` with `assets[]`.

Each source card in the UI shows a short **How to request the export** block with the same tip.

### Honesty: no fake OAuth

- **Import file / Import folder** is the primary action and the only path that feeds memories today.
- **Connect (coming soon)** opens a modal explaining there is **no** real login: you need the official export. It does **not** mark the source as “connected to Instagram” (or FB/X/Google).
- UI statuses: **Not imported** · **Ready to import** (legacy demo state) · **Imported** (after a successful import). Never “connected to …”.
- Real OAuth stays documented via optional env vars; the MVP **does not** call Meta/X/Google. Missing secrets must not invent a connection.

## Privacy (OAuth tension)

Meta, X, and Google APIs require app registration and often route traffic through their servers. That conflicts with **local-first**.

LEGADO prioritizes:

1. Official export → local parse → memories.
2. OAuth only as a future upgrade (never an MVP requirement).

The profile photo is stored as a local data URL; it is not uploaded to any LEGADO service.

## Quick start

1. Start Training: `npm run dev:entrenamiento` → http://127.0.0.1:43127  
2. Open **Perfil / Fuentes**.  
3. Edit name/bio/photo.  
4. On a source: read **How to request the export** → **Import file** or **Import folder**.  
5. Check the **queue** (empty / loading / error / done).  
6. Open **Memorias** or **Conversar**: the enriched profile shapes chat context.

### Test fixture

Repo file: `docs/fixtures/social-sample.json` — generic LEGADO format (`items[]` with `kind`: `frase` | `foto` | `evento`). Import it via any JSON-accepting source (e.g. Instagram).

## Optional environment variables (future)

```bash
LEGADO_META_APP_ID=
LEGADO_META_APP_SECRET=
LEGADO_X_CLIENT_ID=
LEGADO_X_CLIENT_SECRET=
LEGADO_GOOGLE_CLIENT_ID=
LEGADO_GOOGLE_CLIENT_SECRET=
```

Without them the app remains fully usable with manual import. Having them does **not** enable OAuth in this MVP.

## Related

- Usage: [usage.md](./usage.md)
- Plan: [plan.md](./plan.md)
- Español: [../es/redes.md](../es/redes.md)
