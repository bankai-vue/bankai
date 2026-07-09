<script setup lang="ts">
import { BankaiButton, BankaiFlex, BankaiGrid, BankaiText } from '@bankai-vue/core';

// Explicit imports for now: the @bankai-vue/nuxt module is registered (dogfooding
// its load) but does not auto-register components yet — that lands in a later step.

const repoUrl = 'https://github.com/bankai-vue/bankai';
const roadmapUrl = `${repoUrl}/blob/main/ROADMAP.md`;
const specUrl = `${repoUrl}/blob/main/SPEC.md`;

// The primitives that already ship from @bankai-vue/core (Phase 0 + early Phase 1).
const shipping = [
  { name: 'BankaiButton', blurb: 'Native <button> with variant/size/type.' },
  { name: 'BankaiText', blurb: 'Polymorphic text primitive + inline semantics.' },
  { name: 'BankaiFlex', blurb: 'Flexbox helper driven by data-* + :where().' },
  { name: 'BankaiGrid', blurb: 'CSS-grid helper for 2D layouts.' },
];
</script>

<template>
  <!-- Raw <header> landmark for now → replaced by <BankaiHeader>/<BankaiNavbar> once they land (ROADMAP Phase 1). -->
  <header class="site-header">
    <BankaiFlex align="center" justify="space-between" gap="md">
      <BankaiText as="span" size="lg" weight="bold">bankai-vue</BankaiText>
      <BankaiText as="span" size="sm" tone="muted">Shikai · pre-0.1.0</BankaiText>
    </BankaiFlex>
  </header>

  <!-- Raw <main> landmark for now → emitted by <BankaiLayout>'s default slot once it lands. -->
  <main class="site-main">
    <!-- Width is hand-capped here → replaced by <BankaiContainer> once it lands. -->
    <section class="hero">
      <BankaiFlex direction="column" align="center" gap="lg">
        <BankaiText as="h1" size="2xl" weight="black">
          The agnostic, accessibility-first Vue 3 component framework
        </BankaiText>
        <BankaiText as="p" size="lg" tone="muted">
          Guiding defaults you can fully restyle · bring your own CSS framework · native modern HTML
          · first-class TypeScript · MIT, forever.
        </BankaiText>

        <BankaiFlex align="center" justify="center" gap="md" wrap="wrap">
          <a class="cta cta--primary" :href="repoUrl">Star on GitHub</a>
          <a class="cta" :href="roadmapUrl">Roadmap</a>
          <a class="cta" :href="specUrl">Spec</a>
        </BankaiFlex>

        <BankaiText as="p" size="sm" tone="subtle">
          Early development — the API is being designed in the open. Nothing is on npm yet.
        </BankaiText>
      </BankaiFlex>
    </section>

    <section class="shipping">
      <BankaiText as="h2" size="xl" weight="bold">Shipping today</BankaiText>
      <BankaiGrid columns="2" gap="md" class="shipping-grid">
        <article v-for="item in shipping" :key="item.name" class="card">
          <BankaiText as="h3" size="md" weight="semibold">{{ item.name }}</BankaiText>
          <BankaiText as="p" size="sm" tone="muted">{{ item.blurb }}</BankaiText>
        </article>
      </BankaiGrid>

      <BankaiFlex align="center" gap="sm" wrap="wrap" class="button-demo">
        <BankaiButton variant="solid">Solid</BankaiButton>
        <BankaiButton variant="outline">Outline</BankaiButton>
        <BankaiButton variant="ghost">Ghost</BankaiButton>
      </BankaiFlex>
    </section>
  </main>

  <!-- Raw <footer> landmark for now → replaced by <BankaiFooter> once it lands. -->
  <footer class="site-footer">
    <BankaiText as="span" size="sm" tone="subtle">
      MIT © bankai-vue · This site is built with bankai-vue (dogfooding, SPEC §4.15).
    </BankaiText>
  </footer>
</template>

<style scoped>
/*
 * Temporary page-local layout. Deliberately minimal and marked for removal:
 * spacing/width/region styling migrates onto BankaiLayout / BankaiContainer as
 * those components land (ROADMAP Phase 1). Component *look* comes from the
 * @bankai-vue/theme-bankai CSS, not from here.
 */
.site-header,
.site-footer {
  padding: 1rem 1.5rem;
}

.site-main {
  max-width: 64rem;
  margin-inline: auto;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.hero {
  text-align: center;
}

.cta {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  border: 1px solid var(--bankai-color-border, currentColor);
  color: inherit;
}

.cta--primary {
  background: var(--bankai-color-primary, #4f46e5);
  color: var(--bankai-color-primary-fg, #fff);
  border-color: transparent;
}

.shipping-grid {
  margin-block: 1.5rem;
}

.card {
  padding: 1rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}
</style>
