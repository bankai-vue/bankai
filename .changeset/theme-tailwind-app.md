---
'@bankai-vue/theme-tailwind': minor
---

Style `BankaiApp` in the Tailwind theme — mirrors the house theme's embedded-mode surface: `.bankai-app` carries its own `color-scheme` plus the foundation `--bankai-color-bg` / `--bankai-color-fg` tokens (which in this theme bridge onto the consumer's Tailwind `--color-*` palette) on its own box, so an embedded bankai island is a self-contained light/dark surface without the global `html` page paint (`base.css`, severable by an embedded consumer). It lives in `@layer base` at parity with `base.css`'s surface paint, so a consumer's plain `bg-*` / `text-*` utility still overrides it the Tailwind way, with no `!important`. It reads the color tokens directly — no `@apply` — so, like `base.css`, this file needs no Tailwind compilation. Uses the `background-color` longhand (not the `background` shorthand) so a consumer's `background-image` / gradient on the App box survives.
