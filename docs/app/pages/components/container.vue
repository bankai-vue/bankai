<script setup lang="ts">
import { computed } from 'vue';
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiContainer · bankai-vue' });

// The two theme knobs, documented so a consumer knows what to override (both are `:where(:root)` custom
// properties, so a single plain declaration retunes them — no selector, no `!important`). Purposes are
// localized, so this is a computed that re-evaluates when the locale switches.
interface TokenRow {
  token: string;
  purpose: string;
}

const tokens = computed<TokenRow[]>(() => [
  {
    token: '--bankai-container-max-width',
    purpose: t('comp.container.tokens.maxWidth'),
  },
  {
    token: '--bankai-container-gutter',
    purpose: t('comp.container.tokens.gutter'),
  },
]);

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

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('comp.container.themingHeading')
        }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.container.themingBody" tag="span" scope="global">
            <template #root><BankaiCode>:root</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <div class="tokens-wrap">
          <table class="tokens">
            <thead>
              <tr>
                <th>{{ t('table.token') }}</th>
                <th>{{ t('table.purpose') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tokens" :key="row.token">
                <td>
                  <BankaiCode>{{ row.token }}</BankaiCode>
                </td>
                <td>{{ row.purpose }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BankaiFlex>
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

.tokens-wrap {
  overflow-x: auto;
}

.tokens {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--bankai-text-size-sm, 0.875rem);
}

.tokens th,
.tokens td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--bankai-color-border, currentColor);
}

.tokens th {
  font-weight: 600;
  white-space: nowrap;
}

.tokens code {
  white-space: nowrap;
}
</style>
