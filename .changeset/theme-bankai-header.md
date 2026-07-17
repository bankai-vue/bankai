---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiHeader` — paints the `.bankai-header` banner region as the house bar: inline/block padding, a hairline bottom border, and the page background on its own box (so a sticky header stays opaque over content scrolling under it). Every selector is zero-specificity (`:where()`), so a consumer's own CSS or utility classes targeting `.bankai-header` override any rule without `!important`. Every value rides a `--bankai-header-*` custom property (`--bankai-header-padding-block`, `--bankai-header-padding-inline`, `--bankai-header-border-width`, `--bankai-header-border-color`, `--bankai-header-background`), so a consumer retunes the bar by overriding one property.
