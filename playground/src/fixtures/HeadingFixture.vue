<script setup lang="ts">
import type { BankaiHeadingLevel } from '@bankai-vue/core';
import { BankaiHeading } from '@bankai-vue/core';

// Deterministic fixture for visual regression + the structural e2e. BankaiHeading ships no CSS; the theme
// paints the per-level type scale keyed on `data-bankai-level`. All six levels are rendered in one column
// so the baseline captures the size ramp, and each carries a `data-testid` the e2e asserts computed
// font-size against.
const levels: BankaiHeadingLevel[] = [1, 2, 3, 4, 5, 6];
</script>

<template>
  <div class="fixture" data-testid="heading-fixture">
    <BankaiHeading
      v-for="level in levels"
      :key="level"
      :level="level"
      :data-testid="`heading-${level}`"
    >
      Heading level {{ level }}
    </BankaiHeading>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}
</style>
