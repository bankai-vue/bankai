---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiCode` in the Tailwind theme, `@apply`-first — values with a clean Tailwind utility use it (`font-mono` for the font stack, `rounded-md` for the radius) so the chip speaks the consumer's Tailwind build; only values with no clean utility ride a `--bankai-code-*` custom property: `--bankai-code-bg` (the `surface` role) and the `em`-relative `--bankai-code-font-size` / `--bankai-code-padding-block` / `--bankai-code-padding-inline` (Tailwind's `text-*`/`p-*` are rem-absolute, but inline code must scale with its surrounding text). Every rule stays wrapped in zero-specificity `:where()`, so a consumer's own CSS/utility classes override it without `!important`. The full `--bankai-code-*` token surface (font-family, radius) lives in the house theme; here those are Tailwind utilities, the consumer's native override language.
