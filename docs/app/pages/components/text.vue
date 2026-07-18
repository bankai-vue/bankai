<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiText · bankai-vue' });
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiText</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.text.lede" tag="span" scope="global">
          <template #as><BankaiCode>as</BankaiCode></template>
          <template #code><BankaiCode>code</BankaiCode></template>
          <template #kbd><BankaiCode>kbd</BankaiCode></template>
          <template #mark><BankaiCode>mark</BankaiCode></template>
          <template #size><BankaiCode>size</BankaiCode></template>
          <template #weight><BankaiCode>weight</BankaiCode></template>
          <template #tone><BankaiCode>tone</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.example') }}</BankaiText>
        <div class="demo">
          <BankaiFlex direction="column" gap="3">
            <BankaiText size="2xl" weight="bold">Heading (2xl / bold)</BankaiText>
            <BankaiText size="md">Body text at the default weight.</BankaiText>
            <BankaiText size="sm" tone="muted">Muted small print.</BankaiText>
            <BankaiText size="sm" tone="subtle">Subtle small print.</BankaiText>
            <BankaiText>
              Inline semantics: press <BankaiText as="kbd">⌘K</BankaiText> to
              <BankaiText as="mark">highlight</BankaiText> some
              <BankaiText as="code">code</BankaiText>.
            </BankaiText>
          </BankaiFlex>
        </div>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiText" />
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
.demo {
  padding: 1.5rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}
</style>
