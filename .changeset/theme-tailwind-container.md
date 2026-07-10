---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiContainer` in the Tailwind theme — mirrors the house width utility, mapping the Tailwind-expressible declarations via `@apply` (`mx-auto w-full`, and `max-w-none` for `data-bankai-fluid`) so the width speaks the consumer's Tailwind build. The centered cap and inline gutter ride `--bankai-container-*` custom properties (declared under `:where(:root)` at parity with the house theme — max-width onto Tailwind's `--container-7xl`, gutter onto the bridged spacing scale), which no Tailwind utility can read, so those two declarations stay plain CSS. Every rule stays wrapped in zero-specificity `:where()`, so a consumer's own CSS/utility classes override the width without `!important`.
