<script setup lang="ts">
import { BankaiApp } from '@bankai-vue/core';

// Deterministic fixture for visual regression + the structural e2e. BankaiApp ships no CSS; the theme
// carries the embedded-mode surface (color-scheme + the foundation bg/fg tokens) on the App's OWN box.
// The fixture sits the App box inside a contrasting "foreign host" frame so its self-contained house
// surface is visible against a non-house background — the embedded-island scenario. The e2e asserts the
// App box paints the bg/fg tokens; the baseline captures the painted island against the frame.
</script>

<template>
  <div class="fixture" data-testid="app-fixture">
    <div class="foreign-host">
      <BankaiApp data-testid="app" class="demo">
        <p class="body">Self-contained bankai island</p>
      </BankaiApp>
    </div>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-block;
  padding: 1rem;
}

/* A "foreign host" surface the embedded App does NOT belong to: a fixed non-house gray, so the App's own
   painted light/dark surface stands out against it (the embedded-island scenario). */
.foreign-host {
  inline-size: 20rem;
  padding: 1.5rem;
  background-color: oklch(70% 0.03 250);
}

.demo {
  padding: 1rem;
  border-radius: 0.5rem;
}

.body {
  margin: 0;
}
</style>
