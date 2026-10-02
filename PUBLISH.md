# Publishing the `legado` repository

The cloud agent could **not** create `xocotzin-granados/legado` from this environment:

- Origin CLI: token not scoped for `repo create` on `xocotzin-granados`
- GitHub CLI: not authenticated

## Maintainer steps

1. Create a **public** repository named `legado` under your Origin/GitHub account (UI or a fully scoped token).
2. From this checkout:

```bash
git remote add legado https://origin.cursor.com/git/xocotzin-granados/legado.git
# or your GitHub HTTPS URL
git push -u legado cursor/legado-monorepo-oss-e984:main
```

3. Optionally open a draft PR if you push a feature branch instead of `main`.
4. Add the real donation URL to [DONATIONS.md](./DONATIONS.md).
