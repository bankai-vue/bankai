<script setup lang="ts">
import { BankaiFlex } from '@bankai-vue/core';

// Deterministic fixture for visual regression. BankaiFlex ships no CSS, so the
// boxes below are the only styling — they make the prop-driven layout (gap,
// direction, alignment, distribution, wrap) actually visible in the baseline.
</script>

<template>
  <div class="fixture" data-testid="flex-fixture">
    <!-- row + gap (spacing-scale step) -->
    <BankaiFlex :gap="4">
      <div class="box">1</div>
      <div class="box">2</div>
      <div class="box">3</div>
    </BankaiFlex>

    <!-- column + gap -->
    <BankaiFlex direction="column" :gap="4">
      <div class="box">1</div>
      <div class="box">2</div>
    </BankaiFlex>

    <!-- justify=between over a fixed-width track -->
    <BankaiFlex justify="between" class="track">
      <div class="box">L</div>
      <div class="box">R</div>
    </BankaiFlex>

    <!-- align=center with mixed-height children -->
    <BankaiFlex align="center" :gap="4">
      <div class="box tall">tall</div>
      <div class="box">mid</div>
    </BankaiFlex>

    <!-- wrap over a narrow track -->
    <BankaiFlex wrap="wrap" :gap="4" class="narrow">
      <div class="box">a</div>
      <div class="box">b</div>
      <div class="box">c</div>
      <div class="box">d</div>
    </BankaiFlex>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.box {
  display: grid;
  place-items: center;
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.25rem;
  background: light-dark(#cbd5e1, #334155);
  color: light-dark(#0f172a, #f8fafc);
  font: 0.875rem sans-serif;
}

.box.tall {
  height: 4rem;
}

.track {
  width: 12rem;
}

.narrow {
  width: 7rem;
}
</style>
