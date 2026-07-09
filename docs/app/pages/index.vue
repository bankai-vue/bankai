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

// gap/columns are spacing-scale steps: `--bankai-space-<n>` = n × 0.125rem.
// (Distinct from BankaiText's `size` t-shirt scale — do not pass 'md'/'lg' here.)
</script>

<template>
  <!-- Raw <header> landmark for now → replaced by <BankaiHeader>/<BankaiNavbar> once they land (ROADMAP Phase 1). -->
  <header class="site-header">
    <BankaiFlex align="center" justify="between" gap="4" wrap="wrap">
      <BankaiText as="span" size="lg" weight="bold">bankai-vue</BankaiText>
      <ColorSchemeToggle />
    </BankaiFlex>
  </header>

  <!-- Raw <main> landmark for now → emitted by <BankaiLayout>'s default slot once it lands. -->
  <main class="site-main">
    <!-- Width is hand-capped here → replaced by <BankaiContainer> once it lands. -->
    <section class="hero">
      <BankaiFlex direction="column" align="center" gap="12">
        <BankaiText as="h1" size="2xl" weight="black">
          The agnostic, accessibility-first Vue 3 component framework
        </BankaiText>
        <BankaiText as="p" size="lg" tone="muted" class="hero-lede">
          Guiding defaults you can fully restyle · bring your own CSS framework · native modern HTML
          · first-class TypeScript · MIT, forever.
        </BankaiText>

        <!--
          Interim: reuse BankaiButton's `bankai-button` class + `data-bankai-*` state so the theme
          styles these links (incl. the hover/active feedback tokens) exactly like a button — until
          BankaiButton-as-link / BankaiLink lands (ROADMAP Phase 1). `:not(:disabled)` in the theme's
          hover/active rules matches anchors, so the interaction colors apply.
        -->
        <BankaiFlex align="center" justify="center" gap="6" wrap="wrap">
          <a
            class="bankai-button cta"
            data-bankai-variant="solid"
            data-bankai-size="md"
            :href="repoUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Star on GitHub
          </a>
          <a
            class="bankai-button cta"
            data-bankai-variant="outline"
            data-bankai-size="md"
            :href="roadmapUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Roadmap
          </a>
          <a
            class="bankai-button cta"
            data-bankai-variant="outline"
            data-bankai-size="md"
            :href="specUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spec
          </a>
        </BankaiFlex>

        <BankaiText as="p" size="sm" tone="subtle">
          Early development — the API is being designed in the open. Nothing is on npm yet.
        </BankaiText>
      </BankaiFlex>
    </section>

    <section class="shipping">
      <BankaiText as="h2" size="xl" weight="bold">Shipping today</BankaiText>
      <BankaiGrid columns="2" gap="8" class="shipping-grid">
        <article v-for="item in shipping" :key="item.name" class="card">
          <BankaiText as="h3" size="md" weight="semibold">{{ item.name }}</BankaiText>
          <BankaiText as="p" size="sm" tone="muted">{{ item.blurb }}</BankaiText>
        </article>
      </BankaiGrid>

      <div class="button-demo">
        <BankaiText as="p" size="sm" tone="subtle">BankaiButton variants</BankaiText>
        <BankaiFlex align="center" gap="4" wrap="wrap">
          <BankaiButton variant="solid">Solid</BankaiButton>
          <BankaiButton variant="outline">Outline</BankaiButton>
          <BankaiButton variant="ghost">Ghost</BankaiButton>
        </BankaiFlex>
      </div>
    </section>
  </main>

  <!-- Raw <footer> landmark for now → replaced by <BankaiFooter> once it lands. -->
  <footer class="site-footer">
    <BankaiText as="span" size="sm" tone="subtle">
      MIT © bankai-vue · This site is built with bankai-vue.
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
  padding: 4rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 5rem;
}

.hero {
  text-align: center;
}

.hero-lede {
  max-width: 44rem;
}

/* Only the link-specific reset; visuals (incl. hover/active) come from the `bankai-button` class. */
.cta {
  text-decoration: none;
}

.shipping-grid {
  margin-block: 1.5rem;
}

.card {
  padding: 1rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}

.button-demo {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
