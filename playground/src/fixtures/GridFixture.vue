<script setup lang="ts">
import { BankaiGrid } from '@bankai-vue/core';

// Deterministic fixture for visual regression. BankaiGrid ships no CSS, so the
// boxes below are the only styling — they make the prop-driven layout (columns,
// gap, template areas, auto-flow, in-cell alignment) actually visible in the baseline.
</script>

<template>
  <div class="fixture" data-testid="grid-fixture">
    <!-- equal columns via a track count + gap (spacing-scale step) -->
    <BankaiGrid :columns="3" :gap="4" class="track">
      <div class="box">1</div>
      <div class="box">2</div>
      <div class="box">3</div>
    </BankaiGrid>

    <!-- explicit column template (sidebar + fluid main) -->
    <BankaiGrid columns="4rem 1fr" :gap="4" class="track">
      <div class="box">a</div>
      <div class="box">b</div>
    </BankaiGrid>

    <!-- named template areas -->
    <BankaiGrid
      :areas="['header header', 'sidebar main']"
      columns="4rem 1fr"
      :gap="2"
      class="track areas"
    >
      <div class="box" style="grid-area: header">H</div>
      <div class="box" style="grid-area: sidebar">S</div>
      <div class="box" style="grid-area: main">M</div>
    </BankaiGrid>

    <!-- dense auto-flow packing a mixed-span set -->
    <BankaiGrid :columns="4" flow="dense" :gap="2" class="track">
      <div class="box" style="grid-column: span 2">wide</div>
      <div class="box">1</div>
      <div class="box">2</div>
      <div class="box">3</div>
      <div class="box">4</div>
    </BankaiGrid>

    <!-- in-cell alignment: items centered within taller cells -->
    <BankaiGrid :columns="3" :gap="4" align="center" justify="center" class="track tall">
      <div class="box">x</div>
      <div class="box">y</div>
      <div class="box">z</div>
    </BankaiGrid>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.track {
  width: 14rem;
}

.areas {
  width: 10rem;
}

.tall {
  height: 4rem;
}

.box {
  display: grid;
  place-items: center;
  min-width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  background: light-dark(#cbd5e1, #334155);
  color: light-dark(#0f172a, #f8fafc);
  font: 0.875rem sans-serif;
}
</style>
