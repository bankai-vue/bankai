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
  modules: ['@bankai-vue/nuxt'],

  // Register the German bundle so the header LocaleToggle can switch to it at runtime. The default
  // locale stays English; the toggle flips `config.i18n.locale` live. (Auto-inject only covers the
  // single *active* configured locale, so a runtime switcher across locales registers them explicitly.)
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
      routes: ['/'],
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
