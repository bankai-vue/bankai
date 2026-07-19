<script setup lang="ts">
import { BankaiIcon } from '@bankai-vue/core';

// Deterministic fixture for visual regression: exercises the size scale, the 1:1 box vs the
// `no-square` opt-out (a non-square glyph letterboxed vs kept at its own ratio), and `currentColor`
// inheritance — all with inline SVGs, so there is no external icon dependency in the baseline.
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
</script>

<template>
  <div class="fixture" data-testid="icon-fixture">
    <!-- size scale (currentColor tints each from the ambient text color) -->
    <div class="row">
      <BankaiIcon v-for="size in sizes" :key="size" :size="size" :label="`home ${size}`">
        <svg viewBox="0 0 24 24">
          <path d="M12 3 3 10v11h6v-6h6v6h6V10z" />
        </svg>
      </BankaiIcon>
    </div>

    <!-- 1:1 (square, letterboxed) vs no-square (intrinsic ratio) for a wide 2:1 glyph -->
    <div class="row boxed">
      <BankaiIcon size="xl" label="wide, square">
        <svg viewBox="0 0 48 24"><rect x="2" y="2" width="44" height="20" rx="3" /></svg>
      </BankaiIcon>
      <BankaiIcon size="xl" no-square label="wide, intrinsic">
        <svg viewBox="0 0 48 24"><rect x="2" y="2" width="44" height="20" rx="3" /></svg>
      </BankaiIcon>
    </div>

    <!-- currentColor: the icon inherits the ambient color -->
    <div class="row" style="color: rgb(220, 38, 38)">
      <BankaiIcon size="lg" label="tinted">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
      </BankaiIcon>
    </div>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

/* An outline so the letterboxed (square) vs intrinsic box difference is visible in the baseline. */
.boxed :where(.bankai-icon) {
  outline: 1px dashed color-mix(in oklch, currentcolor 30%, transparent);
}
</style>
