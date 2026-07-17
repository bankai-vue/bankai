---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiHeading` in the Tailwind theme — mirrors the house heading scale, mapping each level (reflected as `data-bankai-level`) to Tailwind's `text-*` utilities via `@apply` (`text-4xl` = level 1 … `text-base` = level 6, whose font-size + line-height pairs match the house steps) at zero specificity (`:where()`), so a consumer's utility classes override without `!important`. The named sizes need no token bridge — they come straight from Tailwind's `text-*` scale. Headings ship `margin: 0` (`m-0`), `font-semibold`, and `text-wrap: balance` (`text-balance`). Heading color rides a `--bankai-heading-color` token aliasing the foundation `--bankai-color-fg` (parity with the house theme), which drives dark mode off `color-scheme` via `light-dark()` rather than Tailwind's `dark:` variant — so an in-app color-scheme toggle flips the heading with the surface.
