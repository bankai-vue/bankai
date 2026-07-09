<script setup lang="ts">
// Interim site header → to be replaced by <BankaiNavbar> inside <BankaiLayout>'s #header slot
// once they land (ROADMAP Phase 1). Uses <NuxtLink> so the /bankai/ base path + SPA nav apply.
import { BankaiFlex, BankaiText } from '@bankai-vue/core';
</script>

<template>
  <header class="site-header">
    <BankaiFlex align="center" justify="between" gap="4" wrap="wrap">
      <NuxtLink to="/" class="brand">
        <BankaiText as="span" size="lg" weight="bold">bankai-vue</BankaiText>
      </NuxtLink>
      <BankaiFlex align="center" gap="6" wrap="wrap">
        <NuxtLink to="/components" class="nav-link">Components</NuxtLink>
        <ColorSchemeToggle />
      </BankaiFlex>
    </BankaiFlex>
  </header>
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
</style>
