<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiCode · bankai-vue' });
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiCode</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.code.lede" tag="span" scope="global">
          <template #code><BankaiCode>&lt;code&gt;</BankaiCode></template>
          <template #codeBlock><BankaiCode>BankaiCodeBlock</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.example') }}</BankaiText>
        <div class="demo">
          <BankaiText as="p">
            <i18n-t keypath="comp.code.exampleP1" tag="span" scope="global">
              <template #install><BankaiCode>pnpm add @bankai-vue/core</BankaiCode></template>
              <template #code><BankaiCode>BankaiCode</BankaiCode></template>
            </i18n-t>
          </BankaiText>
          <BankaiText as="p" size="sm" tone="muted">
            <i18n-t keypath="comp.code.exampleP2" tag="span" scope="global">
              <template #em><BankaiCode>em</BankaiCode></template>
              <template #token><BankaiCode>--bankai-code-bg</BankaiCode></template>
            </i18n-t>
          </BankaiText>
        </div>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('comp.code.semanticsHeading')
        }}</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.code.semanticsBody" tag="span" scope="global">
            <template #code><BankaiCode>&lt;code&gt;</BankaiCode></template>
            <template #as><BankaiCode>as</BankaiCode></template>
            <template #kbd><BankaiCode>&lt;kbd&gt;</BankaiCode></template>
            <template #samp><BankaiCode>&lt;samp&gt;</BankaiCode></template>
            <template #var><BankaiCode>&lt;var&gt;</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiCode" />
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}
</style>
