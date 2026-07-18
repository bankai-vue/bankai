// The one link between the two i18n systems (see LocaleSwitcher.vue): mirror the active docs-site
// locale (@nuxtjs/i18n) into bankai-vue's COMPONENT locale (config.i18n.locale), so a single header
// switcher drives both. @nuxtjs/i18n is the source of truth; this only follows it.
//
// Universal plugin (no .client/.server suffix) so it runs on BOTH server and client: on the /de route
// the server sets config.i18n.locale = 'de' before render, so component default strings SSR in German
// too — no hydration mismatch.
//
// Ordering (matters for SSR-safety): this depends on two providers being installed first —
//   - @nuxtjs/i18n's plugin (provides `$i18n`), and
//   - the generated `createBankai` plugin (app.provide's the PER-REQUEST config that useBankaiConfig
//     reads; without it, inject falls back to a process-wide singleton whose mutation would leak
//     between SSR requests).
// Both are registered by Nuxt MODULES (@nuxtjs/i18n and @bankai-vue/nuxt via addPluginTemplate), and
// Nuxt runs all module plugins before any `app/plugins/*`. So both are guaranteed ready here — this is
// a Nuxt ordering guarantee, not incidental. (If createBankai ever moved into a user plugin, this
// would need an explicit `dependsOn`.)
//
// The systems stay separate: distinct config, distinct message files, distinct coverage. Only the
// active locale is synced. A docs locale with no matching bankai bundle simply leaves component strings
// on the English base — fine (the docs register the 'de' bundle in nuxt.config, so 'de' is covered).
import { unref, watch } from 'vue';

export default defineNuxtPlugin(() => {
  const { $i18n } = useNuxtApp();
  const config = useBankaiConfig();

  watch(
    () => unref($i18n.locale),
    (next) => {
      config.i18n.locale = next;
    },
    { immediate: true },
  );
});
