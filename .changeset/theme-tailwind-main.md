---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiMain` in the Tailwind theme — mirrors the house theme's single rule: a `min-inline-size: 0` floor so the content region shrinks with its container instead of a wide, unbreakable descendant forcing horizontal overflow. It is a fixed structural constant (like `layout.css`'s literal `grid-area`s), so it stays plain CSS at parity with the house theme rather than a Tailwind utility (Tailwind's `min-w-0` is physical `min-width`, not the logical `min-inline-size` used here) — this file needs no Tailwind compilation. The rule is zero-specificity (`:where()`), so a consumer's own CSS/utility classes targeting `.bankai-main` override it without `!important`.
