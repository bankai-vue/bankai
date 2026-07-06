---
'@bankai-vue/theme-bankai': minor
---

Route `BankaiText`'s per-size line heights through `--bankai-text-line-height-*` component tokens (`xs`–`2xl`), declared on `:where(:root)` in `components/text.css` and defaulting to the previous literals. This matches the `--bankai-button-*` override contract: a consumer can retune a step's leading by overriding one custom property (e.g. `--bankai-text-line-height-lg`) without writing a selector. The tokens live in the component file rather than the shared type scale, so `--bankai-text-size-*` stays a single knob per size. No visual change.
