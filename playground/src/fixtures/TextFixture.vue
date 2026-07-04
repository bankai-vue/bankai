<script setup lang="ts">
import { BankaiText } from '@bankai-vue/core';

// Deterministic fixture for visual regression: exercises the type scale, weights, tones,
// native inline semantics reached via `as`, and single-line truncation in one baseline.
</script>

<template>
  <div class="fixture" data-testid="text-fixture">
    <!-- type scale -->
    <BankaiText size="xs">xs — the quick brown fox</BankaiText>
    <BankaiText size="sm">sm — the quick brown fox</BankaiText>
    <BankaiText size="md">md — the quick brown fox</BankaiText>
    <BankaiText size="lg">lg — the quick brown fox</BankaiText>
    <BankaiText size="xl">xl — the quick brown fox</BankaiText>
    <BankaiText size="2xl">2xl — the quick brown fox</BankaiText>

    <!-- weights -->
    <BankaiText weight="thin">thin</BankaiText>
    <BankaiText weight="extralight">extralight</BankaiText>
    <BankaiText weight="light">light</BankaiText>
    <BankaiText weight="normal">normal</BankaiText>
    <BankaiText weight="medium">medium</BankaiText>
    <BankaiText weight="semibold">semibold</BankaiText>
    <BankaiText weight="bold">bold</BankaiText>
    <BankaiText weight="extrabold">extrabold</BankaiText>
    <BankaiText weight="black">black</BankaiText>

    <!-- tones -->
    <BankaiText tone="default">default tone</BankaiText>
    <BankaiText tone="muted">muted tone</BankaiText>
    <BankaiText tone="subtle">subtle tone</BankaiText>

    <!-- native inline semantics via `as` -->
    <BankaiText>
      plain with <BankaiText as="strong">strong</BankaiText>, <BankaiText as="em">em</BankaiText>,
      <BankaiText as="mark">mark</BankaiText>, <BankaiText as="code">code()</BankaiText>,
      <BankaiText as="kbd">Ctrl</BankaiText>, and <BankaiText as="del">del</BankaiText>
    </BankaiText>

    <!-- escape hatches: verbatim size / numeric weight / arbitrary color -->
    <BankaiText size="2rem" :weight="350" tone="rgb(220, 38, 38)"
      >custom size · weight · tone</BankaiText
    >

    <!-- single-line truncation over a fixed-width track -->
    <BankaiText truncate class="narrow">
      this line is far too long to fit and should end with an ellipsis
    </BankaiText>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-flex;
  flex-direction: column;
  align-items: start;
  gap: 0.5rem;
  padding: 1rem;
}

.narrow {
  width: 12rem;
}
</style>
