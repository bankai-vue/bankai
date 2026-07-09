<script setup lang="ts">
import { BankaiGrid, BankaiText } from '@bankai-vue/core';
import { componentNav } from '../../utils/docs';

definePageMeta({ layout: 'docs' });
useHead({ title: 'Components · bankai-vue' });
</script>

<template>
  <article class="doc">
    <BankaiText as="h1" size="2xl" weight="black">Components</BankaiText>
    <BankaiText as="p" size="lg" tone="muted">
      The components built so far. More land as the roadmap progresses — this list grows with them.
    </BankaiText>

    <BankaiGrid columns="2" gap="8" class="component-grid">
      <NuxtLink v-for="item in componentNav" :key="item.to" :to="item.to" class="card">
        <BankaiText as="h2" size="md" weight="semibold">Bankai{{ item.name }}</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">{{ item.tagline }}</BankaiText>
      </NuxtLink>
    </BankaiGrid>
  </article>
</template>

<style scoped>
.doc {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.component-grid {
  margin-top: 1rem;
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
