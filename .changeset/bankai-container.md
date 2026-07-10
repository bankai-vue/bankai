---
'@bankai-vue/core': minor
---

Add `BankaiContainer` — the width layer of the App › Layout › Page › Container structure (SPEC §5.6). It renders a polymorphic `.bankai-container` `<div data-part="root">` (override the element with `as`, default `'div'`) that centers its content at a themeable max-width by default; the `fluid` boolean reflects `data-bankai-fluid` and drops the cap for an edge-to-edge, full-width box (the "bars left/right on huge viewports" toggle). The width is intrinsic, not viewport-driven — it collapses to edge-to-edge on its own when the parent is narrower than the max-width, so it stays correct inside embedded / side-by-side panes with no media queries (SPEC §4.19). It is reusable anywhere (Card, section, hero), is not a landmark, and never renders its own `<main>`. Core ships no CSS; consumer `class`/`style`/attributes merge onto the root.
