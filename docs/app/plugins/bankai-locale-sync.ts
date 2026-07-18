// The one link between the two i18n systems (see LocaleSwitcher.vue): mirror the active docs-site
// locale (@nuxtjs/i18n) into bankai-vue's COMPONENT locale (config.i18n.locale), so a single header
// switcher drives both. @nuxtjs/i18n is the source of truth; this only follows it.
//
// Universal plugin (no .client/.server suffix) so it runs on BOTH server and client: on the /de route
// the server sets config.i18n.locale = 'de' before render, so component default strings SSR in German
// too — no hydration mismatch. App plugins run after the i18n module's plugin, so $i18n is ready here.
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
      if (typeof next === 'string' && next.length > 0) {
        config.i18n.locale = next;
      }
    },
    { immediate: true },
  );
});
