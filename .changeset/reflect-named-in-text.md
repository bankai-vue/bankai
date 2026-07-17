---
'@bankai-vue/core': patch
---

`BankaiText`: adopt the shared `reflectNamed` helper for its `size`/`weight`/`tone` named-keyword-vs-escape-hatch split, replacing the hand-rolled per-prop computeds. `reflectNamed` is widened to a number-aware generic (`ReflectedProp<T>`), so `weight`'s numeric variable-font `wght` values keep their type on the `--bankai-text-*` escape channel while only strings can match a keyword. Internal refactor — the rendered `data-bankai-*`/custom-property output and the public API are unchanged.
