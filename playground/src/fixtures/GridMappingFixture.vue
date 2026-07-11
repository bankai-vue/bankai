<script setup lang="ts">
import type { BankaiGridAlign, BankaiGridFlow, BankaiGridJustify } from '@bankai-vue/core';
import { BankaiGrid } from '@bankai-vue/core';

// Non-visual fixture: one BankaiGrid per prop value, each with a data-testid, so the
// e2e mapping test can read the *computed* CSS and lock the mapping that now lives in the
// theme's grid.css (data-bankai-align="start" → align-items: start, the --bankai-grid-*
// custom properties → grid-template-*/gap, …) rather than in type-checked TS. Every enum
// value is exercised, plus the continuous track/gap resolutions.
const flows = [
  'row',
  'column',
  'dense',
  'row-dense',
  'column-dense',
] as const satisfies ReadonlyArray<BankaiGridFlow>;
const aligns = [
  'start',
  'end',
  'center',
  'baseline',
  'stretch',
] as const satisfies ReadonlyArray<BankaiGridAlign>;
const justifies = [
  'start',
  'end',
  'center',
  'stretch',
] as const satisfies ReadonlyArray<BankaiGridJustify>;
</script>

<template>
  <div data-testid="grid-mapping">
    <BankaiGrid
      v-for="value in flows"
      :key="value"
      :flow="value"
      :data-testid="`map-flow-${value}`"
    >
      <span>x</span>
    </BankaiGrid>
    <BankaiGrid
      v-for="value in aligns"
      :key="value"
      :align="value"
      :data-testid="`map-align-${value}`"
    >
      <span>x</span>
    </BankaiGrid>
    <BankaiGrid
      v-for="value in justifies"
      :key="value"
      :justify="value"
      :data-testid="`map-justify-${value}`"
    >
      <span>x</span>
    </BankaiGrid>
    <BankaiGrid inline data-testid="map-inline"><span>x</span></BankaiGrid>
    <!-- track count: number → repeat(3, minmax(0, 1fr)) → 3 resolved tracks over a fixed width -->
    <BankaiGrid :columns="3" class="track" data-testid="map-columns-count"
      ><span>x</span></BankaiGrid
    >
    <!-- static attribute: `columns="2"` arrives as the string "2"; must resolve to 2 tracks, not drop -->
    <BankaiGrid columns="2" class="track" data-testid="map-columns-static"
      ><span>x</span></BankaiGrid
    >
    <!-- verbatim template: two explicit tracks -->
    <BankaiGrid columns="200px 1fr" class="track" data-testid="map-columns-verbatim">
      <span>x</span>
    </BankaiGrid>
    <!-- rows: number → repeat(2, minmax(0, 1fr)) -->
    <BankaiGrid :rows="2" class="track-rows" data-testid="map-rows-count"
      ><span>x</span></BankaiGrid
    >
    <!-- areas: array auto-quoted per row → normalized grid-template-areas -->
    <BankaiGrid :areas="['header header', 'sidebar main']" data-testid="map-areas">
      <span>x</span>
    </BankaiGrid>
    <!-- gap step 4 → theme-bankai's 0.5rem (8px); step 40 hits the base-unit fallback (80px) -->
    <BankaiGrid :gap="4" data-testid="map-gap-step"><span>x</span></BankaiGrid>
    <BankaiGrid :gap="40" data-testid="map-gap-fallback"><span>x</span></BankaiGrid>
    <BankaiGrid gap="2" data-testid="map-gap-static"><span>x</span></BankaiGrid>
    <!-- named t-shirt gap step → --bankai-gap-md (0.75rem = 12px on theme-bankai), NOT an invalid `gap: md` -->
    <BankaiGrid gap="md" data-testid="map-gap-named"><span>x</span></BankaiGrid>
    <!-- escape hatch: a verbatim native `align`/`justify` (not a keyword) rides the custom property -->
    <BankaiGrid align="flex-start" data-testid="map-align-verbatim"><span>x</span></BankaiGrid>
    <BankaiGrid justify="flex-start" data-testid="map-justify-verbatim"><span>x</span></BankaiGrid>
  </div>
</template>

<style scoped>
/* A fixed width so `repeat(n, minmax(0, 1fr))` resolves to a countable set of tracks. */
.track {
  width: 12rem;
}

.track-rows {
  height: 8rem;
}
</style>
