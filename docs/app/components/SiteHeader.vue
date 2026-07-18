<script setup lang="ts">
// Interim site header, rendered inside <BankaiLayout>'s #header slot → to be replaced by
// <BankaiNavbar> once it lands (ROADMAP Phase 1). Uses <NuxtLinkLocale> (from @nuxtjs/i18n) so the
// /bankai/ base path + SPA nav apply AND each `to` is prefixed with the active locale (/de under
// German) — a plain <NuxtLink> would drop the locale and hide /de/* pages from the SSG crawler.
// BankaiLayout composes BankaiHeader for the #header slot, so this root is a plain <div> (a nested
// <header> would duplicate the banner landmark) AND the banner bar look — inline/block padding + a
// bottom border — now comes from BankaiHeader's theme paint, not this component.
const { t } = useI18n();
</script>

<template>
  <div class="site-header">
    <BankaiFlex align="center" justify="between" gap="4" wrap="wrap">
      <NuxtLinkLocale to="/" class="brand">
        <BankaiText as="span" size="lg" weight="bold">bankai-vue</BankaiText>
      </NuxtLinkLocale>
      <BankaiFlex align="center" gap="6" wrap="wrap">
        <NuxtLinkLocale to="/guide/getting-started" class="nav-link">
          {{ t('nav.guide') }}
        </NuxtLinkLocale>
        <NuxtLinkLocale to="/components" class="nav-link">{{ t('nav.components') }}</NuxtLinkLocale>
        <!--
          Language switcher: drives BOTH the docs-site locale (@nuxtjs/i18n) and bankai's component
          locale at once. `setLocale` navigates to the localized route, so it renders normally (the
          server already knows the locale from the URL) — no <ClientOnly> like the color-scheme toggle.
        -->
        <LocaleSwitcher />
        <!--
          Client-only: the toggle reads localStorage in setup, so it must not server-render (the
          SSR/SSG output would always show 'system' active, then flip on hydration). The fallback
          reserves the control's footprint so the header doesn't shift when it mounts.
        -->
        <ClientOnly>
          <ColorSchemeToggle />
          <template #fallback>
            <div class="toggle-placeholder" aria-hidden="true" />
          </template>
        </ClientOnly>
      </BankaiFlex>
    </BankaiFlex>
  </div>
</template>

<style scoped>
/* Padding + bottom border come from BankaiHeader's theme paint (BankaiLayout wraps this slot in one). */
.brand {
  text-decoration: none;
  color: inherit;
}

.nav-link {
  text-decoration: none;
  color: inherit;
}

.nav-link:hover {
  text-decoration: underline;
}

/* Approx footprint of the three-option ColorSchemeToggle, so its client-only mount doesn't shift the header. */
.toggle-placeholder {
  width: 11.5rem;
  height: 2rem;
}
</style>
