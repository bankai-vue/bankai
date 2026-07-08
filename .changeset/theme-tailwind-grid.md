---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiGrid` in the Tailwind theme — maps its `data-*` anatomy (`data-bankai-flow`/`data-bankai-align`/`data-bankai-justify`/`data-bankai-inline`) to Tailwind's layout utilities via `@apply` (`grid`, `grid-flow-col`, `items-center`, `justify-items-start`, …) at zero specificity (`:where()`), so a consumer's utility classes override without `!important`. The continuous track values (`columns`/`rows`/`areas`/`gap`) ride the `--bankai-grid-*` custom properties, `gap`'s numeric steps resolving through the spacing bridge onto Tailwind's `--spacing`.
