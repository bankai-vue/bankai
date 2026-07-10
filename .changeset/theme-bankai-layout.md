---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiLayout` — places `.bankai-layout` on a CSS grid and assigns each region (`data-part` `header`/`sidebar`/`main`/`footer`) to a named grid area at zero specificity (`:where()`), so a consumer's own CSS or utility classes targeting `.bankai-layout` override the default track sizing without `!important`. The default shell spans the header across the top and the footer across the bottom, with the sidebar left of the main content; absent regions collapse their `auto` track, and `min-block-size: 100dvh` keeps a short page's footer at the bottom of the viewport. The grid template and min block size ride `--bankai-layout-*` custom properties (`--bankai-layout-columns`, `--bankai-layout-rows`, `--bankai-layout-areas`, `--bankai-layout-min-block-size`), so a consumer retunes one axis by overriding a single property without redeclaring the whole grid.
