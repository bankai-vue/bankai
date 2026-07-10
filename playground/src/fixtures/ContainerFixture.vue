<script setup lang="ts">
import { BankaiContainer } from '@bankai-vue/core';

// Deterministic fixture for visual regression + the structural e2e. BankaiContainer ships no CSS; the
// theme constrains the width. The `.bounds` wrapper is fixed wider than the (shrunk) max-width so the
// centered container shows its side bars, and both containers sit in one column for a clean snapshot.
//
// `--bankai-container-max-width` is overridden to a small value on `.bounds` (a plain declaration beats
// the theme's zero-specificity `:where()` token) so the centered/fluid contrast is visible and the e2e
// geometry is deterministic regardless of viewport width — not dependent on the 80rem house default.
</script>

<template>
  <div class="fixture" data-testid="container-fixture">
    <div class="bounds">
      <BankaiContainer data-testid="container-centered" class="box centered"
        >centered</BankaiContainer
      >
      <BankaiContainer data-testid="container-fluid" fluid class="box fluid">fluid</BankaiContainer>
    </div>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-block;
  padding: 1rem;
}

/* Fixed wider than the shrunk max-width so the centered container leaves side bars; the dashed outline
   marks the available width the containers lay out within. */
.bounds {
  --bankai-container-max-width: 16rem;
  inline-size: 28rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-block: 0.75rem;
  outline: 1px dashed light-dark(#94a3b8, #475569);
}

.box {
  padding-block: 0.75rem;
  text-align: center;
  border-radius: 0.5rem;
  font: 0.875rem sans-serif;
  color: light-dark(#0f172a, #f8fafc);
}

.centered {
  background: light-dark(#dbeafe, #1e3a5f);
}

.fluid {
  background: light-dark(#e2e8f0, #334155);
}
</style>
