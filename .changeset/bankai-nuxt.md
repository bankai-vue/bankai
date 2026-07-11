---
'@bankai-vue/nuxt': minor
---

Make `@bankai-vue/nuxt` a working first-party Nuxt module (SPEC §4.12) — auto-imports and SSR-safe registration for `@bankai-vue/core`. It (1) auto-registers every core component (discovered from core's package.json `exports`, so it tracks core with no hand-maintained list) as a global `<Bankai*>` — no import needed, and tree-shaken when unused; (2) auto-imports the composables `useBankaiId` / `usePrefixedId` / `useBankaiConfig`; and (3) installs `createBankai` per Nuxt app via a plugin, so the config is provided per-request under SSR (no shared-fallback cross-request leakage), exposing the library config as `bankai: { config: { idGeneration } }` in `nuxt.config` (mirrors core's `BankaiConfig`). Also toggle components/composables registration via `bankai: { components, composables }`. The module is theme-agnostic — the consumer loads their own theme CSS. Verified SSR + SSG end-to-end by driving the docs site entirely on auto-imports.
