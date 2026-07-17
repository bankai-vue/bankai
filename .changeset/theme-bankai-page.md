---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiPage` — fills `.bankai-page`'s `min-block-size` so, as the per-route host inside `<main>`, a short route still occupies the full content region and pushes a footer to the bottom. The fill is `100%` (relative to the containing block), **not** a `100dvh` viewport unit — a viewport height would break embedded / side-by-side panes where the box is a fraction of the window (SPEC §4.19); `100%` fills whatever space the parent gives it, resolving only when that parent has a definite block size and a harmless no-op otherwise. It paints nothing else (width/gutter is `BankaiContainer`'s job; it is the page surface, no background). The rule is zero-specificity (`:where()`) so a consumer's own CSS or utility classes override it without `!important`, and the fill rides a `--bankai-page-min-block-size` custom property (declared under `:where(:root)`) so it can be retuned or disabled by overriding one property.
