---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiAside` — paints the `.bankai-aside` side rail: even block/inline padding, a hairline divider on the inline-end edge (logical, so it flips under RTL), and the page background on its own box (so a sticky rail stays opaque over content scrolling under it). Every selector is zero-specificity (`:where()`), so a consumer's own CSS or utility classes targeting `.bankai-aside` override any rule without `!important`. Every value rides a `--bankai-aside-*` custom property (`--bankai-aside-padding-block`, `--bankai-aside-padding-inline`, `--bankai-aside-border-width`, `--bankai-aside-border-color`, `--bankai-aside-background`), so a consumer retunes the rail by overriding one property.
