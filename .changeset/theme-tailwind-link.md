---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiLink` in the Tailwind theme — mirrors the house link styling, mapping the Tailwind-expressible declarations via `@apply` (`cursor-pointer underline underline-offset-2 transition-colors`, and `rounded-md outline-2 outline-offset-2` on `:focus-visible`) so decoration and focus speak the consumer's Tailwind build. Link color rides a `--bankai-link-color*` token (aliased from `--bankai-color-accent`) rather than a Tailwind color utility, so it follows an in-app light/dark toggle via `light-dark()`/`color-scheme` — which Tailwind's `dark:` (keyed off the OS media query) would miss — matching `button.css`/`text.css`; hover/active steps deepen toward black in both schemes. Every rule stays wrapped in zero-specificity `:where()`, so a consumer's own CSS/utility classes override it without `!important`. The `data-bankai-external` state is left unpainted (no forced iconography) but exposed as a hook.
