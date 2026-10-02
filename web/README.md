# LEGADO public landing (`web/`)

Static bilingual (ES/EN) site for **GitHub Pages**. Does not touch `apps/entrenamiento` or `apps/consulta`.

## Expected URL

https://xoginger.github.io/LEGADO/

## Enable Pages (once)

1. Repo **Settings → Pages**
2. **Source:** GitHub Actions
3. Push to `main` (or run workflow **Deploy GitHub Pages** manually)

Workflow: [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) publishes the `web/` folder.

## Local preview

```bash
npx --yes serve web -p 43129
# open http://127.0.0.1:43129
```

## Brand icon + skins (coordination)

Canonical brand work is owned by the **icon / themes** agent (apps switcher). This landing only shows a **preview**.

| Asset | Landing placeholder | Prefer when present |
| --- | --- | --- |
| Brand icon | `web/assets/brand-icon.svg`, `favicon.svg` | `brand/legado-icon.svg` or `packages/shared/brand/legado-icon.svg` |
| Skin previews | `web/assets/skins/{default,matrix,jarvis,anime}.svg` | Same filenames under `brand/skins/` if published |

`main.js` tries to swap the header icon to a canonical path when that file is reachable. On Pages only `web/` is deployed, so **copy or sync** the final icon into `web/assets/` when the brand agent lands it (do not invent a second brand system in the apps).

Do **not** implement the full theme switcher here — that lives in the Next apps.

## Docs linked from this site

- ES: [`docs/es/uso.md`](../docs/es/uso.md) — requisitos, configuración, uso
- EN: [`docs/en/usage.md`](../docs/en/usage.md)
