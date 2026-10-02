# OAuth / automatic connect — optional future (deferred)

**Product decision (2026-10):** the official path to feed the profile is **importing exports** (ZIP / JSON / CSV / folder). See [social.md](./social.md).

This page records **what would be required** if OAuth is ever revisited. **It is not on the active roadmap.** There is no login implementation.

**Status:** deferred. The UI may show “Connect (coming soon)” as a notice only; it does not link accounts.

## Why it was deferred

1. The titular will build the legacy from **official downloads** (simpler, local-first, no App Review).
2. Several platforms **restrict** “sync my whole library” (e.g. Google Photos Library API since 2025; Instagram Basic Display gone; Apple has no cloud OAuth).
3. OAuth needs developer apps, secrets, and often a proxy — a poor fit for an OSS local-first monorepo unless it is BYO + user-owned proxy.

## Summary (if ever revisited)

| Source | API for sync? | Main blocker | Official path today |
| --- | --- | --- | --- |
| **Instagram** | **Professional** accounts only | Meta app + App Review + business scopes | Meta export |
| **Facebook** | Graph API | Meta app + App Review | Meta export |
| **X** | API v2 OAuth 2.0 | X app + tier / limits | X archive |
| **Google Photos** | No full-library read (2025+) | Picker ≠ historical sync | Google Takeout |
| **Apple Photos** | No cloud OAuth | PhotosKit / sandbox; local export | Folder/ZIP from Photos |

## Local tokens vs proxy (reference)

| Approach | Fits local-first | Notes |
| --- | --- | --- |
| Secret in OSS browser | No | Never. |
| User tokens on disk | Yes (data) | After a future login. |
| Titular’s local proxy + BYO Client ID | Best compromise | Only reasonable design if revisited. |
| LEGADO cloud proxy | No | Against principles. |

Documented env vars only (inactive):

```bash
LEGADO_META_APP_ID=
LEGADO_META_APP_SECRET=      # never in the OSS browser
LEGADO_X_CLIENT_ID=
LEGADO_X_CLIENT_SECRET=
LEGADO_GOOGLE_CLIENT_ID=
LEGADO_GOOGLE_CLIENT_SECRET=
```

---

## Instagram (reference)

- Basic Display **shut down** (Dec 2024). Pro accounts only (`instagram_business_basic`, …).
- Meta app + App Review for real users.
- Today: official export → [social.md](./social.md).

## Facebook (reference)

- Graph API + Facebook Login; many permissions need App Review.
- Today: “Download your information” → import.

## X (reference)

- OAuth 2.0 + PKCE; scopes `tweet.read`, `users.read`, `media.read`, `offline.access`.
- API tiers / limits.
- Today: X data archive → import.

## Google Photos (reference)

- Full-library scopes **removed** (Mar 2025). Picker (selection) or Takeout (bulk) remain.
- Today: Takeout → import. **Do not** promise full sync via OAuth.

## Apple Photos — different

No web OAuth for iCloud Photos. PhotosKit is native (macOS/iOS). LEGADO web → **Import folder** / ZIP only.

---

## Related

- Official export→import path: [social.md](./social.md)
- Plan: [plan.md](./plan.md)
- Español: [../es/oauth-fuentes.md](../es/oauth-fuentes.md)
