<script setup lang="ts">
import type { BankaiIconSize } from '@bankai-vue/core';
import { BankaiIcon } from '@bankai-vue/core';

// Non-visual fixture: one BankaiIcon per assertion, each with a stable testid, so the e2e spec can
// assert the `data-*` → computed-style mapping (the square box + size scale) that lives in theme
// icon.css. Uses inline SVGs only, so it is deterministic (no external icon dependency).
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies BankaiIconSize[];
</script>

<template>
  <div data-testid="icon-mapping">
    <!-- size scale → resolved font-size (drives the 1em box) -->
    <BankaiIcon v-for="size in sizes" :key="size" :size="size" :data-testid="`map-size-${size}`">
      <svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" /></svg>
    </BankaiIcon>

    <!-- escape hatch: a verbatim size rides `--bankai-icon-size` -->
    <BankaiIcon size="20px" data-testid="map-size-custom">
      <svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" /></svg>
    </BankaiIcon>

    <!-- 1:1 box: a square glyph at a fixed size yields a square box -->
    <BankaiIcon size="xl" data-testid="map-square">
      <svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" /></svg>
    </BankaiIcon>

    <!-- opt-out: a wide (2:1) glyph keeps its ratio, so the box is wider than tall -->
    <BankaiIcon size="xl" no-square data-testid="map-no-square">
      <svg viewBox="0 0 48 24"><path d="M0 0h48v24H0z" /></svg>
    </BankaiIcon>

    <!-- currentColor: the svg inherits the ambient color -->
    <div style="color: rgb(1, 2, 3)">
      <BankaiIcon data-testid="map-color">
        <svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" /></svg>
      </BankaiIcon>
    </div>
  </div>
</template>
