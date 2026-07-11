<script setup lang="ts">
import type { PropRow } from '../../utils/docs';

definePageMeta({ layout: 'docs' });
useHead({ title: 'Getting started · bankai-vue' });

// Code samples live here as strings so the template renders them verbatim (no HTML parsing of the
// `<script setup>` / `<Bankai*>` tags inside them). The `<\/script>` escape keeps a sample from
// closing this SFC's own script block. Interim → a highlighted <BankaiCodeBlock> once it lands.
const viteSetup = `// main.ts
import { createApp } from 'vue';
import { createBankai } from '@bankai-vue/core';

// The theme ships the CSS — @bankai-vue/core ships none.
import '@bankai-vue/theme-bankai';

import App from './App.vue';

createApp(App)
  .use(createBankai())
  .mount('#app');`;

const viteUsage = `<script setup lang="ts">
import { BankaiButton } from '@bankai-vue/core';
<\/script>

<template>
  <BankaiButton variant="solid">Click me</BankaiButton>
</template>`;

const nuxtSetup = `// nuxt.config.ts
export default defineNuxtConfig({
  // Auto-registers every component, auto-imports the composables,
  // and installs the config per app (SSR-safe).
  modules: ['@bankai-vue/nuxt'],

  // The theme ships the CSS — @bankai-vue/core ships none.
  css: ['@bankai-vue/theme-bankai'],
});`;

const nuxtUsage = `<template>
  <!-- No import — the module auto-registers every component. -->
  <BankaiButton variant="solid">Click me</BankaiButton>
</template>`;

const nuxtOptions = `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@bankai-vue/nuxt'],
  css: ['@bankai-vue/theme-bankai'],

  // All options are optional; the defaults below are what you get with no 'bankai' key.
  bankai: {
    components: true,               // auto-register <Bankai*> components for template use
    composables: true,              // auto-import useBankaiId / usePrefixedId / useBankaiConfig
    config: { idGeneration: true }, // initial BankaiConfig, applied per-request under SSR
  },
});`;

const configExample = `import { createBankai } from '@bankai-vue/core';

app.use(
  createBankai({
    idGeneration: false,
    linkOrigin: 'https://example.com',
  }),
);`;

// Reuses the props table for the config surface: same name / type / default / description shape.
const configOptions: PropRow[] = [
  {
    name: 'idGeneration',
    type: 'boolean',
    default: 'true',
    description:
      'Whether components generate a stable id when the consumer supplies none. A consumer-provided id always wins.',
  },
  {
    name: 'warnings',
    type: 'boolean',
    default: 'true',
    description:
      'Emit development warnings for likely-mistaken usage. Already stripped from production builds; set false to silence them in dev too.',
  },
  {
    name: 'linkComponent',
    type: 'Component | string',
    description:
      'Force the component BankaiLink renders for internal navigation. Leave unset to auto-detect NuxtLink → RouterLink → <a>.',
  },
  {
    name: 'linkOrigin',
    type: 'string',
    description:
      'Site origin BankaiLink compares an href against to decide it is external. Set it for accurate, hydration-safe checks under SSR/SSG.',
  },
  {
    name: 'linkNoopener',
    type: 'boolean',
    default: 'true',
    description:
      'Auto-add rel="noopener noreferrer" to a target="_blank" link. A consumer-provided rel always wins.',
  },
];
</script>

