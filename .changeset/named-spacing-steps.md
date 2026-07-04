---
'@bankai-vue/theme-bankai': minor
---

Add named t-shirt spacing steps — `--bankai-space-xs`…`--bankai-space-2xl`, aliased onto the numeric `--bankai-space-<n>` scale (so both speak the same 2px-base grid). These are the named counterpart to the numeric scale and let a named spacing prop like `BankaiFlex gap="md"` resolve to a rem-based, theme-owned size. `xs` (4px) → `2xl` (32px) on this grid; retune by re-pointing an alias at a different step.
