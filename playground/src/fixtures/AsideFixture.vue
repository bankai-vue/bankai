<script setup lang="ts">
import { BankaiAside } from '@bankai-vue/core';

// Deterministic fixture for visual regression + the structural e2e. BankaiAside ships no CSS; the theme
// gives it the side-rail look — padding, an inline-end divider border, and the page background. The
// fixture bounds the width so the rail reads as a column; the `label` prop feeds the aria-label the e2e
// asserts, and a faux section list makes the padding visible in the baseline.
</script>

<template>
  <div class="fixture" data-testid="aside-fixture">
    <BankaiAside data-testid="aside" label="Secondary navigation" class="demo">
      <nav class="nav">
        <span class="title">Section</span>
        <span>Overview</span>
        <span>Guides</span>
        <span>API</span>
      </nav>
    </BankaiAside>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-block;
  padding: 1rem;
}

/* Bound the rail so the snapshot crops to a fixed column. A plain class overrides the theme's
   zero-specificity `:where(.bankai-aside)` defaults. */
.demo {
  inline-size: 12rem;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font: 0.875rem sans-serif;
}

.title {
  font-weight: 700;
}
</style>
