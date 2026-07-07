---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiText` and introduce the type-scale tokens — maps its `data-*` anatomy (`data-bankai-size`/`data-bankai-weight`/`data-bankai-tone`/`data-bankai-truncate`) to type styles at zero specificity (`:where()`), so a consumer's utility classes override without `!important`. Adds a rem-based `--bankai-text-size-*` t-shirt scale (`xs`–`2xl`) to the shared tokens (the type-scale counterpart to the spacing scale), pairs each step with its line height, maps named weights to numeric `font-weight` values, and defines neutral foreground tone colors (`--bankai-text-color`/`-muted`/`-subtle`) via `light-dark()`. A base rule applies the `--bankai-text-size`/`-weight`/`-tone` custom properties, so verbatim (non-named) `size`/`weight`/`tone` values passed to `BankaiText` land as `font-size`/`font-weight`/`color`.
