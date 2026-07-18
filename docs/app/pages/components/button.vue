<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiButton · bankai-vue' });
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiButton</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.button.lede" tag="span" scope="global">
          <template #button><BankaiCode>&lt;button&gt;</BankaiCode></template>
          <template #cls><BankaiCode>bankai-button</BankaiCode></template>
          <template #state><BankaiCode>data-bankai-*</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.example') }}</BankaiText>
        <div class="demo">
          <BankaiFlex align="center" gap="4" wrap="wrap">
            <BankaiButton variant="solid">Solid</BankaiButton>
            <BankaiButton variant="outline">Outline</BankaiButton>
            <BankaiButton variant="ghost">Ghost</BankaiButton>
          </BankaiFlex>
          <BankaiFlex align="center" gap="4" wrap="wrap">
            <BankaiButton size="sm">Small</BankaiButton>
            <BankaiButton size="md">Medium</BankaiButton>
            <BankaiButton size="lg">Large</BankaiButton>
            <BankaiButton disabled>Disabled</BankaiButton>
          </BankaiFlex>
        </div>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiButton" />
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}
</style>
