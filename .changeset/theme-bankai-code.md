---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiCode` — gives `.bankai-code` the house monospace stack, an `em`-relative font-size (so inline code scales with its surrounding text, not a frozen px), an `em`-relative padding, a raised chip background, and the house corner radius. Every rule is zero-specificity (`:where()`) so a consumer's own CSS or utility classes override it without `!important`, and every value rides a `--bankai-code-*` custom property (declared under `:where(:root)`) — `--bankai-code-font-family`, `--bankai-code-bg`, `--bankai-code-radius`, `--bankai-code-font-size`, `--bankai-code-padding-block`, `--bankai-code-padding-inline` — so the chip is retuned by overriding a single property. Also introduces the shared `--bankai-font-mono` token (platform-native code fonts), which the inline chip — and the future `BankaiCodeBlock` — read.
