---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiContainer` — constrains `.bankai-container` to a centered max-width (`inline-size: 100%` + `max-inline-size: var(--bankai-container-max-width)` + `margin-inline: auto`) with an inline gutter (`var(--bankai-container-gutter)`), and drops the cap to full-width when `data-bankai-fluid` is present. Every rule is zero-specificity (`:where()`) so a consumer's own CSS or utility classes override it without `!important`, and both knobs are `--bankai-container-*` custom properties (declared under `:where(:root)`) so the width or gutter can be retuned by overriding a single property. The width is intrinsic (resolves against the containing block), so it degrades to edge-to-edge on its own in a narrow or embedded parent — no media queries (SPEC §4.19).
