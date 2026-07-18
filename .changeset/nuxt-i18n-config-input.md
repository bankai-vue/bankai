---
'@bankai-vue/nuxt': minor
---

Type the module's `config` option as `BankaiConfigInput` (the same partial-accepting shape `createBankai` takes) instead of `Partial<BankaiConfig>`. Nuxt's own `Partial` wrapper is shallow, so a nested config object like the new `i18n` previously had to be given in full; now it can be partial — e.g. `bankai: { config: { i18n: { locale: 'de' } } }` typechecks without restating `fallbackLocale`/`messages`. Also auto-import the `useBankaiMessage` composable alongside its siblings, so it needs no explicit import under Nuxt like `useBankaiId` / `useBankaiConfig`.
