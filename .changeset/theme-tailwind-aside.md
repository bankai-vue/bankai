---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiAside` in the Tailwind theme — mirrors the house side rail, styled `@apply`-first: the Tailwind-expressible declarations use utilities (`p-4` padding, `border-e` inline-end divider width) so the rail speaks the consumer's Tailwind build. Only the two arbitrary-token colors have no clean utility, so they ride `--bankai-aside-*` custom properties (`--bankai-aside-border-color`, `--bankai-aside-background`) at parity with the house theme. Every rule stays wrapped in zero-specificity `:where()`, so a consumer's own CSS/utility classes targeting `.bankai-aside` override it without `!important`.
