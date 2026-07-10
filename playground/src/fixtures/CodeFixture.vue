<script setup lang="ts">
import { BankaiCode } from '@bankai-vue/core';

// Deterministic fixture for visual regression + the structural e2e. BankaiCode ships no CSS; the theme
// gives it a monospace font + a chip background. The second line is smaller text so the baseline captures
// the `em`-relative sizing (the chip shrinks with its surrounding text), and the e2e can assert it.
</script>

<template>
  <div class="fixture" data-testid="code-fixture">
    <p class="line">
      Install <BankaiCode data-testid="code-inline">@bankai-vue/core</BankaiCode> then import
      <BankaiCode>BankaiCode</BankaiCode> from it.
    </p>
    <p class="line small">
      Scales with its context: <BankaiCode data-testid="code-small">px</BankaiCode> in small print.
    </p>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-block;
  padding: 1rem;
}

.line {
  margin: 0 0 0.5rem;
  font: 1rem sans-serif;
}

.small {
  font-size: 0.75rem;
}
</style>
