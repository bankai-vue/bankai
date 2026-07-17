---
'@bankai-vue/core': minor
---

Add `BankaiLayout` — the persistent app-shell layer of the App › Layout › Page › Container structure. It renders a `.bankai-layout` CSS-grid `<div data-part="root">` and wraps each provided slot in its native landmark region: `#header` → `<header data-part="header">`, `#sidebar` → `<aside data-part="sidebar">`, default → `<main data-part="main">`, `#footer` → `<footer data-part="footer">`. Optional regions are omitted from the DOM when their slot is absent; the default slot is the sole emitter of `<main>` and always renders, so an application gets a correct, unique-per-page landmark set for free. It has no configuration props — the grid tracks are controlled with plain CSS against `.bankai-layout` and the `data-part`s (no `view`-string DSL) — and merges consumer `class`/`style`/attributes onto the root; core ships no CSS.
