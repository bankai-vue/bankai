<script setup lang="ts">
import { BankaiFlex, BankaiGrid, BankaiText } from '@bankai-vue/core';
import { componentNav } from '../utils/docs';

// Header/main/footer landmarks now come from the `default` layout (→ future <BankaiLayout>); this
// page only fills the content slot. The "Shipping today" grid reads from the shared componentNav,
// so cards link straight to each component's docs page.
const repoUrl = 'https://github.com/bankai-vue/bankai';
const roadmapUrl = `${repoUrl}/blob/main/ROADMAP.md`;
const specUrl = `${repoUrl}/blob/main/SPEC.md`;

// gap/columns are spacing-scale steps: `--bankai-space-<n>` = n × 0.125rem.
// (Distinct from BankaiText's `size` t-shirt scale — do not pass 'md'/'lg' here.)
</script>

<template>
  <div class="landing">
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
      <BankaiText as="h2" size="xl" weight="bold">Built so far</BankaiText>
      <BankaiGrid columns="2" gap="8" class="shipping-grid">
        <NuxtLink v-for="item in componentNav" :key="item.to" :to="item.to" class="card">
          <BankaiText as="h3" size="md" weight="semibold">Bankai{{ item.name }}</BankaiText>
          <BankaiText as="p" size="sm" tone="muted">{{ item.tagline }}</BankaiText>
        </NuxtLink>
      </BankaiGrid>
    </section>
  </div>
</template>

<style scoped>
/*
 * Temporary page-local layout. Component *look* comes from @bankai-vue/theme-bankai, not from here;
 * width/region styling lives in the layout and migrates onto BankaiLayout/BankaiContainer as those
 * components land (ROADMAP Phase 1).
 */
.landing {
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
  display: block;
  padding: 1rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.card:hover {
  background: color-mix(in oklch, currentcolor 6%, transparent);
}
</style>
