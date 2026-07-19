---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiIcon` in the Tailwind theme, `@apply`-first — the box uses clean utilities (`inline-flex`, `flex-none`, `items-center`, `justify-center`, `leading-none`, `align-middle`; the inner `<svg>` gets `size-full max-w-full max-h-full fill-current`) so it speaks the consumer's Tailwind build. Only the no-clean-utility bits stay plain CSS: the `1em` square box and the `--bankai-icon-size` verbatim escape hatch (reset to `initial` so an unset size inherits the ambient font size). The named `size` scale rides `--bankai-icon-size-*` tokens bridged onto Tailwind's `--spacing` (`calc(var(--bankai-space-unit) * n)`, xs=3 … xl=8 — the same steps Tailwind's `size-*` icon utilities use), so icon size tracks the consumer's spacing scale. The `no-square` opt-out drops the 1:1 constraint. Every rule stays wrapped in zero-specificity `:where()`, so a consumer's own CSS/utility classes (or their icon class) override it without `!important`.
