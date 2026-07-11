<script setup lang="ts">
import type { PropRow } from '../../utils/docs';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiLink · bankai-vue' });

const props: PropRow[] = [
  {
    name: 'to',
    type: 'RouteLocationRaw | string | object',
    description:
      'Internal navigation target, handed to the resolved router link (NuxtLink, else RouterLink). A string to degrades to a plain <a href> when no router is installed. Typed as vue-router’s RouteLocationRaw once the @bankai-vue/core/vue-router augmentation is active.',
  },
  {
    name: 'href',
    type: 'string',
    description:
      'Explicit anchor target — always a native <a href>, never a router link. Use it for external URLs, mailto:/tel:, fragments, and downloads. Mutually exclusive with to (setting both is a type error).',
  },
  {
    name: 'external',
    type: 'boolean',
    default: 'false',
    description:
      'Force a plain <a> even when to is set and a router is available (a full-page navigation). Reflected via data-bankai-external.',
  },
];
</script>

<template>
  <article class="doc">
    <BankaiText as="h1" size="2xl" weight="black">BankaiLink</BankaiText>
    <BankaiText as="p" size="lg" tone="muted">
      A router-aware link primitive. With no wiring it renders a native
      <BankaiCode>&lt;a&gt;</BankaiCode>; under vue-router or Nuxt it resolves the
      globally-registered <BankaiCode>RouterLink</BankaiCode> /
      <BankaiCode>NuxtLink</BankaiCode> for internal <BankaiCode>to</BankaiCode> navigation — so one
      component works across plain Vue, vue-router, and Nuxt.
    </BankaiText>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Example</BankaiText>
      <div class="demo">
        <BankaiFlex direction="column" align="start" gap="3">
          <BankaiLink to="/components">Internal link (to)</BankaiLink>
          <BankaiLink href="https://github.com/bankai-vue/bankai" target="_blank">
            External link (new tab)
          </BankaiLink>
        </BankaiFlex>
      </div>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Router integration</BankaiText>
      <BankaiText as="p" tone="muted">
        Resolution order is <BankaiCode>NuxtLink</BankaiCode> →
        <BankaiCode>RouterLink</BankaiCode> → native <BankaiCode>&lt;a&gt;</BankaiCode>, detected
        from the app’s globally-registered components — so core needs no dependency on vue-router.
        Override the internal-link component with <BankaiCode>config.linkComponent</BankaiCode>. For
        first-class vue-router typing of <BankaiCode>to</BankaiCode>, add
        <BankaiCode>@bankai-vue/core/vue-router</BankaiCode> to your tsconfig
        <BankaiCode>types</BankaiCode>. A <BankaiCode>target="_blank"</BankaiCode> link gets
        <BankaiCode>rel="noopener noreferrer"</BankaiCode> automatically (opt out via
        <BankaiCode>config.linkNoopener</BankaiCode>).
      </BankaiText>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Props</BankaiText>
      <PropsTable :rows="props" />
    </section>
  </article>
</template>

<style scoped>
.doc {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.doc-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.demo {
  padding: 1.5rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}
</style>
