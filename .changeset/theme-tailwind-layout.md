---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiLayout` in the Tailwind theme — mirrors the house shell, mapping the one Tailwind-expressible declaration (`display: grid`) via `@apply` at zero specificity (`:where()`) so it speaks the consumer's Tailwind build. The grid template, `min-block-size: 100dvh`, and the per-region `grid-area` assignments (`data-part` `header`/`sidebar`/`main`/`footer`) have no Tailwind utility, so they stay plain CSS; a consumer's own CSS/utility classes targeting `.bankai-layout` still override the default track sizing without `!important`.
