---
'@bankai-vue/core': patch
---

`BankaiButton`: widen `variant` and `size` to `LiteralUnion`, so a custom value is accepted alongside the named set. `variant` now takes any string in addition to `'solid' | 'outline' | 'ghost'`, and `size` any string in addition to `'sm' | 'md' | 'lg'` — the named keywords keep autocomplete. A custom value reflects verbatim as `data-bankai-variant`/`data-bankai-size`, so a consumer's `[data-bankai-variant='…']` rule can style it. This makes the escape-hatch pattern uniform with every other styling prop in the library; these were the last closed styling unions. Non-breaking — only previously-rejected custom values now type-check, and the runtime reflection is unchanged.