<template>
  <article class="doc">
    <BankaiText as="h1" size="2xl" weight="black">Getting started</BankaiText>
    <BankaiText as="p" size="lg" tone="muted">
      Install <BankaiCode>@bankai-vue/core</BankaiCode>, add a theme for the CSS, and render your
      first component. Works the same in a plain Vue (Vite) app or in Nuxt.
    </BankaiText>

    <p class="callout">
      <BankaiText as="span" size="sm">
        <strong>Early development.</strong> The API is being designed in the open and nothing is on
        npm yet — the steps below document the intended shape. Follow the
        <BankaiLink
          href="https://github.com/bankai-vue/bankai/blob/main/ROADMAP.md"
          target="_blank"
        >
          roadmap
        </BankaiLink>
        for the first release.
      </BankaiText>
    </p>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Installation</BankaiText>
      <BankaiText as="p" tone="muted">
        You need two packages: <BankaiCode>@bankai-vue/core</BankaiCode> for the components and a
        theme for the CSS. Core ships <em>no</em> CSS of its own — without a theme the components
        render, but unstyled.
      </BankaiText>
      <pre class="code-block"><code>pnpm add @bankai-vue/core @bankai-vue/theme-bankai</code></pre>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Vue (Vite)</BankaiText>
      <BankaiText as="p" tone="muted">
        Install the plugin with <BankaiCode>createBankai()</BankaiCode> and import the theme's CSS
        once at your entry point.
      </BankaiText>
      <pre class="code-block"><code>{{ viteSetup }}</code></pre>
      <BankaiText as="p" tone="muted">Then import components where you use them:</BankaiText>
      <pre class="code-block"><code>{{ viteUsage }}</code></pre>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Nuxt</BankaiText>
      <BankaiText as="p" tone="muted">
        Add the first-party module and the theme CSS. The module auto-registers every component (so
        templates use <BankaiCode>&lt;Bankai*&gt;</BankaiCode> with no import), auto-imports the
        composables, and installs the config per app so it stays per-request under SSR.
      </BankaiText>
      <pre class="code-block"><code>{{ nuxtSetup }}</code></pre>
      <pre class="code-block"><code>{{ nuxtUsage }}</code></pre>
      <BankaiText as="h3" size="lg" weight="semibold">Module options</BankaiText>
      <BankaiText as="p" tone="muted">
        Configure the module under the <BankaiCode>bankai</BankaiCode> key. Every option is
        optional.
      </BankaiText>
      <pre class="code-block"><code>{{ nuxtOptions }}</code></pre>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Choosing a theme</BankaiText>
      <BankaiText as="p" tone="muted">
        Themes are separate CSS packages — core resolves against none of them, so you pick one and
        import its CSS. Two ship today:
      </BankaiText>
      <ul class="doc-list">
        <li>
          <BankaiCode>@bankai-vue/theme-bankai</BankaiCode> — the signature house look, an
          opinionated set of styled defaults. Customize it through
          <BankaiCode>--bankai-*</BankaiCode> custom properties.
        </li>
        <li>
          <BankaiCode>@bankai-vue/theme-tailwind</BankaiCode> — remaps the design tokens onto your
          Tailwind scale, so your own Tailwind design language drives the components. Requires
          Tailwind CSS v4.
        </li>
      </ul>
      <BankaiText as="p" tone="muted">
        Both override cleanly because the theme CSS is authored with zero-specificity
        <BankaiCode>:where()</BankaiCode> selectors.
      </BankaiText>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Configuration</BankaiText>
      <BankaiText as="p" tone="muted">
        Pass initial config to <BankaiCode>createBankai()</BankaiCode> (or the module's
        <BankaiCode>bankai.config</BankaiCode>). Read or mutate it at runtime with
        <BankaiCode>useBankaiConfig()</BankaiCode> inside a component's setup.
      </BankaiText>
      <pre class="code-block"><code>{{ configExample }}</code></pre>
      <PropsTable :rows="configOptions" />
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Next steps</BankaiText>
      <BankaiText as="p" tone="muted">
        Browse the
        <NuxtLink to="/components" class="doc-link">components</NuxtLink>
        for props, slots, and live examples.
      </BankaiText>
    </section>
  </article>
</template>

<style scoped>
.doc {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.doc-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.callout {
  margin: 0;
  padding: 0.875rem 1rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-left-width: 3px;
  border-radius: 0.5rem;
  background: color-mix(in oklch, currentcolor 4%, transparent);
}

.doc-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding-left: 1.25rem;
}

.doc-link {
  color: inherit;
}

/* Interim block-code look → future <BankaiCodeBlock>. Scrolls horizontally so a long line never
   forces the page body to scroll sideways. */
.code-block {
  margin: 0;
  padding: 1rem 1.25rem;
  overflow-x: auto;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
  background: color-mix(in oklch, currentcolor 4%, transparent);
  font-size: var(--bankai-text-size-sm, 0.875rem);
  line-height: 1.6;
}

.code-block code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  white-space: pre;
}
</style>
