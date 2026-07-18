<script setup lang="ts">
import type { PropRow } from '../../utils/docs';
import { computed } from 'vue';

// Pilot page for the docs-site i18n: fully translated (en + de). Prose lives in the message files;
// paragraphs with inline components (<BankaiCode>, <em>, links) use <i18n-t> with named slots so the
// markup stays in the template while the surrounding text is localized. Code samples are not
// translated. The rest of the site keeps its English prose with the same machinery ready.
const { t } = useI18n();

definePageMeta({ layout: 'docs' });
// Function form so the title re-evaluates when the locale switches.
useHead(() => ({ title: t('pages.gettingStarted.title') }));

// Code samples live here as strings so BankaiCodeBlock renders them verbatim (no HTML parsing of the
// `<script setup>` / `<Bankai*>` tags inside them). The closing tag in the SFC sample is assembled
// from parts (`scriptClose`) so the raw source never contains a literal closing-script sequence that
// would close this SFC's own script block.
// eslint-disable-next-line no-useless-concat -- deliberate: the split keeps the literal tag out of source
const scriptClose = '</scr' + 'ipt>';
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
${scriptClose}

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
// Names/types/defaults are code identifiers (not localized); only the descriptions are translated, so
// this is a computed that re-evaluates when the locale switches.
const configOptions = computed<PropRow[]>(() => [
  {
    name: 'idGeneration',
    type: 'boolean',
    default: 'true',
    description: t('gettingStarted.config.options.idGeneration'),
  },
  {
    name: 'warnings',
    type: 'boolean',
    default: 'true',
    description: t('gettingStarted.config.options.warnings'),
  },
  {
    name: 'linkComponent',
    type: 'Component | string',
    description: t('gettingStarted.config.options.linkComponent'),
  },
  {
    name: 'linkOrigin',
    type: 'string',
    description: t('gettingStarted.config.options.linkOrigin'),
  },
  {
    name: 'linkNoopener',
    type: 'boolean',
    default: 'true',
    description: t('gettingStarted.config.options.linkNoopener'),
  },
  {
    name: 'codeBlockCopiedDuration',
    type: 'number',
    default: '2000',
    description: t('gettingStarted.config.options.codeBlockCopiedDuration'),
  },
]);
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">{{ t('gettingStarted.heading') }}</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="gettingStarted.lede" tag="span" scope="global">
          <template #core><BankaiCode>@bankai-vue/core</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <p class="callout">
        <BankaiText as="span" size="sm">
          <strong>{{ t('gettingStarted.callout.lead') }}</strong>
          <i18n-t keypath="gettingStarted.callout.body" tag="span" scope="global">
            <template #roadmap>
              <BankaiLink
                href="https://github.com/bankai-vue/bankai/blob/main/ROADMAP.md"
                target="_blank"
              >
                {{ t('gettingStarted.callout.roadmapLink') }}
              </BankaiLink>
            </template>
          </i18n-t>
        </BankaiText>
      </p>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('gettingStarted.install.heading')
        }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="gettingStarted.install.body" tag="span" scope="global">
            <template #core><BankaiCode>@bankai-vue/core</BankaiCode></template>
            <template #no
              ><em>{{ t('gettingStarted.install.no') }}</em></template
            >
          </i18n-t>
        </BankaiText>
        <CodeBlock language="bash" code="pnpm add @bankai-vue/core @bankai-vue/theme-bankai" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('gettingStarted.vite.heading')
        }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="gettingStarted.vite.intro" tag="span" scope="global">
            <template #createBankai><BankaiCode>createBankai()</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="ts" :code="viteSetup" />
        <BankaiText as="p" tone="muted">{{ t('gettingStarted.vite.then') }}</BankaiText>
        <CodeBlock language="vue" :code="viteUsage" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('gettingStarted.nuxt.heading')
        }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="gettingStarted.nuxt.intro" tag="span" scope="global">
            <template #tag><BankaiCode>&lt;Bankai*&gt;</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="ts" :code="nuxtSetup" />
        <CodeBlock language="vue" :code="nuxtUsage" />
        <BankaiText as="h3" size="lg" weight="semibold">{{
          t('gettingStarted.nuxt.optionsHeading')
        }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="gettingStarted.nuxt.optionsIntro" tag="span" scope="global">
            <template #bankai><BankaiCode>bankai</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="ts" :code="nuxtOptions" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('gettingStarted.theme.heading')
        }}</BankaiText>
        <BankaiText as="p" tone="muted">{{ t('gettingStarted.theme.intro') }}</BankaiText>
        <ul class="doc-list">
          <li>
            <i18n-t keypath="gettingStarted.theme.bankai" tag="span" scope="global">
              <template #pkg><BankaiCode>@bankai-vue/theme-bankai</BankaiCode></template>
              <template #vars><BankaiCode>--bankai-*</BankaiCode></template>
            </i18n-t>
          </li>
          <li>
            <i18n-t keypath="gettingStarted.theme.tailwind" tag="span" scope="global">
              <template #pkg><BankaiCode>@bankai-vue/theme-tailwind</BankaiCode></template>
            </i18n-t>
          </li>
        </ul>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="gettingStarted.theme.override" tag="span" scope="global">
            <template #where><BankaiCode>:where()</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('gettingStarted.config.heading')
        }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="gettingStarted.config.intro" tag="span" scope="global">
            <template #createBankai><BankaiCode>createBankai()</BankaiCode></template>
            <template #bankaiConfig><BankaiCode>bankai.config</BankaiCode></template>
            <template #useBankaiConfig><BankaiCode>useBankaiConfig()</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="ts" :code="configExample" />
        <PropsTable :rows="configOptions" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('gettingStarted.next.heading')
        }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="gettingStarted.next.body" tag="span" scope="global">
            <template #components>
              <NuxtLinkLocale to="/components" class="doc-link">
                {{ t('gettingStarted.next.componentsLink') }}
              </NuxtLinkLocale>
            </template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
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
</style>
