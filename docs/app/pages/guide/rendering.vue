<script setup lang="ts">
const { t } = useI18n();

definePageMeta({ layout: 'docs' });
// Function form so the title re-evaluates when the locale switches.
useHead(() => ({ title: t('pages.rendering.title') }));

// Samples with `<Bankai*>` tags live here as strings so BankaiCodeBlock renders them verbatim rather
// than parsing them as HTML; the tag-free samples (tsconfig / config) render through it just the same.
const linkUsage = `<template>
  <!-- Internal: renders NuxtLink / RouterLink if a router is installed, else a plain <a href="/about">. -->
  <BankaiLink to="/about">About</BankaiLink>

  <!-- External: always a native <a>, marked data-bankai-external, with rel="noopener noreferrer". -->
  <BankaiLink href="https://example.com" target="_blank">Docs</BankaiLink>
</template>`;

const tsconfigTypes = `// tsconfig.json — type BankaiLink's \`to\` as vue-router's RouteLocationRaw
{
  "compilerOptions": {
    "types": ["@bankai-vue/core/vue-router"]
  }
}`;

const linkOriginVite = `import { createBankai } from '@bankai-vue/core';

app.use(
  createBankai({
    // Your canonical site origin — makes the external-host check accurate and
    // identical on server and client (hydration-safe) under SSR/SSG.
    linkOrigin: 'https://example.com',
  }),
);`;

const linkOriginNuxt = `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@bankai-vue/nuxt'],
  css: ['@bankai-vue/theme-bankai'],

  bankai: {
    config: { linkOrigin: 'https://example.com' },
  },
});`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">{{ t('guide.rendering.name') }}</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="renderingPage.lede" tag="span" scope="global">
          <template #bankaiLink><BankaiCode>BankaiLink</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('renderingPage.environmentsHeading')
        }}</BankaiText>
        <ul class="doc-list">
          <li>
            <i18n-t keypath="renderingPage.environmentsSpa" tag="span" scope="global">
              <template #spa
                ><strong>{{ t('renderingPage.environmentsSpaLead') }}</strong></template
              >
              <template #createBankai><BankaiCode>createBankai()</BankaiCode></template>
            </i18n-t>
          </li>
          <li>
            <i18n-t keypath="renderingPage.environmentsNuxt" tag="span" scope="global">
              <template #nuxtSsr
                ><strong>{{ t('renderingPage.environmentsNuxtLead') }}</strong></template
              >
              <template #module>
                <BankaiLink to="/guide/getting-started" class="doc-link">{{
                  t('renderingPage.environmentsNuxtModuleLink')
                }}</BankaiLink>
              </template>
              <template #perApp
                ><em>{{ t('renderingPage.environmentsNuxtPerApp') }}</em></template
              >
            </i18n-t>
          </li>
        </ul>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('renderingPage.hydrationHeading')
        }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="renderingPage.hydrationBody1" tag="span" scope="global">
            <template #useId><BankaiCode>useId</BankaiCode></template>
            <template #window><BankaiCode>window</BankaiCode></template>
            <template #document><BankaiCode>document</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="renderingPage.hydrationBody2" tag="span" scope="global">
            <template #after
              ><em>{{ t('renderingPage.hydrationAfter') }}</em></template
            >
            <template #bankaiLink><BankaiCode>BankaiLink</BankaiCode></template>
            <template #external><BankaiCode>data-bankai-external</BankaiCode></template>
            <template #linkOrigin><BankaiCode>linkOrigin</BankaiCode></template>
            <template #windowLocation><BankaiCode>window.location</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('renderingPage.routerHeading')
        }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="renderingPage.routerIntro" tag="span" scope="global">
            <template #bankaiLink><BankaiCode>BankaiLink</BankaiCode></template>
            <template #to><BankaiCode>to</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <ol class="doc-list">
          <li>
            <i18n-t keypath="renderingPage.routerItem1" tag="span" scope="global">
              <template #linkComponent><BankaiCode>linkComponent</BankaiCode></template>
              <template #bankaiConfig><BankaiCode>BankaiConfig</BankaiCode></template>
            </i18n-t>
          </li>
          <li>
            <i18n-t keypath="renderingPage.routerItem2" tag="span" scope="global">
              <template #nuxtLink><BankaiCode>NuxtLink</BankaiCode></template>
            </i18n-t>
          </li>
          <li>
            <i18n-t keypath="renderingPage.routerItem3" tag="span" scope="global">
              <template #routerLink><BankaiCode>RouterLink</BankaiCode></template>
            </i18n-t>
          </li>
          <li>
            <i18n-t keypath="renderingPage.routerItem4" tag="span" scope="global">
              <template #a><BankaiCode>&lt;a&gt;</BankaiCode></template>
            </i18n-t>
          </li>
        </ol>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="renderingPage.routerBody" tag="span" scope="global">
            <template #vueRouter><BankaiCode>vue-router</BankaiCode></template>
            <template #string><BankaiCode>string</BankaiCode></template>
            <template #to><BankaiCode>to</BankaiCode></template>
            <template #aHref><BankaiCode>&lt;a href&gt;</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="vue" :code="linkUsage" />
        <BankaiText as="h3" size="lg" weight="semibold">{{
          t('renderingPage.typesHeading')
        }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="renderingPage.typesBody" tag="span" scope="global">
            <template #to><BankaiCode>to</BankaiCode></template>
            <template #tsconfig><BankaiCode>tsconfig.json</BankaiCode></template>
            <template #routeLocationRaw><BankaiCode>RouteLocationRaw</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="jsonc" :code="tsconfigTypes" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">
          <i18n-t keypath="renderingPage.originHeading" tag="span" scope="global">
            <template #linkOrigin><BankaiCode>linkOrigin</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="renderingPage.originBody1" tag="span" scope="global">
            <template #bankaiLink><BankaiCode>BankaiLink</BankaiCode></template>
            <template #href><BankaiCode>href</BankaiCode></template>
            <template #window><BankaiCode>window</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="renderingPage.originBody2" tag="span" scope="global">
            <template #linkOrigin><BankaiCode>linkOrigin</BankaiCode></template>
            <template #windowLocation><BankaiCode>window.location</BankaiCode></template>
            <template #httpS><BankaiCode>http(s)</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="ts" :code="linkOriginVite" />
        <CodeBlock language="ts" :code="linkOriginNuxt" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.seeAlso') }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="renderingPage.seeAlsoBody" tag="span" scope="global">
            <template #gettingStarted>
              <BankaiLink to="/guide/getting-started" class="doc-link">{{
                t('renderingPage.seeAlsoGettingStarted')
              }}</BankaiLink>
            </template>
            <template #link>
              <BankaiLink to="/components/link" class="doc-link">{{
                t('renderingPage.seeAlsoLink')
              }}</BankaiLink>
            </template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
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
