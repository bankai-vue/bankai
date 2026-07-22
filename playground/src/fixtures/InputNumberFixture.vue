<script setup lang="ts">
import { BankaiInputNumber } from '@bankai-vue/core';

// Deterministic fixture for visual regression: the bare default at every size, then both button layouts
// ('stacked' / 'split'), a bounded field parked at its max (increment disabled), disabled/read-only
// controls, and a fractional-step field (which defaults to inputmode="decimal"). Static `model-value`s
// (no ref) keep screenshots stable. The `.bounds` wrapper gives the full-width controls a fixed inline-size
// so the baseline is deterministic.
const sizes = ['sm', 'md', 'lg'] as const;
</script>

<template>
  <div class="fixture" data-testid="input-number-fixture">
    <div class="bounds">
      <!-- Bare (default): no wrapper, no controls. -->
      <BankaiInputNumber
        v-for="size in sizes"
        :key="size"
        :size="size"
        :model-value="size === 'sm' ? 1 : size === 'md' ? 42 : 100"
        :data-testid="`input-number-${size}`"
      />

      <!-- Button layouts. -->
      <BankaiInputNumber :model-value="7" buttons="stacked" data-testid="input-number-stacked" />
      <BankaiInputNumber :model-value="7" buttons="split" data-testid="input-number-split" />

      <!-- States (with controls, stacked). -->
      <BankaiInputNumber
        :model-value="10"
        :min="0"
        :max="10"
        buttons
        data-testid="input-number-bounded"
      />
      <BankaiInputNumber :model-value="5" buttons disabled data-testid="input-number-disabled" />
      <BankaiInputNumber :model-value="5" buttons readonly data-testid="input-number-readonly" />

      <!-- Fractional step → inputmode="decimal" (the default derives it from step). -->
      <BankaiInputNumber
        :model-value="1.5"
        :step="0.5"
        buttons="split"
        data-testid="input-number-decimal"
      />
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
