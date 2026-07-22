<script setup lang="ts">
import { ref } from 'vue';
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiInputNumber · bankai-vue' });

const value = ref<number | undefined>(3);
const stacked = ref<number | undefined>(7);
const split = ref<number | undefined>(7);
const sizes = ['sm', 'md', 'lg'] as const;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiInputNumber</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.input-number.lede" tag="span" scope="global">
          <template #number><BankaiCode>type="number"</BankaiCode></template>
          <template #input><BankaiCode>&lt;input&gt;</BankaiCode></template>
          <template #model><BankaiCode>v-model</BankaiCode></template>
          <template #min><BankaiCode>min</BankaiCode></template>
          <template #max><BankaiCode>max</BankaiCode></template>
          <template #step><BankaiCode>step</BankaiCode></template>
          <template #buttons><BankaiCode>buttons</BankaiCode></template>
          <template #stepUp><BankaiCode>stepUp()</BankaiCode></template>
          <template #stepDown><BankaiCode>stepDown()</BankaiCode></template>
          <template #cls><BankaiCode>bankai-input</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.example') }}</BankaiText>
        <div class="demo">
          <div class="field">
            <BankaiInputNumber v-model="value" :min="0" :max="10" buttons placeholder="0–10" />
            <BankaiText as="p" size="sm" tone="muted">
              {{ t('comp.input-number.modelLabel') }}:
              {{ value === undefined ? t('comp.input-number.empty') : value }}
            </BankaiText>
          </div>

          <div class="field">
            <BankaiInputNumber v-for="size in sizes" :key="size" :size="size" :model-value="42" />
          </div>
        </div>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">
          {{ t('comp.input-number.buttonsHeading') }}
        </BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="comp.input-number.buttonsBody" tag="span" scope="global">
            <template #buttons><BankaiCode>buttons</BankaiCode></template>
            <template #stacked><BankaiCode>"stacked"</BankaiCode></template>
            <template #split><BankaiCode>"split"</BankaiCode></template>
            <template #minus><BankaiCode>−</BankaiCode></template>
            <template #plus><BankaiCode>+</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <div class="demo">
          <div class="field">
            <BankaiInputNumber v-model="stacked" buttons="stacked" />
            <BankaiInputNumber v-model="split" buttons="split" />
          </div>
        </div>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">
          {{ t('comp.input-number.stepsHeading') }}
        </BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="comp.input-number.stepsBody" tag="span" scope="global">
            <template #step><BankaiCode>step</BankaiCode></template>
            <template #min><BankaiCode>min</BankaiCode></template>
            <template #max><BankaiCode>max</BankaiCode></template>
            <template #undef><BankaiCode>undefined</BankaiCode></template>
            <template #zero><BankaiCode>0</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">
          {{ t('comp.input-number.inputmodeHeading') }}
        </BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="comp.input-number.inputmodeBody" tag="span" scope="global">
            <template #inputmode><BankaiCode>inputmode</BankaiCode></template>
            <template #step><BankaiCode>step</BankaiCode></template>
            <template #numeric><BankaiCode>"numeric"</BankaiCode></template>
            <template #decimal><BankaiCode>"decimal"</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <div class="demo">
          <div class="field">
            <BankaiInputNumber :model-value="1" placeholder="integer step → numeric" />
            <BankaiInputNumber
              :model-value="1.5"
              :step="0.5"
              placeholder="fractional step → decimal"
            />
            <BankaiInputNumber
              :model-value="1"
              inputmode="decimal"
              placeholder="explicit decimal"
            />
          </div>
        </div>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiInputNumber" />
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
