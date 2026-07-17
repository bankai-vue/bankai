<script setup lang="ts">
import { BankaiFooter } from '@bankai-vue/core';

// Deterministic fixture for visual regression + the structural e2e. BankaiFooter ships no CSS; the theme
// gives it the house foot look — inline/block padding, a hairline TOP border, and the page background.
// The fixture bounds the width so the foot reads as a bar; the copyright + faux links make the padding
// and the top divider visible in the baseline.
</script>

<template>
  <div class="fixture" data-testid="footer-fixture">
    <BankaiFooter data-testid="footer" class="demo">
      <div class="bar">
        <small>© 2026 bankai-vue</small>
        <nav class="links">
          <span>Privacy</span>
          <span>Terms</span>
        </nav>
      </div>
    </BankaiFooter>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-block;
  padding: 1rem;
}

/* Bound the foot so the snapshot crops to a fixed bar. A plain class overrides the theme's
   zero-specificity `:where(.bankai-footer)` defaults. */
.demo {
  inline-size: 28rem;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font: 0.875rem sans-serif;
}

.links {
  display: flex;
  gap: 1rem;
}
</style>
