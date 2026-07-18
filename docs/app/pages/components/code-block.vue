<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiCodeBlock · bankai-vue' });

// Live demo snippets.
const installExample = `pnpm add @bankai-vue/core @bankai-vue/theme-bankai`;

const usageExample = `<template>
  <BankaiCodeBlock language="ts" :code="snippet" />
</template>`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiCodeBlock</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.codeBlock.lede" tag="span" scope="global">
          <template #preCode><BankaiCode>&lt;pre&gt;&lt;code&gt;</BankaiCode></template>
          <template #code><BankaiCode>BankaiCode</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.example') }}</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.codeBlock.exampleBody" tag="span" scope="global">
            <template #code><BankaiCode>code</BankaiCode></template>
            <template #copy><BankaiCode>Copy</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <BankaiCodeBlock language="bash" :code="installExample" />
        <BankaiCodeBlock language="vue" :code="usageExample" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('comp.codeBlock.byoHeading')
        }}</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.codeBlock.byoBody" tag="span" scope="global">
            <template #language><BankaiCode>language</BankaiCode></template>
            <template #langClass><BankaiCode>language-&lt;lang&gt;</BankaiCode></template>
            <template #code><BankaiCode>&lt;code&gt;</BankaiCode></template>
            <template #codeProp><BankaiCode>code</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('comp.codeBlock.a11yHeading')
        }}</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.codeBlock.a11yBody1" tag="span" scope="global">
            <template #bankaiButton><BankaiCode>BankaiButton</BankaiCode></template>
            <template #status><BankaiCode>role="status"</BankaiCode></template>
            <template #copyLabel><BankaiCode>copyLabel</BankaiCode></template>
            <template #copiedLabel><BankaiCode>copiedLabel</BankaiCode></template>
            <template #copySlot><BankaiCode>copy</BankaiCode></template>
            <template #copied><BankaiCode>copied</BankaiCode></template>
            <template #copyableFalse><BankaiCode>:copyable="false"</BankaiCode></template>
            <template #copiedDuration><BankaiCode>copiedDuration</BankaiCode></template>
            <template #config
              ><BankaiCode>BankaiConfig.codeBlockCopiedDuration</BankaiCode></template
            >
            <template #default><BankaiCode>2000</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.codeBlock.a11yBody2" tag="span" scope="global">
            <template #appWide
              ><em>{{ t('comp.codeBlock.a11yAppWide') }}</em></template
            >
            <template #guideLink>
              <BankaiLink to="/guide/i18n" class="doc-link">
                {{ t('comp.codeBlock.a11yGuideLink') }}
              </BankaiLink>
            </template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiCodeBlock" />
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
.doc-link {
  color: inherit;
}
</style>
