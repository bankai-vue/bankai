---
'@bankai-vue/core': minor
'@bankai-vue/theme-bankai': minor
'@bankai-vue/theme-tailwind': minor
---

`BankaiFlex`/`BankaiGrid`: accept named t-shirt `gap` steps. `gap` now takes `'xs'`–`'xl'` (e.g. `gap="md"`) alongside the numbered spacing step and verbatim length — previously a named value fell through to an invalid CSS length (`gap: md`) and silently resolved to `normal`. A named step resolves to a dedicated, theme-owned `--bankai-gap-<name>` token (`theme-bankai`: xs=0.25rem, sm=0.5rem, md=0.75rem, lg=1rem, xl=1.5rem; `theme-tailwind` maps onto its `--spacing`), so core bakes no absolute size. Non-breaking: numeric steps and verbatim lengths are unchanged.
