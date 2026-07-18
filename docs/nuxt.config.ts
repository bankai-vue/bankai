// https://nuxt.com/docs/api/configuration/nuxt-config
//
// The bankai-vue documentation site is built on Nuxt + bankai-vue itself
// (SPEC.md §4.15) — dogfooding is the requirements-discovery process. It ships
// as a static site to GitHub Pages (see .github/workflows/deploy-docs.yml).
import { de } from '@bankai-vue/core/locales';

export default defineNuxtConfig({
  compatibilityDate: '2026-07-09',

  // Dogfood the first-party module (SPEC.md §4.12/§4.15): it auto-registers every
  // `@bankai-vue/core` component (so pages use `<Bankai*>` with no import),
  // auto-imports the composables, and installs the config per app (SSR-safe).
  //
  // @nuxtjs/i18n localizes the docs SITE itself (nav/chrome/prose). This is a SEPARATE
  // system from `@bankai-vue/core`'s component i18n above — distinct config, distinct
  // message files (docs/i18n/locales/*.json), distinct coverage. The two are linked at
  // one point only: a plugin (app/plugins/bankai-locale-sync.ts) mirrors the active docs
  // locale into `config.i18n.locale`, so a single header switcher drives both at once.
  modules: ['@bankai-vue/nuxt', '@nuxtjs/i18n'],

  // Docs-site i18n. `prefix_except_default` keeps English at `/…` and German at `/de/…`
  // (SEO-friendly, crawlable localized routes). Message files live in docs/i18n/locales/.
  // `detectBrowserLanguage: false` keeps every route deterministic for SSG — no cookie
  // redirect; the header switcher is the sole, explicit locale control.
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' },
    ],
    detectBrowserLanguage: false,
    compilation: {
      // Component taglines intentionally contain literal element names like `<button>` / `<code>`,
      // rendered as TEXT via `{{ }}` (Vue escapes them). Relax the compiler's strict no-HTML check so
      // those messages compile — otherwise one flagged message aborts the whole bundle and every key
      // falls back to itself. Safe here: messages are static and authored, never passed to `v-html`.
      strictMessage: false,
    },
  },

  // Register bankai's German COMPONENT bundle so the header language switcher can render component
  // strings (e.g. BankaiCodeBlock's "Copy" → "Kopieren") in German too. The docs locale is mirrored
  // into `config.i18n.locale` by app/plugins/bankai-locale-sync.ts. Auto-inject only covers the single
  // *active* configured locale, so a switcher spanning locales registers each bundle explicitly.
  bankai: {
    config: { i18n: { messages: { de } } },
  },

  // The house theme ships the CSS; core ships none (SPEC.md §4.4).
  css: ['@bankai-vue/theme-bankai'],

  // Static site for GitHub Pages. `app.baseURL` is supplied by NUXT_APP_BASE_URL
  // in the deploy workflow ('/bankai/' — this is a project page), so local `dev`
  // and `generate` stay at '/'.
  nitro: {
    prerender: {
      crawlLinks: true,
      // Seed both locale roots: `crawlLinks` then follows the auto-localized <NuxtLink>
      // nav from each, so every `/de/…` page is prerendered alongside its English twin
      // (verify `/bankai/de/…` files exist after `docs:generate`).
      routes: ['/', '/de'],
    },
  },

  app: {
    head: {
      title: 'bankai-vue',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'The agnostic, accessibility-first Vue 3 component framework.',
        },
      ],
      // (favicon <link> is set in app.vue via useHead so its href can be prefixed with the
      // runtime baseURL — a base-absolute path that resolves on nested routes too.)
      // No-flash dark mode (SPEC §4.18): apply a stored manual color-scheme override
      // BEFORE first paint. Runs synchronously in <head>; absent a stored choice, the
      // theme's `:root { color-scheme: light dark }` keeps following the OS. Interim to
      // the ColorSchemeToggle / future BankaiThemeToggle; on SSG this inline script is
      // the sanctioned fallback (no per-request server to read a cookie).
      //
      // The override must target BOTH `:root` and `.bankai-app`. The theme declares `color-scheme`
      // twice with zero specificity — `:where(:root)` (tokens.css, drives the `html` canvas paint in
      // base.css) and `:where(.bankai-app)` (app.css, the embedded-island surface). The root
      // <BankaiApp> re-declaring it on its own box severs inheritance, so overriding only `:root`
      // leaves the app subtree on the OS scheme, and overriding only `.bankai-app` leaves the `html`
      // canvas (the margin/overscroll area behind the app) on the OS scheme. We inject a
      // `:root,.bankai-app { color-scheme }` rule — each selector's specificity (0,1,0) beats the
      // theme's `:where()` (0,0,0) — and it applies the instant those elements are parsed. The
      // <style id> is the single source of truth the ColorSchemeToggle updates at runtime.
      script: [
        {
          key: 'bankai-color-scheme-init',
          tagPosition: 'head',
          innerHTML:
            "try{var v=localStorage.getItem('bankai-docs-color-scheme');if(v==='light'||v==='dark'){var s=document.createElement('style');s.id='bankai-color-scheme';s.textContent=':root,.bankai-app{color-scheme:'+v+'}';document.head.appendChild(s)}}catch(e){}",
        },
      ],
    },
  },
});
