---
'@bankai-vue/core': patch
---

Prevent consumer fallthrough attributes from clobbering component-owned `data-part` (anatomy) and reflected `data-bankai-*` (state) attributes. `BankaiButton`, `BankaiCode`, `BankaiContainer`, `BankaiFlex`, `BankaiGrid`, `BankaiLayout`, and `BankaiText` previously used the default `inheritAttrs: true`, so a same-named consumer attribute (e.g. `data-part="…"`) silently won and broke the theme's `[data-part]`/`[data-bankai-*]` selectors. Each now sets `inheritAttrs: false` and binds `v-bind="attrs"` first, so consumer `class`/`style`/attributes still merge onto the root while the owned attributes always win. `BankaiButton` keeps `id` consumer-overridable (bound before `attrs`), matching its existing behavior. `BankaiLink` was already fixed; a shared cross-component regression test now guards all eight.
