<script setup lang="ts">
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
          Dogfoods BankaiLink: it renders the native <a> (external `href`), auto-adds
          `rel="noopener noreferrer"` for `target="_blank"`, and reflects `data-bankai-external`.
          The button *look* is a docs-local restyle — the theme's link styles are zero-specificity
          `:where()`, so the scoped `.cta*` classes below override them cleanly (SPEC §4.4/§4.6).
        -->
        <BankaiFlex align="center" justify="center" gap="6" wrap="wrap">
          <BankaiLink class="cta cta-solid" :href="repoUrl" target="_blank">
            Star on GitHub
          </BankaiLink>
          <BankaiLink class="cta cta-outline" :href="roadmapUrl" target="_blank"
            >Roadmap</BankaiLink
          >
          <BankaiLink class="cta cta-outline" :href="specUrl" target="_blank">Spec</BankaiLink>
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

/*
 * Docs-local button look for the hero CTAs on top of BankaiLink. Scoped (so higher specificity than the
 * theme's zero-specificity `:where(.bankai-link)` rules) — sets color/decoration explicitly so the link's
 * accent/underline defers to this button styling. Draws on the foundation tokens so it tracks the theme.
 */
.cta {
  display: inline-flex;
  align-items: center;
  padding: var(--bankai-space-3, 0.375rem) var(--bankai-space-6, 0.75rem);
  border: 1px solid transparent;
  border-radius: var(--bankai-radius, 0.375rem);
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease;
}

.cta-solid {
  background: var(--bankai-color-primary);
  color: var(--bankai-color-primary-fg);
}

.cta-solid:hover {
  background: color-mix(in oklch, var(--bankai-color-primary), black 12%);
  color: var(--bankai-color-primary-fg);
}

.cta-outline {
  border-color: currentColor;
  color: inherit;
}

.cta-outline:hover {
  background: color-mix(in oklch, currentColor 8%, transparent);
  color: inherit;
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
