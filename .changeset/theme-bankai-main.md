---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiMain` — floors `.bankai-main`'s `min-inline-size` at `0` so, as a grid or flex child, the content region shrinks to its container instead of a wide, unbreakable descendant (a long `<pre>`, a table) pushing the whole column wider and causing horizontal overflow. It paints nothing else: no padding (content width/gutter is `BankaiContainer`'s job) and no background (it is the page surface). The rule is zero-specificity (`:where()`), so a consumer's own CSS or utility classes targeting `.bankai-main` override it without `!important`; the value is a fixed structural constant, so it stays literal (no `--bankai-main-*` token).
