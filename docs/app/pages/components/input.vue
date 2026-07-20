<script setup lang="ts">
import { ref } from 'vue';
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiInput · bankai-vue' });

const value = ref('');
const sizes = ['sm', 'md', 'lg'] as const;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiInput</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.input.lede" tag="span" scope="global">
          <template #input><BankaiCode>&lt;input&gt;</BankaiCode></template>
          <template #model><BankaiCode>v-model</BankaiCode></template>
          <template #cls><BankaiCode>bankai-input</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.example') }}</BankaiText>
        <div class="demo">
          <div class="field">
            <BankaiInput v-model="value" placeholder="Type here…" />
            <BankaiText as="p" size="sm" tone="muted">
              {{ t('comp.input.modelLabel') }}: {{ value || t('comp.input.empty') }}
            </BankaiText>
          </div>

          <div class="field">
            <BankaiInput
              v-for="size in sizes"
              :key="size"
              :size="size"
              :model-value="`${size} value`"
            />
          </div>

          <div class="field">
            <BankaiInput model-value="Disabled" disabled />
            <BankaiInput model-value="Read-only" readonly />
          </div>
        </div>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('comp.input.typesHeading') }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="comp.input.typesBody" tag="span" scope="global">
            <template #number><BankaiCode>type="number"</BankaiCode></template>
            <template #password><BankaiCode>type="password"</BankaiCode></template>
            <template #inputNumber><BankaiCode>BankaiInputNumber</BankaiCode></template>
            <template #inputPassword><BankaiCode>BankaiInputPassword</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('comp.input.fieldHeading') }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="comp.input.fieldBody" tag="span" scope="global">
            <template #field><BankaiCode>BankaiField</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiInput" />
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-inline-size: 24rem;
}
</style>
