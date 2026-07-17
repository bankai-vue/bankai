---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiFooter` — paints the `.bankai-footer` contentinfo region as the house foot, the mirror of the header: inline/block padding, a hairline top border (the header has a bottom border), and the page background on its own box (so a bottom-pinned footer stays opaque). Every selector is zero-specificity (`:where()`), so a consumer's own CSS or utility classes targeting `.bankai-footer` override any rule without `!important`. Every value rides a `--bankai-footer-*` custom property (`--bankai-footer-padding-block`, `--bankai-footer-padding-inline`, `--bankai-footer-border-width`, `--bankai-footer-border-color`, `--bankai-footer-background`), so a consumer retunes the foot by overriding one property.
