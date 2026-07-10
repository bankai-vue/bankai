<script setup lang="ts">
import type { PropRow } from '../../utils/docs';
import { BankaiGrid, BankaiText } from '@bankai-vue/core';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiGrid · bankai-vue' });

const props: PropRow[] = [
  {
    name: 'as',
    type: 'HTML tag name',
    default: "'div'",
    description: 'Polymorphic element to render.',
  },
  {
    name: 'columns',
    type: 'number | string',
    description:
      'grid-template-columns. A number becomes repeat(n, minmax(0, 1fr)); any other string is verbatim.',
  },
  {
    name: 'rows',
    type: 'number | string',
    description: 'grid-template-rows. A number becomes repeat(n, …); any other string is verbatim.',
  },
  {
    name: 'areas',
    type: 'string | string[]',
    description: 'grid-template-areas. An array is one row per entry; a string is verbatim.',
  },
  {
    name: 'gap',
    type: 'number | string',
    description:
      'Spacing between tracks. A number is a --bankai-space-<n> step; a two-value string sets row/column gaps.',
  },
  {
    name: 'flow',
    type: "'row' | 'column' | 'dense' | 'row-dense' | 'column-dense'",
    description: 'grid-auto-flow — auto-placement direction.',
  },
  {
    name: 'align',
    type: "'start' | 'end' | 'center' | 'baseline' | 'stretch'",
    description: 'align-items (block axis within each cell).',
  },
  {
    name: 'justify',
    type: "'start' | 'end' | 'center' | 'stretch'",
    description: 'justify-items (inline axis within each cell).',
  },
  {
    name: 'inline',
    type: 'boolean',
    default: 'false',
    description: 'Render as inline-grid instead of grid.',
  },
];
</script>

<template>
  <article class="doc">
    <BankaiText as="h1" size="2xl" weight="black">BankaiGrid</BankaiText>
    <BankaiText as="p" size="lg" tone="muted">
      A polymorphic CSS-grid container for 2D layouts. Enumerated props reflect as
      <code>data-bankai-*</code>; continuous track values
      (<code>columns</code>/<code>rows</code>/<code>areas</code>/<code>gap</code>) ride
      <code>--bankai-grid-*</code> custom properties read by the theme's
      <code>:where()</code> rules.
    </BankaiText>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Example</BankaiText>
      <div class="demo">
        <BankaiText size="sm" tone="muted">columns="3" · gap="4"</BankaiText>
        <BankaiGrid columns="3" gap="4">
          <span class="box">1</span>
          <span class="box">2</span>
          <span class="box">3</span>
          <span class="box">4</span>
          <span class="box">5</span>
          <span class="box">6</span>
        </BankaiGrid>
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
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: color-mix(in oklch, currentcolor 10%, transparent);
}
</style>
