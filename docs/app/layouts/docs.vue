<script setup lang="ts">
// Docs shell: <BankaiLayout> emits the header / sidebar / main / footer landmark regions, so this
// layout no longer hand-rolls <aside>/<main>. SiteHeader/SiteFooter slot into #header/#footer; the
// component nav slots into #sidebar (BankaiLayout wraps it in the <aside> complementary landmark);
// page content fills the sole <main>. The theme's `.bankai-layout` grid is a full-bleed shell, so the
// overrides below only retune the sidebar track / gutters (SPEC.md §4.4, §4.6). Interim → the sidebar
// nav becomes <BankaiSidebar> once it lands (ROADMAP Phase 1). NuxtLink marks the active route with
// aria-current for free.
import { BankaiLayout, BankaiText } from '@bankai-vue/core';
import { componentNav } from '../utils/docs';
</script>

<template>
  <BankaiLayout class="docs-layout">
    <template #header>
      <SiteHeader />
    </template>

    <template #sidebar>
      <nav class="docs-sidebar" aria-label="Components">
        <BankaiText as="p" size="sm" weight="semibold" tone="muted" class="docs-sidebar-title">
          Components
        </BankaiText>
        <ul class="docs-nav">
          <li v-for="item in componentNav" :key="item.to">
            <NuxtLink :to="item.to" class="docs-nav-link">{{ item.name }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </template>

    <div class="docs-main">
      <slot />
    </div>

    <template #footer>
      <SiteFooter />
    </template>
  </BankaiLayout>
</template>

<style scoped>
/* Retune the shell grid: a fixed sidebar track + a column gutter. row-gap stays 0 so the full-bleed
   header/footer sit flush against their borders. `.docs-layout` is the BankaiLayout root, which
   inherits this component's scope, so a plain class override wins over the theme's `:where()` rule. */
.docs-layout {
  grid-template-columns: 12rem 1fr;
  column-gap: 2.5rem;
}

.docs-sidebar {
  position: sticky;
  top: 2rem;
  padding: 2rem 0 2rem 1.5rem;
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

.docs-main {
  padding: 2rem 1.5rem 2rem 0;
  min-inline-size: 0;
}

/* Stack the sidebar above content on narrow viewports: collapse the shell to a single column and
   restack the grid areas, and drop the sidebar's sticky positioning. */
@media (max-width: 48rem) {
  .docs-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      'header'
      'sidebar'
      'main'
      'footer';
  }

  .docs-sidebar {
    position: static;
    padding: 1.5rem 1.5rem 0;
  }

  .docs-main {
    padding: 1.5rem;
  }
}
</style>
