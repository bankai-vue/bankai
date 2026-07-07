<script setup lang="ts">
import type {
  BankaiFlexAlign,
  BankaiFlexDirection,
  BankaiFlexJustify,
  BankaiFlexWrap,
} from '@bankai-vue/core';
import { BankaiFlex } from '@bankai-vue/core';

// Non-visual fixture: one BankaiFlex per prop value, each with a data-testid, so the
// e2e mapping test can read the *computed* CSS and lock the shorthand → CSS-value mapping
// that now lives in the theme's flex.css (data-bankai-align="start" → align-items: flex-start, …)
// rather than in type-checked TS. Every enum value is exercised.
const aligns = [
  'start',
  'end',
  'center',
  'baseline',
  'stretch',
] as const satisfies ReadonlyArray<BankaiFlexAlign>;
const justifies = [
  'start',
  'end',
  'center',
  'between',
  'around',
  'evenly',
] as const satisfies ReadonlyArray<BankaiFlexJustify>;
const directions = [
  'row',
  'row-reverse',
  'column',
  'column-reverse',
] as const satisfies ReadonlyArray<BankaiFlexDirection>;
const wraps = ['nowrap', 'wrap', 'wrap-reverse'] as const satisfies ReadonlyArray<BankaiFlexWrap>;
</script>

<template>
  <div data-testid="flex-mapping">
    <BankaiFlex
      v-for="value in aligns"
      :key="value"
      :align="value"
      :data-testid="`map-align-${value}`"
    >
      <span>x</span>
    </BankaiFlex>
    <BankaiFlex
      v-for="value in justifies"
      :key="value"
      :justify="value"
      :data-testid="`map-justify-${value}`"
    >
      <span>x</span>
    </BankaiFlex>
    <BankaiFlex
      v-for="value in directions"
      :key="value"
      :direction="value"
      :data-testid="`map-direction-${value}`"
    >
      <span>x</span>
    </BankaiFlex>
    <BankaiFlex
      v-for="value in wraps"
      :key="value"
      :wrap="value"
      :data-testid="`map-wrap-${value}`"
    >
      <span>x</span>
    </BankaiFlex>
    <BankaiFlex inline data-testid="map-inline"><span>x</span></BankaiFlex>
    <!-- bound number: spacing-scale step → --bankai-space-4 (0.5rem on theme-bankai's 2px grid) -->
    <BankaiFlex :gap="4" data-testid="map-gap-step"><span>x</span></BankaiFlex>
    <!-- step beyond the enumerated 0–32 tokens → base-unit fallback: 40 × --bankai-space-unit (2px) -->
    <BankaiFlex :gap="40" data-testid="map-gap-fallback"><span>x</span></BankaiFlex>
    <!-- static attribute: `gap="2"` arrives as the string "2"; must resolve to step 2 (0.5rem), not drop -->
    <BankaiFlex gap="2" data-testid="map-gap-static"><span>x</span></BankaiFlex>
  </div>
</template>
