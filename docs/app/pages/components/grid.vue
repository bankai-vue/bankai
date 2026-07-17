<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiGrid · bankai-vue' });
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiGrid</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        A polymorphic CSS-grid container for 2D layouts. Enumerated props reflect as
        <BankaiCode>data-bankai-*</BankaiCode>; continuous track values
        (<BankaiCode>columns</BankaiCode>/<BankaiCode>rows</BankaiCode>/<BankaiCode>areas</BankaiCode>/<BankaiCode>gap</BankaiCode>)
        ride <BankaiCode>--bankai-grid-*</BankaiCode> custom properties read by the theme's
        <BankaiCode>:where()</BankaiCode> rules.
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

      <ComponentApi :meta="componentMeta.BankaiGrid" />
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
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
