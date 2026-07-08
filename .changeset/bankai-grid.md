---
'@bankai-vue/core': minor
---

Add `BankaiGrid` — a polymorphic (`as`, default `<div>`) CSS-grid layout utility (the 2D sibling of `BankaiFlex`) with typed `columns`/`rows`/`areas`/`gap`/`flow`/`align`/`justify`/`inline` props. It reflects the enumerated props as the `bankai-grid` class plus a `data-*` anatomy (`data-bankai-flow`/`data-bankai-align`/`data-bankai-justify`/`data-bankai-inline`) and carries the continuous track values on `--bankai-grid-columns`/`-rows`/`-areas`/`-gap` custom properties, leaving the styling to the theme; core ships no CSS. `columns`/`rows` accept a track count (number → `repeat(n, minmax(0, 1fr))`) or a verbatim template string; `areas` accepts an auto-quoted `string[]` (one row per entry) or a verbatim string; `gap` is a spacing-scale step (number) or a verbatim CSS length (string).
