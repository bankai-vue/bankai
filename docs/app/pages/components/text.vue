<script setup lang="ts">
import type { PropRow } from '../../utils/docs';
import { BankaiCode, BankaiFlex, BankaiText } from '@bankai-vue/core';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiText · bankai-vue' });

const props: PropRow[] = [
  {
    name: 'as',
    type: 'BankaiTextElement | string',
    default: "'span'",
    description:
      'Rendered tag. Inline text semantics (code, kbd, mark, strong, em, del, …); any other tag is accepted verbatim.',
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string",
    description:
      'Type size. A named step maps to the --bankai-text-size-* scale; any other string is a verbatim CSS font-size.',
  },
  {
    name: 'weight',
    type: "'thin' … 'black' | number | string",
    description:
      'Font weight. A named step reflects as data-bankai-weight; a number/other string is a verbatim font-weight.',
  },
  {
    name: 'tone',
    type: "'default' | 'muted' | 'subtle' | string",
    description:
      'Text tone. A named neutral tone resolves to a theme color; any other string is a verbatim CSS color.',
  },
  {
    name: 'truncate',
    type: 'boolean',
    default: 'false',
    description: 'Truncate overflowing text to a single line with an ellipsis.',
  },
];
</script>

<template>
  <article class="doc">
    <BankaiText as="h1" size="2xl" weight="black">BankaiText</BankaiText>
    <BankaiText as="p" size="lg" tone="muted">
      A polymorphic text primitive. Pick the element with <BankaiCode>as</BankaiCode> (including
      inline semantics like
      <BankaiCode>code</BankaiCode>/<BankaiCode>kbd</BankaiCode>/<BankaiCode>mark</BankaiCode>) and
      style with <BankaiCode>size</BankaiCode>/<BankaiCode>weight</BankaiCode>/<BankaiCode
        >tone</BankaiCode
      >
      — each a named set plus a verbatim escape hatch.
    </BankaiText>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Example</BankaiText>
      <div class="demo">
        <BankaiFlex direction="column" gap="3">
          <BankaiText size="2xl" weight="bold">Heading (2xl / bold)</BankaiText>
          <BankaiText size="md">Body text at the default weight.</BankaiText>
          <BankaiText size="sm" tone="muted">Muted small print.</BankaiText>
          <BankaiText size="sm" tone="subtle">Subtle small print.</BankaiText>
          <BankaiText>
            Inline semantics: press <BankaiText as="kbd">⌘K</BankaiText> to
            <BankaiText as="mark">highlight</BankaiText> some
            <BankaiText as="code">code</BankaiText>.
          </BankaiText>
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
  padding: 1.5rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}
</style>
