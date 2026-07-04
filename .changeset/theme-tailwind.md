---
'@bankai-vue/theme-tailwind': minor
---

Introduce `@bankai-vue/theme-tailwind` (investigation / first shaping) — a per-framework theme that remaps `@bankai-vue/core`'s semantic design tokens onto Tailwind's own scale, so the consumer's Tailwind design language drives the components. First slice: the spacing bridge, pointing `--bankai-space-*` at Tailwind's `--spacing` (so a numeric `:gap="4"` spacing step resolves onto Tailwind spacing). Per-component styling and non-spacing tokens are still TODO; the mapping is unstable.
