<script setup lang="ts">
import {
  BankaiButton,
  BankaiCode,
  BankaiContainer,
  BankaiFlex,
  BankaiGrid,
  BankaiLayout,
  BankaiLink,
  BankaiText,
  version,
} from '@bankai-vue/core';
import { ref } from 'vue';
import ColorSchemeSwitcher from './components/ColorSchemeSwitcher.vue';
import ThemeSwitcher from './components/ThemeSwitcher.vue';

const count = ref(0);

const variants = ['solid', 'outline', 'ghost'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

const textSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
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
] as const;
const tones = ['default', 'muted', 'subtle'] as const;
</script>

<template>
  <div class="controls">
    <ThemeSwitcher />
    <ColorSchemeSwitcher />
  </div>

  <main>
    <h1 data-testid="title">bankai-vue playground</h1>
    <p data-testid="core-version">core v{{ version }}</p>

    <section>
      <h2>BankaiButton</h2>

      <p>Reactivity smoke (also drives the e2e test):</p>
      <BankaiButton data-testid="counter" @click="count++">count is {{ count }}</BankaiButton>

      <h3>Variants</h3>
      <div class="row">
        <BankaiButton v-for="variant in variants" :key="variant" :variant="variant">
          {{ variant }}
        </BankaiButton>
      </div>

      <h3>Sizes</h3>
      <div class="row">
        <BankaiButton v-for="size in sizes" :key="size" :size="size">{{ size }}</BankaiButton>
      </div>

      <h3>States</h3>
      <div class="row">
        <BankaiButton disabled>disabled</BankaiButton>
      </div>
    </section>

    <section>
      <h2>BankaiFlex</h2>

      <p>Prop-driven layout via data-* + theme CSS (utility classes can override):</p>
      <BankaiFlex data-testid="flex-row" :gap="4" align="center">
        <BankaiButton>one</BankaiButton>
        <BankaiButton variant="outline">two</BankaiButton>
        <BankaiButton variant="ghost">three</BankaiButton>
      </BankaiFlex>
    </section>

    <section>
      <h2>BankaiGrid</h2>

      <p>2D prop-driven layout via data-* + <code>--bankai-grid-*</code> + theme CSS:</p>

      <h3>Equal columns (track count) + gap</h3>
      <BankaiGrid data-testid="grid-cols" :columns="3" :gap="4">
        <BankaiButton>one</BankaiButton>
        <BankaiButton variant="outline">two</BankaiButton>
        <BankaiButton variant="ghost">three</BankaiButton>
      </BankaiGrid>

      <h3>Template areas</h3>
      <BankaiGrid :areas="['header header', 'sidebar main']" columns="6rem 1fr" :gap="2">
        <BankaiButton style="grid-area: header">header</BankaiButton>
        <BankaiButton variant="outline" style="grid-area: sidebar">side</BankaiButton>
        <BankaiButton variant="ghost" style="grid-area: main">main</BankaiButton>
      </BankaiGrid>
    </section>

    <section>
      <h2>BankaiLayout</h2>

      <p>App shell emitting native landmark regions (header/aside/main/footer) on a CSS grid:</p>

      <!-- Bounded here (the theme defaults to min-block-size: 100dvh) so the demo stays inline. -->
      <BankaiLayout data-testid="layout" class="layout-demo">
        <template #header><div class="region">header</div></template>
        <template #sidebar><div class="region">sidebar</div></template>
        <div class="region">main</div>
        <template #footer><div class="region">footer</div></template>
      </BankaiLayout>
    </section>

    <section>
      <h2>BankaiContainer</h2>

      <p>
        Width utility — centered max-width by default, edge-to-edge with <code>fluid</code>. The
        max-width is shrunk here (via <code>--bankai-container-max-width</code>) so the centered
        bars are visible inline:
      </p>

      <div class="container-demo">
        <BankaiContainer data-testid="container" class="container-box"
          >centered (default)</BankaiContainer
        >
        <BankaiContainer fluid class="container-box">fluid (full width)</BankaiContainer>
      </div>
    </section>

    <section>
      <h2>BankaiLink</h2>

      <p>
        Renders a native <code>&lt;a&gt;</code> here (no router installed); with vue-router/Nuxt it
        resolves <code>RouterLink</code>/<code>NuxtLink</code> for internal <code>to</code>.
        External (new-tab) links reflect <code>data-bankai-external</code> and get a safe
        <code>rel</code>:
      </p>

      <div class="row">
        <BankaiLink href="/getting-started">Internal link</BankaiLink>
        <BankaiLink href="https://example.com" target="_blank">External (new tab)</BankaiLink>
      </div>
    </section>

    <section>
      <h2>BankaiCode</h2>

      <p>
        Inline code primitive — a native <BankaiCode>&lt;code&gt;</BankaiCode> with a monospace font
        and a subtle chip background. It scales with its surrounding text, so
        <BankaiCode>pnpm add @bankai-vue/core</BankaiCode> reads the same in a
        <BankaiText as="span" size="sm">smaller line (<BankaiCode>sm</BankaiCode>)</BankaiText> as
        in this one.
      </p>
    </section>

    <section>
      <h2>BankaiText</h2>

      <h3>Type scale</h3>
      <BankaiFlex direction="column" align="start" :gap="2">
        <BankaiText v-for="size in textSizes" :key="size" :size="size">
          {{ size }} — the quick brown fox
        </BankaiText>
      </BankaiFlex>

      <h3>Weights</h3>
      <BankaiFlex :gap="4" wrap="wrap" align="baseline">
        <BankaiText v-for="weight in weights" :key="weight" :weight="weight">
          {{ weight }}
        </BankaiText>
      </BankaiFlex>

      <h3>Tones</h3>
      <BankaiFlex :gap="4" align="center">
        <BankaiText v-for="tone in tones" :key="tone" :tone="tone">{{ tone }}</BankaiText>
      </BankaiFlex>

      <h3>Inline semantics via `as`</h3>
      <BankaiText>
        plain with <BankaiText as="strong" weight="bold">strong</BankaiText>,
        <BankaiText as="em">em</BankaiText>, <BankaiText as="mark">mark</BankaiText>,
        <BankaiText as="code">code()</BankaiText>, and <BankaiText as="kbd">Ctrl</BankaiText>
      </BankaiText>

      <h3>Escape hatches (verbatim CSS)</h3>
      <BankaiFlex :gap="4" align="baseline" wrap="wrap">
        <BankaiText size="1.75rem">custom size</BankaiText>
        <BankaiText :weight="350">weight 350</BankaiText>
        <BankaiText tone="rgb(220, 38, 38)">custom color</BankaiText>
      </BankaiFlex>
    </section>
  </main>
</template>

<!-- Component styling comes from the selected theme (ThemeSwitcher); only playground layout lives here. -->
<style>
.controls {
  position: fixed;
  z-index: 1;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-block: 0.5rem 1rem;
}

/* Bound the BankaiLayout demo (the theme defaults to min-block-size: 100dvh). */
.layout-demo {
  block-size: 12rem;
  min-block-size: 0;
  border: 1px solid color-mix(in oklch, currentcolor 20%, transparent);
  border-radius: 0.5rem;
  overflow: hidden;
}

.layout-demo .region {
  display: grid;
  place-items: center;
  padding: 0.5rem;
  background: color-mix(in oklch, currentcolor 8%, transparent);
}

/* Bound the BankaiContainer demo and shrink the max-width so the centered container's side bars are
   visible; the dashed outline marks the available width the containers lay out within. */
.container-demo {
  --bankai-container-max-width: 20rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-block: 0.5rem;
  outline: 1px dashed color-mix(in oklch, currentcolor 30%, transparent);
}

.container-box {
  padding-block: 0.5rem;
  text-align: center;
  border-radius: 0.375rem;
  background: color-mix(in oklch, currentcolor 8%, transparent);
}
</style>
