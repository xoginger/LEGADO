# OAuth / conexión automática — futuro opcional (aplazado)

**Decisión de producto (2026-10):** el camino oficial para alimentar el perfil es **importar exports** (ZIP / JSON / CSV / carpeta). Ver [redes.md](./redes.md).

Esta página documenta **qué haría falta** si algún día se retoma OAuth. **No está en el roadmap activo.** No hay implementación ni stubs de login.

**Estado:** aplazado. La UI puede mostrar «Conectar (próximamente)» solo como aviso; no vincula cuentas.

## Por qué se aplazó

1. El titular alimentará el legado con **descargas oficiales** (más simple, local-first, sin App Review).
2. Varias plataformas **restringen** el caso «sincronizar toda mi biblioteca» (p. ej. Google Fotos Library API desde 2025; Instagram Basic Display apagado; Apple sin OAuth cloud).
3. OAuth exige developer apps, secrets y a menudo un proxy — choca con un monorepo OSS local-first si no es BYO + proxy del usuario.

## Resumen (si se retoma algún día)

| Fuente | ¿API para sync? | Bloqueo principal | Camino oficial hoy |
| --- | --- | --- | --- |
| **Instagram** | Solo cuentas **profesionales** | App Meta + App Review + scopes business | Export Meta |
| **Facebook** | Graph API | App Meta + App Review | Export Meta |
| **X** | API v2 OAuth 2.0 | App X + tier / límites | Archivo de X |
| **Google Fotos** | No lectura completa de biblioteca (2025+) | Picker ≠ sync histórico | Google Takeout |
| **Apple Fotos** | Sin OAuth cloud | PhotosKit / sandbox; export local | Carpeta/ZIP desde Fotos |

## Tokens locales vs proxy (referencia)

| Enfoque | Encaja local-first | Notas |
| --- | --- | --- |
| Secret en el navegador OSS | No | Nunca. |
| Tokens de usuario en disco | Sí (datos) | Tras un login futuro. |
| Proxy local del titular + BYO Client ID | Mejor compromiso | Único diseño razonable si se retoma. |
| Proxy en nube LEGADO | No | Fuera de principios. |

Variables solo documentadas (no activas):

```bash
LEGADO_META_APP_ID=
LEGADO_META_APP_SECRET=      # nunca en el navegador OSS
LEGADO_X_CLIENT_ID=
LEGADO_X_CLIENT_SECRET=
LEGADO_GOOGLE_CLIENT_ID=
LEGADO_GOOGLE_CLIENT_SECRET=
```

---

## Instagram (referencia)

- Basic Display **apagado** (dic 2024). Solo API para cuentas pro (`instagram_business_basic`, …).
- App Meta + App Review para usuarios reales.
- Hoy: export oficial → [redes.md](./redes.md).

## Facebook (referencia)

- Graph API + Facebook Login; muchos permisos con App Review.
- Hoy: «Descargar tu información» → import.

## X (referencia)

- OAuth 2.0 + PKCE; scopes `tweet.read`, `users.read`, `media.read`, `offline.access`.
- Tiers / límites de la API.
- Hoy: archivo de datos de X → import.

## Google Fotos (referencia)

- Scopes de biblioteca completa **eliminados** (mar 2025). Queda Picker (selección) o Takeout (bulk).
- Hoy: Takeout → import. **No** prometer sync total vía OAuth.

## Apple Fotos — distinto

Sin OAuth web para iCloud Photos. PhotosKit es nativo (macOS/iOS). LEGADO web → solo **Importar carpeta** / ZIP.

---

## Relacionado

- Camino oficial export→import: [redes.md](./redes.md)
- Plan: [plan.md](./plan.md)
- English: [../en/oauth-sources.md](../en/oauth-sources.md)
