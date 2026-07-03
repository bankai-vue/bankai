---
'@bankai-vue/core': minor
---

Add app-wide configuration and id primitives:

- `createBankai` + `useBankaiConfig` — an SSR-safe Vue plugin for configuring bankai-vue (currently `idGeneration`).
- `useBankaiId` — resolves a component's `id`: a consumer-supplied `id` wins, otherwise a hydration-stable `useId`-based id is generated (unless disabled via config).
- `usePrefixedId` — the underlying prefixed, `useId`-based id helper (now public).
