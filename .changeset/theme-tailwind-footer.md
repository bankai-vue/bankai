---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiFooter` in the Tailwind theme — mirrors the house foot bar (the flip of the header), styled `@apply`-first: the Tailwind-expressible declarations use utilities (`py-4`/`px-6` padding, `border-t` top-border width) so the foot speaks the consumer's Tailwind build. Only the two arbitrary-token colors have no clean utility, so they ride `--bankai-footer-*` custom properties (`--bankai-footer-border-color`, `--bankai-footer-background`) at parity with the house theme. Every rule stays wrapped in zero-specificity `:where()`, so a consumer's own CSS/utility classes targeting `.bankai-footer` override it without `!important`.
