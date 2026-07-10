---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiLayout` in the Tailwind theme — mirrors the house shell, mapping the one Tailwind-expressible declaration (`display: grid`) via `@apply` at zero specificity (`:where()`) so it speaks the consumer's Tailwind build. The grid template and `min-block-size` have no Tailwind utility, so they ride `--bankai-layout-*` custom properties (`--bankai-layout-columns`, `--bankai-layout-rows`, `--bankai-layout-areas`, `--bankai-layout-min-block-size`) at parity with the house theme, so a consumer retunes one axis by overriding a single property; the per-region `grid-area` assignments (`data-part` `header`/`sidebar`/`main`/`footer`) stay literal. A consumer's own CSS/utility classes targeting `.bankai-layout` still override the default track sizing without `!important`.
