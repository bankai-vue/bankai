<script setup lang="ts">
// Interim site header, rendered inside <BankaiLayout>'s #header slot → to be replaced by
// <BankaiNavbar> once it lands (ROADMAP Phase 1). Uses <NuxtLink> so the /bankai/ base path + SPA
// nav apply. BankaiLayout composes BankaiHeader for the #header slot, so this root is a plain <div>
// (a nested <header> would duplicate the banner landmark) AND the banner bar look — inline/block
// padding + a bottom border — now comes from BankaiHeader's theme paint, not this component.
</script>

<template>
  <div class="site-header">
    <BankaiFlex align="center" justify="between" gap="4" wrap="wrap">
      <NuxtLink to="/" class="brand">
        <BankaiText as="span" size="lg" weight="bold">bankai-vue</BankaiText>
      </NuxtLink>
      <BankaiFlex align="center" gap="6" wrap="wrap">
        <NuxtLink to="/guide/getting-started" class="nav-link">Guide</NuxtLink>
        <NuxtLink to="/components" class="nav-link">Components</NuxtLink>
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
