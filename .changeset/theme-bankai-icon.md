---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiIcon` and introduce the icon-size tokens — paints the icon box at zero specificity (`:where()`), so a consumer's utility classes (or their own icon class) override without `!important`. The root is a square, `font-size`-driven `1em` box (`display: inline-flex`, centered), so one size knob scales an inline `<svg>` (filled with `currentColor` and contained to the box, keeping its aspect ratio), an em-based mask icon, and a glyph font alike. Adds a rem-based `--bankai-icon-size-*` scale (`xs`–`xl`); named `size` steps map to it via `data-bankai-size`, while a verbatim size rides the `--bankai-icon-size` custom property applied by the base rule. The `no-square` opt-out (`data-bankai-square="false"`) drops the 1:1 constraint so a non-square glyph keeps its intrinsic ratio.
