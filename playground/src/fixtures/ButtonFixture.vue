<script setup lang="ts">
import { BankaiButton } from '@bankai-vue/core';

// Deterministic fixture for visual regression: every variant × size, plus the
// disabled state. No dynamic content (no counter), so screenshots are stable.
const variants = ['solid', 'outline', 'ghost'] as const;
const sizes = ['sm', 'md', 'lg'] as const;
</script>

<template>
  <div class="fixture" data-testid="button-fixture">
    <div v-for="variant in variants" :key="variant" class="fixture-row">
      <BankaiButton v-for="size in sizes" :key="size" :variant="variant" :size="size">
        {{ variant }} {{ size }}
      </BankaiButton>
    </div>

    <div class="fixture-row">
      <BankaiButton disabled>disabled</BankaiButton>
    </div>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.fixture-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
</style>
