<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiFlex · bankai-vue' });
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiFlex</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.flex.lede" tag="span" scope="global">
          <template #data><BankaiCode>data-bankai-*</BankaiCode></template>
          <template #gap><BankaiCode>gap</BankaiCode></template>
          <template #where><BankaiCode>:where()</BankaiCode></template>
          <template #important><BankaiCode>!important</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.example') }}</BankaiText>
        <div class="demo">
          <BankaiText size="sm" tone="muted">justify="between" · gap="4"</BankaiText>
          <BankaiFlex justify="between" gap="4">
            <span class="box">1</span>
            <span class="box">2</span>
            <span class="box">3</span>
          </BankaiFlex>

          <BankaiText size="sm" tone="muted">direction="column" · gap="2"</BankaiText>
          <BankaiFlex direction="column" gap="2">
            <span class="box">1</span>
            <span class="box">2</span>
          </BankaiFlex>
        </div>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiFlex" />
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

.box {
  display: grid;
  place-items: center;
  min-width: 3rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: color-mix(in oklch, currentcolor 10%, transparent);
}
</style>
