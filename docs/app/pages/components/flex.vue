<script setup lang="ts">
import type { PropRow } from '../../utils/docs';
import { BankaiCode, BankaiFlex, BankaiText } from '@bankai-vue/core';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiFlex · bankai-vue' });

const props: PropRow[] = [
  {
    name: 'as',
    type: 'HTML tag name',
    default: "'div'",
    description: 'Polymorphic element to render.',
  },
  {
    name: 'direction',
    type: "'row' | 'row-reverse' | 'column' | 'column-reverse'",
    description: 'flex-direction. Omitted when unset (browser default row).',
  },
  {
    name: 'align',
    type: "'start' | 'end' | 'center' | 'baseline' | 'stretch'",
    description: 'align-items (cross axis).',
  },
  {
    name: 'justify',
    type: "'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'",
    description: 'justify-content (main axis). between/around/evenly map to the space-* values.',
  },
  {
    name: 'gap',
    type: 'number | string',
    description:
      'Spacing between children. A number is a --bankai-space-<n> step; any other string is a verbatim CSS length.',
  },
  {
    name: 'wrap',
    type: "'nowrap' | 'wrap' | 'wrap-reverse'",
    description: 'flex-wrap. Omitted when unset (browser default nowrap).',
  },
  {
    name: 'inline',
    type: 'boolean',
    default: 'false',
    description: 'Render as inline-flex instead of flex.',
  },
];
</script>

<template>
  <article class="doc">
    <BankaiText as="h1" size="2xl" weight="black">BankaiFlex</BankaiText>
    <BankaiText as="p" size="lg" tone="muted">
      A polymorphic flexbox container. Props reflect as <BankaiCode>data-bankai-*</BankaiCode> and
      <BankaiCode>gap</BankaiCode> rides a custom property, styled by zero-specificity
      <BankaiCode>:where()</BankaiCode> theme rules — so a consumer's utility classes override
      without <BankaiCode>!important</BankaiCode>.
    </BankaiText>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Example</BankaiText>
      <div class="demo">
        <BankaiText size="sm" tone="muted">justify="between" · gap="4"</BankaiText>
        <BankaiFlex justify="between" gap="4">
          <span class="box">1</span>
          <span class="box">2</span>
          <span class="box">3</span>
        </BankaiFlex>

        <BankaiText size="sm" tone="muted">direction="column" · gap="2"</BankaiText>
        <BankaiFlex direction="column" gap="2">
          <span class="box">1</span>
          <span class="box">2</span>
        </BankaiFlex>
      </div>
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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}

.box {
  display: grid;
  place-items: center;
  min-width: 3rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: color-mix(in oklch, currentcolor 10%, transparent);
}
</style>
