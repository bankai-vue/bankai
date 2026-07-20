---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiInput` and introduce the `--bankai-input-*` token surface — paints the field at zero specificity (`:where()`), so a consumer's utility classes or plain rules override without `!important`. A bordered `border-box` field on the page surface that fills its container by default (`inline-size: 100%`, overridable via `--bankai-input-inline-size`), with the value/placeholder/border colors drawn from the foundation roles. Per-size padding and font size (`sm`/`md`/`lg`) resolve to the shared spacing + type scales, mirroring `BankaiButton`. On `:focus-visible` the border shifts to the accent role and the shared focus ring is drawn; `:read-only` (excluding `:disabled`) gets a raised surface fill; `:disabled` dims and shows the not-allowed cursor. Every metric routes through a `--bankai-input-*` custom property, so the field restyles from a single declaration.
