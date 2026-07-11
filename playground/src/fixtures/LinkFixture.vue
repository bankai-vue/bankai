<script setup lang="ts">
import { BankaiLink } from '@bankai-vue/core';

// Deterministic fixture for visual regression + the structural e2e. BankaiLink ships no CSS; the theme
// paints the link color, underline, and focus ring. No router is installed in the playground, so every
// link renders a native <a> — the default (internal-looking) link degrades to `<a href>`, and the
// external one carries `target="_blank"` (so it reflects `data-bankai-external` and gains the auto
// `rel="noopener noreferrer"`). Links sit in one column for a clean, stable snapshot.
</script>

<template>
  <div class="fixture" data-testid="link-fixture">
    <BankaiLink data-testid="link-default" href="/getting-started">Getting started</BankaiLink>
    <BankaiLink data-testid="link-external" href="https://example.com" target="_blank">
      External docs
    </BankaiLink>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 1rem;
  font: 1rem sans-serif;
}
</style>
