<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiApp · bankai-vue' });

// BankaiApp is the infra singleton at the root of the App structure. It lands thin — the interesting
// content is WHAT it does today (the embedded-mode surface), WHY it is a singleton, and WHAT is deferred.

const usage = `<!-- the outermost wrapper of an application -->
<template>
  <BankaiApp>
    <BankaiLayout>… header / main / footer …</BankaiLayout>
  </BankaiApp>
</template>`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiApp</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.app.lede" tag="span" scope="global">
          <template #div><BankaiCode>&lt;div&gt;</BankaiCode></template>
          <template #not
            ><em>{{ t('comp.app.ledeNot') }}</em></template
          >
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.usage') }}</BankaiText>
        <CodeBlock language="vue" :code="usage" />
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.app.usageBody" tag="span" scope="global">
            <template #singleton
              ><strong>{{ t('comp.app.usageSingleton') }}</strong></template
            >
            <template #nesting
              ><BankaiCode>{{ t('comp.app.usageNesting') }}</BankaiCode></template
            >
            <template #sideBySide
              ><strong>{{ t('comp.app.usageSideBySide') }}</strong></template
            >
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('comp.app.embeddedHeading') }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.app.embeddedBody" tag="span" scope="global">
            <template #surface
              ><strong>{{ t('comp.app.embeddedSurface') }}</strong></template
            >
            <template #colorScheme><BankaiCode>color-scheme</BankaiCode></template>
            <template #bg><BankaiCode>--bankai-color-bg</BankaiCode></template>
            <template #fg><BankaiCode>-fg</BankaiCode></template>
            <template #own
              ><em>{{ t('comp.app.embeddedOwn') }}</em></template
            >
            <template #without
              ><strong>{{ t('comp.app.embeddedWithout') }}</strong></template
            >
            <template #html><BankaiCode>html</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <div class="app-demo">
          <BankaiApp class="app-box">
            <BankaiText size="sm">Self-contained bankai island</BankaiText>
          </BankaiApp>
        </div>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.app.override" tag="span" scope="global">
            <template #where><BankaiCode>:where()</BankaiCode></template>
            <template #important><BankaiCode>!important</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('comp.app.thinHeading') }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.app.thinBody" tag="span" scope="global">
            <template #bankaiApp><BankaiCode>BankaiApp</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiApp" />
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
/* A non-house "foreign host" surface so the embedded App's own painted surface is visible against it. */
.app-demo {
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: oklch(70% 0.03 250);
}

.app-box {
  padding: 1rem;
  border-radius: 0.375rem;
}
</style>
