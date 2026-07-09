// https://nuxt.com/docs/api/configuration/nuxt-config
//
// The bankai-vue documentation site is built on Nuxt + bankai-vue itself
// (SPEC.md §4.15) — dogfooding is the requirements-discovery process. It ships
// as a static site to GitHub Pages (see .github/workflows/deploy-docs.yml).
export default defineNuxtConfig({
  compatibilityDate: '2026-07-09',

  // Dogfood the first-party module (SPEC.md §4.12/§4.15). Its setup() is a
  // no-op today; registering it here proves the module builds and loads. Real
  // component registration / auto-imports land in a later step — until then the
  // docs import from `@bankai-vue/core` explicitly.
  modules: ['@bankai-vue/nuxt'],

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
      // Relative href resolves against the deployed base (e.g. /bankai/) so it
      // works both locally and under the project-page path.
      link: [{ rel: 'icon', type: 'image/svg+xml', href: 'favicon.svg' }],
    },
  },
});
