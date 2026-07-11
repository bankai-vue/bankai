---
'@bankai-vue/theme-bankai': minor
---

Style `BankaiLink` — paints `.bankai-link` with the interactive accent color (aliased from the foundation `--bankai-color-accent`), an underline (the accessible link signal, independent of color), a pointer cursor, and hover/active color steps that deepen toward black in both schemes. `:focus-visible` draws the shared focus ring. Every rule is zero-specificity (`:where()`) so a consumer's own CSS or utility classes (`text-blue-600`, `no-underline`, …) override it without `!important`, and every knob is a `--bankai-link-*` custom property (declared under `:where(:root)`) so a consumer can restyle without a selector — e.g. `--bankai-link-decoration: none`. The `data-bankai-external` state is left unpainted by design (no forced iconography) but exposed as a zero-specificity hook a consumer can opt into.
