---
'@bankai-vue/core': minor
---

Open `BankaiButton` and `BankaiFlex` string-set props to `LiteralUnion`, so the types suggest the first-class members without lying about the escape hatch (SPEC.md §4.4).

- `BankaiButtonVariant` / `BankaiButtonSize` now suggest the shipped members (`solid`/`outline`/`ghost`, `sm`/`md`/`lg`) but accept any string. The value reflects verbatim as `data-variant`/`data-size`, so a consumer extends the anatomy with their own `[data-variant='brand']` / `[data-size='xl']` rule — the reflected `data-*` _is_ the escape hatch (a variant/size is a bundle of declarations, so there is no single-custom-property path like BankaiText's continuous props).
- `BankaiFlexAs` now suggests the non-void HTML tags but accepts any tag string (e.g. a custom element), matching `BankaiTextAs`.
- `BankaiFlexGap` now also accepts a named `xs`–`2xl` t-shirt step (`gap="md"`) alongside the numeric spacing-scale step and verbatim CSS length. A named step resolves to the theme's `--bankai-space-<name>` token; a CSS keyword like `normal` still passes through verbatim (only the fixed named set is treated as a token).

`direction`/`align`/`justify`/`wrap` stay closed unions — they are exact CSS keyword sets with no arbitrary-value space.
