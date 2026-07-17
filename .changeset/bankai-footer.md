---
'@bankai-vue/core': minor
---

Add `BankaiFooter` — a standalone `<footer>` contentinfo region, for a shell built without `BankaiLayout`. It renders a native `<footer class="bankai-footer" data-part="root">`, so the `contentinfo` landmark is carried by the element itself, and merges consumer `class`/`style`/attributes onto the root; core ships no CSS. It has no configuration props. A native `<footer>` is the `contentinfo` landmark only at the top level (not nested inside `<article>`/`<aside>`/`<main>`/`<nav>`/`<section>`), so don't place it inside `BankaiLayout`'s `#footer` slot, which already emits a `<footer>` (landmark uniqueness).
