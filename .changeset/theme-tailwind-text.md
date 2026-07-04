---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiText` in the Tailwind theme — maps its `data-*` anatomy (`data-size`/`data-weight`/`data-tone`/`data-truncate`) to Tailwind's type utilities via `@apply` (`text-base`, `font-semibold`, `text-slate-600 dark:text-slate-300`, `truncate`, …) at zero specificity (`:where()`), so a consumer's utility classes override without `!important`. Named sizes come straight from Tailwind's `text-*` (`md` → `text-base`), needing no token bridge. A plain-CSS base rule applies the `--bankai-text-size`/`-weight`/`-tone` custom properties (no Tailwind utility reads an arbitrary custom property — same as `gap` in flex.css), so verbatim `size`/`weight`/`tone` values passed to `BankaiText` still land.
