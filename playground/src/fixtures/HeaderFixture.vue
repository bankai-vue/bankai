<script setup lang="ts">
import { BankaiHeader } from '@bankai-vue/core';

// Deterministic fixture for visual regression + the structural e2e. BankaiHeader ships no CSS; the
// theme gives it the house banner look — inline/block padding, a hairline bottom border, and the page
// background. The fixture bounds the width so the banner reads as a bar; the brand + faux nav make the
// padding and the content layout visible in the baseline.
</script>

<template>
  <div class="fixture" data-testid="header-fixture">
    <BankaiHeader data-testid="header" class="demo">
      <div class="bar">
        <span class="brand">bankai-vue</span>
        <nav class="nav">
          <span>Guide</span>
          <span>Components</span>
        </nav>
      </div>
    </BankaiHeader>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-block;
  padding: 1rem;
}

/* Bound the banner so the snapshot crops to a fixed bar. A plain class overrides the theme's
   zero-specificity `:where(.bankai-header)` defaults. */
.demo {
  inline-size: 28rem;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand {
  font: 700 1.125rem sans-serif;
}

.nav {
  display: flex;
  gap: 1rem;
  font: 0.875rem sans-serif;
}
</style>
