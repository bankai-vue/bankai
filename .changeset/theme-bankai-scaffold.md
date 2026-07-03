---
'@bankai-vue/theme-bankai': minor
---

Add `@bankai-vue/theme-bankai` — the signature theme, shipped as framework-agnostic CSS. This first drop provides the shared design tokens (`--bankai-radius`, `--bankai-focus-ring`) and system-aware light/dark via `color-scheme` + `light-dark()`, authored at zero specificity (`:where()`). Per-component styles are layered in as components land.
