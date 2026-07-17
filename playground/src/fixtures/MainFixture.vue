<script setup lang="ts">
import { BankaiMain } from '@bankai-vue/core';

// Deterministic fixture for visual regression + the structural e2e. BankaiMain ships no CSS; the theme
// floors its min inline size at 0. The fixture makes BankaiMain a flex child of a bounded row and drops
// a wide, unbreakable line inside it: with the floor the region shrinks to the box and the line scrolls
// within (the `.body` clips it); without the floor the region would blow the row wider. The e2e asserts
// the computed min-inline-size; the baseline captures the content.
</script>

<template>
  <div class="fixture" data-testid="main-fixture">
    <div class="row">
      <BankaiMain data-testid="main" class="demo">
        <h1 class="title">Main content</h1>
        <p class="body">A_very_long_unbreakable_token_that_would_overflow_without_the_floor</p>
      </BankaiMain>
    </div>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-block;
  padding: 1rem;
}

/* A bounded flex row: without BankaiMain's min-inline-size floor, the wide token below would push this
   wider than 20rem. */
.row {
  display: flex;
  inline-size: 20rem;
}

.demo {
  padding: 0.75rem;
}

.title {
  margin: 0 0 0.5rem;
  font: 700 1.125rem sans-serif;
}

/* Clip the wide token so the baseline is stable (the point is the region shrank, not the scroll). */
.body {
  margin: 0;
  overflow: hidden;
  font: 0.875rem monospace;
}
</style>
