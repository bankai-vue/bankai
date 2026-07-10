<script setup lang="ts">
// Interim site header, rendered inside <BankaiLayout>'s #header slot → to be replaced by
// <BankaiNavbar> once it lands (ROADMAP Phase 1). Uses <NuxtLink> so the /bankai/ base path + SPA
// nav apply. BankaiLayout wraps this in the <header> banner landmark, so the root here is a plain
// <div> — a nested <header> would create a duplicate banner landmark.
import { BankaiFlex, BankaiText } from '@bankai-vue/core';
</script>

<template>
  <div class="site-header">
    <BankaiFlex align="center" justify="between" gap="4" wrap="wrap">
      <NuxtLink to="/" class="brand">
        <BankaiText as="span" size="lg" weight="bold">bankai-vue</BankaiText>
      </NuxtLink>
      <BankaiFlex align="center" gap="6" wrap="wrap">
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
.site-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--bankai-color-border, currentColor);
}

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
