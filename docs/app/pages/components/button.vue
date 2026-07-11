<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiButton · bankai-vue' });
</script>

<template>
  <article class="doc">
    <BankaiText as="h1" size="2xl" weight="black">BankaiButton</BankaiText>
    <BankaiText as="p" size="lg" tone="muted">
      A native <BankaiCode>&lt;button&gt;</BankaiCode> with typed variant, size, type, and disabled
      props. Ships no CSS of its own — the theme styles the
      <BankaiCode>bankai-button</BankaiCode> class and <BankaiCode>data-bankai-*</BankaiCode> state.
    </BankaiText>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Example</BankaiText>
      <div class="demo">
        <BankaiFlex align="center" gap="4" wrap="wrap">
          <BankaiButton variant="solid">Solid</BankaiButton>
          <BankaiButton variant="outline">Outline</BankaiButton>
          <BankaiButton variant="ghost">Ghost</BankaiButton>
        </BankaiFlex>
        <BankaiFlex align="center" gap="4" wrap="wrap">
          <BankaiButton size="sm">Small</BankaiButton>
          <BankaiButton size="md">Medium</BankaiButton>
          <BankaiButton size="lg">Large</BankaiButton>
          <BankaiButton disabled>Disabled</BankaiButton>
        </BankaiFlex>
      </div>
    </section>

    <ComponentApi :meta="componentMeta.BankaiButton" />
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}
</style>
