<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiMain · bankai-vue' });

// BankaiMain renders a native <main> content region. It takes no props (the main landmark is unique,
// so there is no accessible-name prop) and paints nothing but a min-inline-size floor — the interesting
// content is WHY (landmark uniqueness, the overflow-floor, why no padding/background).

// Rendered as text (not live) so the page does not emit a second <main> inside the docs shell — the
// main landmark must be unique per document.
const usage = `<!-- a shell built WITHOUT BankaiLayout -->
<BankaiHeader>…</BankaiHeader>
<BankaiMain>
  <BankaiContainer>… page content …</BankaiContainer>
</BankaiMain>
<BankaiFooter>…</BankaiFooter>`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiMain</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.main.lede" tag="span" scope="global">
          <template #main><BankaiCode>&lt;main&gt;</BankaiCode></template>
          <template #mainRole><BankaiCode>main</BankaiCode></template>
          <template #without
            ><em>{{ t('comp.main.ledeWithout') }}</em></template
          >
          <template #bankaiLayout><BankaiCode>BankaiLayout</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.usage') }}</BankaiText>
        <CodeBlock language="html" :code="usage" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('comp.main.oneHeading') }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.main.oneBody" tag="span" scope="global">
            <template #mainRole><BankaiCode>main</BankaiCode></template>
            <template #unique
              ><strong>{{ t('comp.main.oneUnique') }}</strong></template
            >
            <template #main><BankaiCode>&lt;main&gt;</BankaiCode></template>
            <template #bankaiMain><BankaiCode>BankaiMain</BankaiCode></template>
            <template #bankaiAside><BankaiCode>BankaiAside</BankaiCode></template>
            <template #not
              ><strong>{{ t('comp.main.oneNot') }}</strong></template
            >
            <template #bankaiLayout><BankaiCode>BankaiLayout</BankaiCode></template>
            <template #main2><BankaiCode>&lt;main&gt;</BankaiCode></template>
            <template #bankaiMain2><BankaiCode>BankaiMain</BankaiCode></template>
            <template #main3><BankaiCode>&lt;main&gt;</BankaiCode></template>
            <template #main4><BankaiCode>&lt;main&gt;</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('comp.main.paintsHeading') }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.main.paintsBody" tag="span" scope="global">
            <template #is
              ><em>{{ t('comp.main.paintsIs') }}</em></template
            >
            <template #bankaiContainer><BankaiCode>BankaiContainer</BankaiCode></template>
            <template #minInlineSize><BankaiCode>min-inline-size: 0</BankaiCode></template>
            <template #pre><BankaiCode>&lt;pre&gt;</BankaiCode></template>
            <template #zero><BankaiCode>0</BankaiCode></template>
            <template #where><BankaiCode>:where()</BankaiCode></template>
            <template #important><BankaiCode>!important</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiMain" />
    </BankaiFlex>
  </BankaiPage>
</template>
