# Social sources & profile — export → import

**Official path (decision taken):** feed the profile by **importing downloads** (ZIP / JSON / JS / CSV / folder). There is no automatic OAuth for now.

In Training → **Perfil / Fuentes**, the primary action is **Import file** or **Import folder**. Everything is parsed **on your machine** (`localStorage` + `.legado-data/`).

OAuth / “real connect” is **optional future work and deferred**. Technical notes: [oauth-sources.md](./oauth-sources.md).

## What gets imported

| Kind | Examples | LEGADO memory |
| --- | --- | --- |
| **Photos** (+ caption) | IG/FB posts, Google/Apple Photos | `foto` |
| **Phrases / posts** | Captions, tweets, status updates | `frase` |
| **Events** | Facebook / social calendar events | `evento` |

**Consultation** and **Training** chat use the profile (name, bio) plus those memories.

## General flow (all sources)

1. In the network or Photos app, request the **export / data download** (steps below).
2. Wait for the file or folder (sometimes hours/days; Meta and Google email you).
3. Open LEGADO Training → http://127.0.0.1:43127 → **Perfil / Fuentes**.
4. On the source card → **Import file** (or **Import folder** for Apple Photos).
5. Check the **queue** (empty / loading / done / error).
6. Open **Memorias** or **Conversar**: the enriched profile shapes chat context.

### Test fixture

`docs/fixtures/social-sample.json` — generic LEGADO format (`items[]` with `kind`: `frase` | `foto` | `evento`). Import it via any JSON-accepting source (e.g. Instagram).

---

## Per source: export → import

### Instagram

| | |
| --- | --- |
| **In Instagram** | Settings → Your activity → **Download information** (or Accounts Center → Your information and permissions → Download your information). Choose JSON (or a ZIP that contains it). |
| **What LEGADO pulls** | Posts / captions → `frase` or `foto` per item. |
| **In LEGADO** | Profile / Sources → Instagram → **Import file** → pick the ZIP or JSON. |

### Facebook

| | |
| --- | --- |
| **In Facebook** | Settings & privacy → Your Facebook information → **Download your information**. JSON format; include posts and, if selected, events. |
| **What LEGADO pulls** | Posts → `frase`/`foto`; events → `evento`. |
| **In LEGADO** | Profile / Sources → Facebook → **Import file** → ZIP or JSON. |

### X (Twitter)

| | |
| --- | --- |
| **In X** | Settings and privacy → Your account → **Download an archive of your data**. Wait for the email; download the ZIP. |
| **What LEGADO pulls** | Tweets / referenced media → `frase` / `foto` as parsed. Accepts JS, JSON, CSV, or ZIP. |
| **In LEGADO** | Profile / Sources → X → **Import file** → ZIP or a file from the archive. |

### Google Photos

| | |
| --- | --- |
| **In Google** | [Google Takeout](https://takeout.google.com) → deselect all → select **Google Photos** → export (ZIP, often multiple parts). |
| **What LEGADO pulls** | Photos + metadata/caption JSON → `foto` (and associated text when present). |
| **In LEGADO** | Profile / Sources → Google Photos → **Import file** → the Takeout ZIP (or JSON if applicable). |

> Note: you do not need to “connect” Google with OAuth. Takeout is the correct bulk path.

### Apple Photos (Mac)

| | |
| --- | --- |
| **In Photos (Mac)** | Select album or photos → **File → Export → Export Unmodified Original** (folder) or zip it. Optional: `manifest.json` with `assets[]` if you have one. |
| **What LEGADO pulls** | Images (and captions from the manifest if present) → `foto`. |
| **In LEGADO** | Profile / Sources → Apple Photos → **Import folder** (or ZIP file). |

> Apple does not offer web OAuth for the personal library. Local export only.

---

## UI statuses

| Badge | Meaning |
| --- | --- |
| **Not imported** | No export imported yet. |
| **Ready to import** | Legacy demo state; does not mean an account is linked. |
| **Imported** | A successful import ran (items in memories). |

Never “connected to Instagram/FB/…”. **Connect (coming soon)** only explains that OAuth is **deferred**; it does not link anything.

## Privacy

- Parsing is **local**; exports are not uploaded to a LEGADO server.
- Automatic OAuth is **deferred** on purpose (local-first + product decision). If it is ever revisited: [oauth-sources.md](./oauth-sources.md).

## Related

- OAuth (deferred future): [oauth-sources.md](./oauth-sources.md)
- Usage: [usage.md](./usage.md)
- Plan: [plan.md](./plan.md)
- Español: [../es/redes.md](../es/redes.md)
