<script setup lang="ts">
import type { PropRow } from '../../utils/docs';
import { BankaiButton, BankaiCode, BankaiFlex, BankaiText } from '@bankai-vue/core';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiButton · bankai-vue' });

const props: PropRow[] = [
  {
    name: 'variant',
    type: "'solid' | 'outline' | 'ghost'",
    default: "'solid'",
    description: 'Visual variant. Reflected on the root as data-bankai-variant.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Size scale. Reflected as data-bankai-size.',
  },
  {
    name: 'type',
    type: "'button' | 'submit' | 'reset'",
    default: "'button'",
    description:
      "Native button type — defaults to 'button' so it never submits a form by accident.",
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the button via the native disabled attribute.',
  },
];
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

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Props</BankaiText>
      <PropsTable :rows="props" />
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Slots</BankaiText>
      <BankaiText as="p" tone="muted">
        <BankaiCode>default</BankaiCode> — button content (label and/or icons).
      </BankaiText>
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}
</style>
