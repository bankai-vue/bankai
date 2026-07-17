---
'@bankai-vue/core': minor
'@bankai-vue/theme-bankai': minor
'@bankai-vue/theme-tailwind': minor
---

`BankaiFlex`/`BankaiGrid`: accept verbatim native `align`/`justify` values. In addition to the short keywords (`start`/`between`/…), `align` and `justify` now take any native CSS value — `justify="space-between"`, `align="flex-start"`, `var()`/`calc()` — previously a non-keyword silently resolved to `normal`. A recognised keyword still reflects as `data-bankai-align`/`data-bankai-justify` (theme-mapped); any other value rides a `--bankai-flex-*`/`--bankai-grid-*` custom property applied by the theme's zero-specificity base rule, so the value still loses to a consumer's utility class. The prop types widen via `LiteralUnion`, keeping keyword autocomplete. Non-breaking.
