---
'@bankai-vue/core': minor
---

Add `BankaiCode` — a minimal inline code primitive. It renders a native `.bankai-code` `<code data-part="root">` so the phrasing semantics live on the element itself; the theme gives it a monospace font and a subtle chip background. It is a pure, themeable wrapper with no props today (a polymorphic `as`, to reach the sibling monospace elements `<kbd>`/`<samp>`/`<var>`, is a possible non-breaking addition later). Distinct from the future block `BankaiCodeBlock`. Core ships no CSS; consumer `class`/`style`/attributes merge onto the root.
