---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiGrid` — maps its `data-*` anatomy (`data-bankai-flow`/`data-bankai-align`/`data-bankai-justify`/`data-bankai-inline`) and the `--bankai-grid-columns`/`-rows`/`-areas`/`-gap` custom properties to CSS-grid layout at zero specificity (`:where()`), so a consumer's utility classes override without `!important`. The `align`/`justify` keywords map 1:1 to the native box-alignment values (`align-items`/`justify-items`), `flow` to `grid-auto-flow` (`row-dense`→`row dense`), and numeric `gap` resolves to the `--bankai-space-*` scale with a base-unit fallback for out-of-scale steps.
