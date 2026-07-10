---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiCode` in the Tailwind theme — mirrors the house inline-code look. The font stack speaks the consumer's Tailwind build via `@apply font-mono`; every other value rides a `--bankai-code-*` custom property (declared under `:where(:root)` at parity with the house theme) so the chip is retuned by overriding a single property: `--bankai-code-bg` points at the `surface` role, `--bankai-code-radius` at Tailwind's `--radius-md`, and the `em`-relative `--bankai-code-font-size` / `--bankai-code-padding-block` / `--bankai-code-padding-inline` stay literal (Tailwind's `text-*`/`p-*` are rem-absolute, but inline code must scale with its surrounding text). Every rule stays wrapped in zero-specificity `:where()`, so a consumer's own CSS/utility classes override it without `!important`. No token bridge is needed — Tailwind has a native `font-mono` utility.
