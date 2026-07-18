<script setup lang="ts">
import { computed } from 'vue';
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiCodeBlock · bankai-vue' });

// Live demo snippets.
const installExample = `pnpm add @bankai-vue/core @bankai-vue/theme-bankai`;

const usageExample = `<template>
  <BankaiCodeBlock language="ts" :code="snippet" />
</template>`;

// The theme tokens, documented so a consumer knows what to override (each is a `:where(:root)` custom
// property, so a single plain declaration overrides one — no selector, no `!important`).
interface TokenRow {
  token: string;
  purpose: string;
}

const tokens = computed<TokenRow[]>(() => [
  {
    token: '--bankai-code-block-bg',
    purpose: t('comp.codeBlock.tokens.bg'),
  },
  {
    token: '--bankai-code-block-font-family',
    purpose: t('comp.codeBlock.tokens.fontFamily'),
  },
  {
    token: '--bankai-code-block-font-size',
    purpose: t('comp.codeBlock.tokens.fontSize'),
  },
  {
    token: '--bankai-code-block-line-height',
    purpose: t('comp.codeBlock.tokens.lineHeight'),
  },
  {
    token: '--bankai-code-block-radius',
    purpose: t('comp.codeBlock.tokens.radius'),
  },
  {
    token: '--bankai-code-block-padding-block',
    purpose: t('comp.codeBlock.tokens.paddingBlock'),
  },
  {
    token: '--bankai-code-block-padding-inline',
    purpose: t('comp.codeBlock.tokens.paddingInline'),
  },
  {
    token: '--bankai-code-block-copy-offset',
    purpose: t('comp.codeBlock.tokens.copyOffset'),
  },
]);
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiCodeBlock</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.codeBlock.lede" tag="span" scope="global">
          <template #preCode><BankaiCode>&lt;pre&gt;&lt;code&gt;</BankaiCode></template>
          <template #code><BankaiCode>BankaiCode</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.example') }}</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.codeBlock.exampleBody" tag="span" scope="global">
            <template #code><BankaiCode>code</BankaiCode></template>
            <template #copy><BankaiCode>Copy</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <BankaiCodeBlock language="bash" :code="installExample" />
        <BankaiCodeBlock language="vue" :code="usageExample" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('comp.codeBlock.byoHeading')
        }}</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.codeBlock.byoBody" tag="span" scope="global">
            <template #language><BankaiCode>language</BankaiCode></template>
            <template #langClass><BankaiCode>language-&lt;lang&gt;</BankaiCode></template>
            <template #code><BankaiCode>&lt;code&gt;</BankaiCode></template>
            <template #codeProp><BankaiCode>code</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('comp.codeBlock.a11yHeading')
        }}</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.codeBlock.a11yBody1" tag="span" scope="global">
            <template #bankaiButton><BankaiCode>BankaiButton</BankaiCode></template>
            <template #status><BankaiCode>role="status"</BankaiCode></template>
            <template #copyLabel><BankaiCode>copyLabel</BankaiCode></template>
            <template #copiedLabel><BankaiCode>copiedLabel</BankaiCode></template>
            <template #copySlot><BankaiCode>copy</BankaiCode></template>
            <template #copied><BankaiCode>copied</BankaiCode></template>
            <template #copyableFalse><BankaiCode>:copyable="false"</BankaiCode></template>
            <template #copiedDuration><BankaiCode>copiedDuration</BankaiCode></template>
            <template #config
              ><BankaiCode>BankaiConfig.codeBlockCopiedDuration</BankaiCode></template
            >
            <template #default><BankaiCode>2000</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.codeBlock.a11yBody2" tag="span" scope="global">
            <template #appWide
              ><em>{{ t('comp.codeBlock.a11yAppWide') }}</em></template
            >
            <template #guideLink>
              <BankaiLink to="/guide/i18n" class="doc-link">
                {{ t('comp.codeBlock.a11yGuideLink') }}
              </BankaiLink>
            </template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiCodeBlock" />

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.theming') }}</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          <i18n-t keypath="comp.codeBlock.themingBody" tag="span" scope="global">
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
.doc-link {
  color: inherit;
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
