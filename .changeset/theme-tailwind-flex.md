---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiFlex` in the Tailwind theme — maps its `data-*` anatomy (`data-bankai-direction`/`data-bankai-align`/`data-bankai-justify`/`data-bankai-wrap`/`data-bankai-inline`) to Tailwind's layout utilities via `@apply` (`flex`, `flex-col`, `items-center`, `justify-between`, …) at zero specificity (`:where()`), so a consumer's utility classes override without `!important`. `gap` rides the `--bankai-flex-gap` custom property, whose numeric steps resolve through the spacing bridge onto Tailwind's `--spacing`.
