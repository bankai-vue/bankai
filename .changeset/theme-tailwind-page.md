---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiPage` in the Tailwind theme — mirrors the house theme's single rule: a `min-block-size` fill so a short route still occupies the full content region and pushes a footer down. It stays plain CSS at parity with the house theme rather than a Tailwind utility (Tailwind's `min-h-full` is physical `min-height`, not the logical `min-block-size` used here) and rides the `--bankai-page-min-block-size` custom property (declared under `:where(:root)` at parity), which no Tailwind utility can read — so this file needs no Tailwind compilation. The fill is `100%` (containing-block relative), not a `100dvh` viewport unit, so it stays correct in embedded / side-by-side panes (SPEC §4.19). The rule is zero-specificity (`:where()`), so a consumer's own CSS/utility classes targeting `.bankai-page` override it without `!important`.
