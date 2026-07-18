---
'@bankai-vue/nuxt': minor
---

Auto-inject built-in locale bundles under Nuxt. When `bankai.config.i18n.locale` (or `fallbackLocale`, including a regional variant like `de-AT`) names a locale core ships a bundle for and it is not already registered in `messages`, the module statically imports the matching `@bankai-vue/core/locales/<code>` bundle into its generated plugin and registers it — so `bankai: { config: { i18n: { locale: 'de' } } }` just works, no manual import. The import is static, so it tree-shakes to only the configured locale and stays SSR-safe (a dynamic import would flash/mismatch on hydration). A consumer-registered bundle always wins and is never overwritten; a plain-Vue app still registers bundles explicitly. Reads the shipped locales from `@bankai-vue/core`'s `availableLocales`, so a new core locale needs no module change.
