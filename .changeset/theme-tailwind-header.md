---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiHeader` in the Tailwind theme — mirrors the house banner bar, styled `@apply`-first: the Tailwind-expressible declarations use utilities (`py-4`/`px-6` padding, `border-b` bottom-border width) so the bar speaks the consumer's Tailwind build. Only the two arbitrary-token colors have no clean utility, so they ride `--bankai-header-*` custom properties (`--bankai-header-border-color`, `--bankai-header-background`) at parity with the house theme. Every rule stays wrapped in zero-specificity `:where()`, so a consumer's own CSS/utility classes targeting `.bankai-header` override it without `!important`.
