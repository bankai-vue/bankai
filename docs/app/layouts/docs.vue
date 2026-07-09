<script setup lang="ts">
// Docs shell: header + component sidebar + content. Interim → the sidebar becomes <BankaiSidebar>
// in <BankaiLayout>'s #sidebar slot once they land (ROADMAP Phase 1). This layout owns the sole
// <main>. NuxtLink marks the active route with aria-current="page" for free.
import { BankaiText } from '@bankai-vue/core';
import { componentNav } from '../utils/docs';
</script>

<template>
  <SiteHeader />
  <div class="docs-shell">
    <aside class="docs-sidebar" aria-label="Components">
      <nav>
        <BankaiText as="p" size="sm" weight="semibold" tone="muted" class="docs-sidebar-title">
          Components
        </BankaiText>
        <ul class="docs-nav">
          <li v-for="item in componentNav" :key="item.to">
            <NuxtLink :to="item.to" class="docs-nav-link">{{ item.name }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="docs-main">
      <slot />
    </main>
  </div>
  <SiteFooter />
</template>

<style scoped>
.docs-shell {
  max-width: 72rem;
  margin-inline: auto;
  padding: 2rem 1.5rem;
  display: grid;
  grid-template-columns: 12rem 1fr;
  gap: 2.5rem;
  align-items: start;
}

.docs-sidebar {
  position: sticky;
  top: 2rem;
}

.docs-sidebar-title {
  margin-bottom: 0.5rem;
}

.docs-nav {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.docs-nav-link {
  display: block;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: inherit;
}

.docs-nav-link:hover {
  background: color-mix(in oklch, currentcolor 8%, transparent);
}

.docs-nav-link.router-link-exact-active {
  background: color-mix(in oklch, currentcolor 12%, transparent);
  font-weight: 600;
}

/* Stack the sidebar above content on narrow viewports. */
@media (max-width: 48rem) {
  .docs-shell {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .docs-sidebar {
    position: static;
  }
}
</style>
