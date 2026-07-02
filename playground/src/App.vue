<script setup lang="ts">
import { BankaiButton, version } from '@bankai-vue/core';
import { ref } from 'vue';

const count = ref(0);

const variants = ['solid', 'outline', 'ghost'] as const;
const sizes = ['sm', 'md', 'lg'] as const;
</script>

<template>
  <main>
    <h1 data-testid="title">bankai-vue playground</h1>
    <p data-testid="core-version">core v{{ version }}</p>

    <section>
      <h2>BankaiButton</h2>

      <p>Reactivity smoke (also drives the e2e test):</p>
      <BankaiButton data-testid="counter" @click="count++">count is {{ count }}</BankaiButton>

      <h3>Variants</h3>
      <div class="row">
        <BankaiButton v-for="variant in variants" :key="variant" :variant="variant">
          {{ variant }}
        </BankaiButton>
      </div>

      <h3>Sizes</h3>
      <div class="row">
        <BankaiButton v-for="size in sizes" :key="size" :size="size">{{ size }}</BankaiButton>
      </div>

      <h3>States</h3>
      <div class="row">
        <BankaiButton disabled>disabled</BankaiButton>
      </div>
    </section>
  </main>
</template>

<!-- Component styling comes from @bankai-vue/theme-bankai (imported in main.ts); only playground layout lives here. -->
<style>
.row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-block: 0.5rem 1rem;
}
</style>
