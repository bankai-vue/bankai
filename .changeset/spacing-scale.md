---
'@bankai-vue/theme-bankai': minor
---

Add the rem-based spacing scale — `--bankai-space-unit` plus `--bankai-space-0`…`--bankai-space-32` on a 2px grid (`n × 0.125rem`), a fine scale that suits dense UIs and needs no fractional tokens. rem-based so spacing scales with the user's root font size and zoom. The first design tokens beyond the base set; layout utilities resolve numeric spacing props to these, and they're available for any spacing.
