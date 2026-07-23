---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiInputNumber` in the Tailwind theme, `@apply`-first — every rule wrapped in zero-specificity `:where()`. Hides the browser's native spin buttons on any `.bankai-input[type="number"]` (they can't be themed across engines). When the `buttons` prop wraps the field, lays out the field + stepper controls as one segmented control via CSS grid keyed on `data-bankai-buttons` — `stacked` (a vertical pair on the trailing edge) and `split` (`−`/`+` flanking the field). Controls pin to the neutral gray ramp through a `--bankai-input-number-*` override surface (`gray-50` at rest, `gray-100` on `:hover`, matching the field's `gray-300` inset-outline color at the seam), with `light-dark()` keying the dark treatment off `color-scheme` and `:disabled` dimming with `cursor-not-allowed`. At parity with the house theme.
