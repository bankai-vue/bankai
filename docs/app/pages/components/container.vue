<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiContainer · bankai-vue' });

// The max-width is shrunk on the demo wrappers (a plain declaration beats the theme's zero-specificity
// token) so the centered container's side bars are visible in a narrow doc column.
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiContainer</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.container.lede" tag="span" scope="global">
          <template #fluid><BankaiCode>fluid</BankaiCode></template>
          <template #main><BankaiCode>&lt;main&gt;</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.example') }}</BankaiText>
        <div class="demo">
          <BankaiText size="sm" tone="muted">{{ t('comp.container.demoDefaultLabel') }}</BankaiText>
          <div class="bounds">
            <BankaiContainer class="box">centered</BankaiContainer>
          </div>

          <BankaiText size="sm" tone="muted">{{ t('comp.container.demoFluidLabel') }}</BankaiText>
          <div class="bounds">
            <BankaiContainer fluid class="box">fluid</BankaiContainer>
          </div>
        </div>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('comp.container.responsiveHeading')
        }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.container.responsiveBody" tag="span" scope="global">
            <template #maxInlineSize><BankaiCode>max-inline-size</BankaiCode></template>
            <template #marginInline><BankaiCode>margin-inline: auto</BankaiCode></template>
            <template #collapses
              ><strong>{{ t('comp.container.responsiveCollapses') }}</strong></template
            >
            <template #fluid><BankaiCode>fluid</BankaiCode></template>
            <template #evenWhen
              ><em>{{ t('comp.container.responsiveEvenWhen') }}</em></template
            >
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiContainer" />
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

/* Marks the available width the container lays out within, and shrinks the cap so the centered box
   shows its bars in the narrow doc column. */
.bounds {
  --bankai-container-max-width: 18rem;
  outline: 1px dashed var(--bankai-color-border, currentColor);
}

.box {
  padding-block: 0.75rem;
  text-align: center;
  border-radius: 0.5rem;
  background: color-mix(in oklch, currentcolor 10%, transparent);
}
</style>
