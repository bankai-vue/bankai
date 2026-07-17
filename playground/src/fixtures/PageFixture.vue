<script setup lang="ts">
import { BankaiPage } from '@bankai-vue/core';

// Deterministic fixture for visual regression + the structural e2e. BankaiPage ships no CSS; the theme
// fills its min-block-size (`100%`). The fixture bounds a frame at a definite block size and drops a SHORT
// route inside it: with the fill, BankaiPage stretches to the full frame height (so a footer would be
// pushed down); without it, the page would only be as tall as its content. The e2e asserts the page fills
// the frame; the baseline captures the filled region (the dashed frame vs. the filled page box).
</script>

<template>
  <div class="fixture" data-testid="page-fixture">
    <div class="frame">
      <BankaiPage data-testid="page" class="demo">
        <p class="body">Short route content</p>
      </BankaiPage>
    </div>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-block;
  padding: 1rem;
}

/* A frame with a definite block size: BankaiPage's `min-block-size: 100%` resolves against it, so the
   short page below fills the whole 16rem instead of hugging its one line of content. */
.frame {
  inline-size: 20rem;
  block-size: 16rem;
  outline: 1px dashed color-mix(in oklch, currentcolor 30%, transparent);
}

/* An outline marks the page box so the fill is visible in the baseline (the page ships no paint). */
.demo {
  outline: 2px solid color-mix(in oklch, currentcolor 20%, transparent);
}

.body {
  margin: 0;
  padding: 0.75rem;
}
</style>
