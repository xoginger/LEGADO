# Publish to GitHub: xoginger/LEGADO

Canonical repository: **https://github.com/xoginger/LEGADO**

## From this Cloud Agent VM (blocked without a GitHub token)

Push failed with: `could not read Username for 'https://github.com'` — no `GH_TOKEN` / `gh auth` in this environment. Origin token also cannot create mirrors (`not scoped`).

## Maintainer: push in one minute

On any machine with access to this branch (or after downloading a bundle), with a GitHub PAT that can write to `xoginger/LEGADO`:

```bash
# Option A — from this checkout after adding a token
git remote add github https://github.com/xoginger/LEGADO.git
# or: git remote set-url github https://<TOKEN>@github.com/xoginger/LEGADO.git
git push -u github cursor/legado-monorepo-oss-e984:main
```

```bash
# Option B — empty repo: set GH_TOKEN then
export GH_TOKEN=ghp_...   # classic PAT with repo scope, or fine-grained Contents:write
gh auth setup-git
git push -u github cursor/legado-monorepo-oss-e984:main
```

`main` on GitHub is currently **empty** (`size: 0`), so a direct push to `main` is appropriate.

## Bundle (offline handoff)

If needed, create/use:

```bash
git bundle create legado-monorepo.bundle cursor/legado-monorepo-oss-e984
# elsewhere:
git clone legado-monorepo.bundle LEGADO
cd LEGADO && git remote add origin https://github.com/xoginger/LEGADO.git
git push -u origin cursor/legado-monorepo-oss-e984:main
```
