---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiFlex` in the Tailwind theme — maps its `data-*` anatomy (`data-direction`/`data-align`/`data-justify`/`data-wrap`/`data-inline`) to Tailwind's layout utilities via `@apply` (`flex`, `flex-col`, `items-center`, `justify-between`, …) at zero specificity (`:where()`), so a consumer's utility classes override without `!important`. `gap` rides the `--bankai-flex-gap` custom property, whose numeric steps resolve through the spacing bridge onto Tailwind's `--spacing`.
