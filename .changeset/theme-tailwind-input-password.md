---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiInputPassword` in the Tailwind theme, `@apply`-first — every rule wrapped in zero-specificity `:where()`. When the `toggle` prop wraps the field, lays out the field + trailing reveal button as one control via CSS grid: the field flattens the corners facing the button with its focus ring drawn inset, and the reveal button pins to the neutral gray ramp through a `--bankai-input-password-*` override surface (`gray-50` at rest, `gray-100` on `:hover`, matching the field's `gray-300` inset-outline color at the seam), with `light-dark()` keying the dark treatment off `color-scheme`. The button — a real focusable control — takes the field's own inset focus outline, and dims with `cursor-not-allowed` when `:disabled`. At parity with the house theme.

Also fixes a field-height bug on the grouped input layouts: the field no longer pins `h-full`, which — because this theme sets an explicit `line-height` larger than an `<input>`'s replaced intrinsic height — collapsed the field below its real height in any single-row group (`BankaiInputPassword`, and `BankaiInputNumber`'s `split` layout; `stacked` masked it). The grid's default `align-items: stretch` already grows the shorter control to the field's height, so both now match a standalone `BankaiInput`.
