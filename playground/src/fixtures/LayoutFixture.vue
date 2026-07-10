<script setup lang="ts">
import { BankaiLayout } from '@bankai-vue/core';

// Deterministic fixture for visual regression + the structural e2e. BankaiLayout ships no CSS; the
// theme places the regions on a grid. The `.demo` class bounds the shell (the theme defaults to
// `min-block-size: 100dvh`, which would blow the snapshot up to the viewport) and the region boxes
// make the grid placement — header on top, sidebar left of main, footer at the bottom — visible.
</script>

<template>
  <div class="fixture" data-testid="layout-fixture">
    <BankaiLayout class="demo">
      <template #header>
        <div class="region header">header</div>
      </template>
      <template #sidebar>
        <div class="region sidebar">sidebar</div>
      </template>
      <div class="region main">main</div>
      <template #footer>
        <div class="region footer">footer</div>
      </template>
    </BankaiLayout>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-block;
  padding: 1rem;
}

/* Bound the shell so the snapshot crops to a fixed box instead of the full viewport. A plain class
   overrides the theme's zero-specificity `:where(.bankai-layout)` defaults. */
.demo {
  inline-size: 22rem;
  block-size: 16rem;
  min-block-size: 0;
  border: 1px solid light-dark(#cbd5e1, #334155);
  border-radius: 0.5rem;
  overflow: hidden;
}

.region {
  display: grid;
  place-items: center;
  padding: 0.5rem;
  font: 0.875rem sans-serif;
  color: light-dark(#0f172a, #f8fafc);
}

.header {
  background: light-dark(#dbeafe, #1e3a5f);
}

.sidebar {
  background: light-dark(#e2e8f0, #334155);
}

.main {
  background: light-dark(#f1f5f9, #1e293b);
}

.footer {
  background: light-dark(#dbeafe, #1e3a5f);
}
</style>
