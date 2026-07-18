<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiHeading · bankai-vue' });

const levels = [1, 2, 3, 4, 5, 6] as const;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiHeading :level="1">BankaiHeading</BankaiHeading>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.heading.lede" tag="span" scope="global">
          <template #h1><BankaiCode>&lt;h1&gt;</BankaiCode></template>
          <template #h6><BankaiCode>&lt;h6&gt;</BankaiCode></template>
          <template #level><BankaiCode>level</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiHeading :level="2">{{ t('comp.heading.scaleHeading') }}</BankaiHeading>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.heading.scaleBody" tag="span" scope="global">
            <template #dataLevel><BankaiCode>data-bankai-level</BankaiCode></template>
            <template #margin><BankaiCode>margin: 0</BankaiCode></template>
            <template #flex><BankaiCode>BankaiFlex</BankaiCode></template>
            <template #stack><BankaiCode>BankaiStack</BankaiCode></template>
            <template #gap><BankaiCode>gap</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <div class="demo">
          <BankaiHeading v-for="level in levels" :key="level" :level="level">
            Heading level {{ level }}
          </BankaiHeading>
        </div>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiHeading :level="2">{{ t('comp.heading.requiredHeading') }}</BankaiHeading>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.heading.requiredBody1" tag="span" scope="global">
            <template #level><BankaiCode>level</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.heading.requiredBody2" tag="span" scope="global">
            <template #h2><BankaiCode>&lt;h2&gt;</BankaiCode></template>
            <template #h1><BankaiCode>&lt;h1&gt;</BankaiCode></template>
            <template #size><BankaiCode>size</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiHeading" />
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
