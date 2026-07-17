---
'@bankai-vue/theme-bankai': minor
---

Re-key `BankaiLayout`'s grid placement from the region `data-part`s to the region **classes** — `:where(.bankai-layout > .bankai-header)` → `grid-area: header` (and `.bankai-aside` → `sidebar`, `.bankai-main` → `main`, `.bankai-footer` → `footer`) — now that `BankaiLayout` composes the region components (each exposes `data-part="root"`, so the class is the stable placement hook). The grid template, named areas, and `--bankai-layout-*` custom properties are unchanged; every rule stays zero-specificity (`:where()`), so a consumer's own CSS/utility classes targeting `.bankai-layout` still override track sizing without `!important`.
