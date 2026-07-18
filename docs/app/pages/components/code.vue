<script setup lang="ts">
import { computed } from 'vue';
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiCode · bankai-vue' });

// The theme tokens, documented so a consumer knows what to override (each is a `:where(:root)` custom
// property, so a single plain declaration overrides one — no selector, no `!important`). Purposes are
// localized, so this is a computed that re-evaluates when the locale switches.
interface TokenRow {
  token: string;
  purpose: string;
}

const tokens = computed<TokenRow[]>(() => [
  {
    token: '--bankai-code-font-family',
    purpose: t('comp.code.tokens.fontFamily'),
  },
  {
    token: '--bankai-code-bg',
    purpose: t('comp.code.tokens.bg'),
  },
  {
    token: '--bankai-code-radius',
    purpose: t('comp.code.tokens.radius'),
  },
  {
    token: '--bankai-code-font-size',
    purpose: t('comp.code.tokens.fontSize'),
  },
  {
    token: '--bankai-code-padding-block',
    purpose: t('comp.code.tokens.paddingBlock'),
  },
  {
    token: '--bankai-code-padding-inline',
    purpose: t('comp.code.tokens.paddingInline'),
  },
  {
    token: '--bankai-font-mono',
    purpose: t('comp.code.tokens.fontMono'),
  },
]);
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

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.theming') }}</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.code.themingBody" tag="span" scope="global">
            <template #where><BankaiCode>:where()</BankaiCode></template>
            <template #important><BankaiCode>!important</BankaiCode></template>
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
