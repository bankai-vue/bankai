---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiInputPassword` and introduce the `--bankai-input-password-*` token surface — painted at zero specificity (`:where()`). When the `toggle` prop wraps the field, lays out the field + trailing reveal button as one control via CSS grid: the field flattens the corners facing the button and its focus ring is drawn inset, while the button is a raised-surface control with the field's hairline border that drops the shared seam and rounds only its outer corners. Being a real focusable control, the reveal button gets its own inset focus ring; it lifts on `:hover` and dims with the not-allowed cursor when `:disabled`. Every value routes through a `--bankai-input-password-*` custom property (defaulting to the field's own tokens and the foundation roles).

The grouped field no longer pins `block-size: 100%` (dropped here and on `BankaiInputNumber`): it is redundant with the grid's default `align-items: stretch` and would resolve to an `<input>`'s replaced intrinsic height under any theme that sets an explicit larger `line-height`. No visual change in this theme (its `line-height` already matches), but it removes the latent trap the Tailwind theme hit.
