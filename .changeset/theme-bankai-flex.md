---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiFlex` — maps its `data-*` anatomy (`data-direction`/`data-align`/`data-justify`/`data-wrap`/`data-inline`) and the `--bankai-flex-gap` custom property to flex layout at zero specificity (`:where()`), so a consumer's utility classes override without `!important`. Short prop keywords map to native CSS values (`start`→`flex-start`, `between`→`space-between`), and numeric `gap` resolves to the `--bankai-space-*` scale with a base-unit fallback for out-of-scale steps.
