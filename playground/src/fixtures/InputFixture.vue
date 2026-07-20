<script setup lang="ts">
import { BankaiInput } from '@bankai-vue/core';

// Deterministic fixture for visual regression: every size with a static value, plus a placeholder,
// disabled, and read-only state. Static `model-value`s (no ref) keep screenshots stable. The `.bounds`
// wrapper gives the full-width inputs a fixed inline-size so the baseline is deterministic.
const sizes = ['sm', 'md', 'lg'] as const;
</script>

<template>
  <div class="fixture" data-testid="input-fixture">
    <div class="bounds">
      <BankaiInput
        v-for="size in sizes"
        :key="size"
        :size="size"
        :model-value="`${size} value`"
        :data-testid="`input-${size}`"
      />
      <BankaiInput model-value="" placeholder="Placeholder text" data-testid="input-placeholder" />
      <BankaiInput model-value="Disabled" disabled data-testid="input-disabled" />
      <BankaiInput model-value="Read-only" readonly data-testid="input-readonly" />
    </div>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-flex;
  padding: 1rem;
}

.bounds {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  inline-size: 20rem;
}
</style>
