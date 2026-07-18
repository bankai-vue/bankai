---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiApp` — the embedded-mode theme surface. `.bankai-app` carries its own `color-scheme` plus the foundation `--bankai-color-bg` / `--bankai-color-fg` tokens on its own box, so an embedded bankai island paints the house light/dark surface for its whole subtree without the global `html` page paint (`base.css`, which an embedded consumer can sever); the local `color-scheme` re-establishes the light/dark context so the `light-dark()` tokens resolve correctly even inside a host that declared its own scheme. It reads the foundation color tokens directly (like `base.css`), so there is no separate `--bankai-app-*` token family. The rule is zero-specificity (`:where()`) so a consumer's own CSS or utility classes override it without `!important`, and uses the `background-color` longhand (not the `background` shorthand) so a consumer's `background-image` / gradient on the App box survives.
