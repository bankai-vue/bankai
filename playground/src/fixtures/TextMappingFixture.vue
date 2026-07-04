<script setup lang="ts">
import type { BankaiTextSize, BankaiTextTone, BankaiTextWeight } from '@bankai-vue/core';
import { BankaiText } from '@bankai-vue/core';

// Non-visual fixture: one BankaiText per prop value, each with a stable testid, so the e2e
// spec can assert the `data-*` → computed-style mapping that lives in theme text.css.
const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const satisfies BankaiTextSize[];
const weights = [
  'thin',
  'extralight',
  'light',
  'normal',
  'medium',
  'semibold',
  'bold',
  'extrabold',
  'black',
] as const satisfies BankaiTextWeight[];
const tones = ['default', 'muted', 'subtle'] as const satisfies BankaiTextTone[];
</script>

<template>
  <div data-testid="text-mapping">
    <BankaiText v-for="size in sizes" :key="size" :size="size" :data-testid="`map-size-${size}`">
      {{ size }}
    </BankaiText>

    <BankaiText
      v-for="weight in weights"
      :key="weight"
      :weight="weight"
      :data-testid="`map-weight-${weight}`"
    >
      {{ weight }}
    </BankaiText>

    <BankaiText v-for="tone in tones" :key="tone" :tone="tone" :data-testid="`map-tone-${tone}`">
      {{ tone }}
    </BankaiText>

    <BankaiText truncate data-testid="map-truncate">truncated content that overflows</BankaiText>

    <!-- Escape hatches: verbatim (non-named) values ride the `--bankai-text-*` custom properties. -->
    <BankaiText size="1.5rem" data-testid="map-size-custom">custom size</BankaiText>
    <BankaiText :weight="350" data-testid="map-weight-custom">custom weight</BankaiText>
    <BankaiText tone="rgb(255, 0, 0)" data-testid="map-tone-custom">custom tone</BankaiText>

    <!-- A numeric-looking string weight is verbatim CSS (routed by name, not type). -->
    <BankaiText weight="350" data-testid="map-weight-string">string weight</BankaiText>

    <!-- var() flows through the base rule via nested custom properties (defined inline here). -->
    <BankaiText size="var(--demo-size)" style="--demo-size: 2rem" data-testid="map-size-var">
      size var
    </BankaiText>
    <BankaiText weight="var(--demo-wght)" style="--demo-wght: 650" data-testid="map-weight-var">
      weight var
    </BankaiText>
    <BankaiText
      tone="var(--demo-color)"
      style="--demo-color: rgb(1, 2, 3)"
      data-testid="map-tone-var"
    >
      tone var
    </BankaiText>

    <!--
      No-leak nesting: a verbatim value on an ancestor must NOT inherit past a named-value
      descendant and re-apply on deeper text. The innermost element (no props) must inherit its
      named-value parent's resolved size (sm = 14px), not the verbatim grandparent's 3rem.
    -->
    <BankaiText size="3rem">
      <BankaiText size="sm">
        <BankaiText as="em" data-testid="map-nested-inherit">nested</BankaiText>
      </BankaiText>
    </BankaiText>
  </div>
</template>
