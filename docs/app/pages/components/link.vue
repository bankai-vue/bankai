<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiLink · bankai-vue' });
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiLink</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.link.lede" tag="span" scope="global">
          <template #a><BankaiCode>&lt;a&gt;</BankaiCode></template>
          <template #routerLink><BankaiCode>RouterLink</BankaiCode></template>
          <template #nuxtLink><BankaiCode>NuxtLink</BankaiCode></template>
          <template #to><BankaiCode>to</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.example') }}</BankaiText>
        <div class="demo">
          <BankaiFlex direction="column" align="start" gap="3">
            <BankaiLink to="/components">{{ t('comp.link.demoInternalLabel') }}</BankaiLink>
            <BankaiLink href="https://github.com/bankai-vue/bankai" target="_blank">
              {{ t('comp.link.demoExternalLabel') }}
            </BankaiLink>
          </BankaiFlex>
        </div>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('comp.link.routerHeading') }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="comp.link.routerBody" tag="span" scope="global">
            <template #nuxtLink><BankaiCode>NuxtLink</BankaiCode></template>
            <template #routerLink><BankaiCode>RouterLink</BankaiCode></template>
            <template #a><BankaiCode>&lt;a&gt;</BankaiCode></template>
            <template #linkComponent><BankaiCode>config.link.component</BankaiCode></template>
            <template #to><BankaiCode>to</BankaiCode></template>
            <template #types><BankaiCode>@bankai-vue/core/vue-router</BankaiCode></template>
            <template #typesKey><BankaiCode>types</BankaiCode></template>
            <template #targetBlank><BankaiCode>target="_blank"</BankaiCode></template>
            <template #rel><BankaiCode>rel="noopener noreferrer"</BankaiCode></template>
            <template #linkNoopener><BankaiCode>config.link.noopener</BankaiCode></template>
            <template #href><BankaiCode>href</BankaiCode></template>
            <template #external><BankaiCode>data-bankai-external</BankaiCode></template>
            <template #linkOrigin><BankaiCode>config.link.origin</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiLink" />
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
