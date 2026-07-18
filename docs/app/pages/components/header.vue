<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiHeader · bankai-vue' });

// BankaiHeader has no configuration props: it renders a native <header> banner region and the theme
// paints the house bar look. The interesting content — when it IS vs. IS NOT the banner landmark, and
// why not to nest it in BankaiLayout's #header — is prose, not a props table.

// Rendered as text (not live) so the page does not emit a second <header> banner inside the docs
// shell — landmark uniqueness is exactly the concern BankaiHeader documents.
const usage = `<!-- a shell built WITHOUT BankaiLayout -->
<BankaiHeader>
  <BankaiNavbar />
</BankaiHeader>
<main>…</main>`;

const stickyCss = `/* the header paints the page background, so a sticky bar covers content scrolling under it */
.bankai-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
}`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiHeader</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.header.lede" tag="span" scope="global">
          <template #header><BankaiCode>&lt;header&gt;</BankaiCode></template>
          <template #banner><BankaiCode>banner</BankaiCode></template>
          <template #without
            ><em>{{ t('comp.header.ledeWithout') }}</em></template
          >
          <template #bankaiLayout><BankaiCode>BankaiLayout</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.usage') }}</BankaiText>
        <CodeBlock language="html" :code="usage" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.landmarkUniqueness') }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.header.uniquenessBody1" tag="span" scope="global">
            <template #header><BankaiCode>&lt;header&gt;</BankaiCode></template>
            <template #banner><BankaiCode>banner</BankaiCode></template>
            <template #not
              ><em>{{ t('comp.header.uniquenessBody1Not') }}</em></template
            >
            <template #article><BankaiCode>&lt;article&gt;</BankaiCode></template>
            <template #aside><BankaiCode>&lt;aside&gt;</BankaiCode></template>
            <template #main><BankaiCode>&lt;main&gt;</BankaiCode></template>
            <template #nav><BankaiCode>&lt;nav&gt;</BankaiCode></template>
            <template #section><BankaiCode>&lt;section&gt;</BankaiCode></template>
            <template #bankaiHeader><BankaiCode>BankaiHeader</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.header.uniquenessBody2" tag="span" scope="global">
            <template #not
              ><strong>{{ t('comp.header.uniquenessBody2Not') }}</strong></template
            >
            <template #bankaiLayout><BankaiCode>BankaiLayout</BankaiCode></template>
            <template #headerSlot><BankaiCode>#header</BankaiCode></template>
            <template #bankaiLayout2><BankaiCode>BankaiLayout</BankaiCode></template>
            <template #header><BankaiCode>&lt;header&gt;</BankaiCode></template>
            <template #bankaiHeader><BankaiCode>BankaiHeader</BankaiCode></template>
            <template #header2><BankaiCode>&lt;header&gt;</BankaiCode></template>
            <template #header3><BankaiCode>&lt;header&gt;</BankaiCode></template>
            <template #bankaiLayout3><BankaiCode>BankaiLayout</BankaiCode></template>
            <template #headerSlot2><BankaiCode>#header</BankaiCode></template>
            <template #bankaiHeader2><BankaiCode>BankaiHeader</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('comp.header.stickyHeading')
        }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.header.stickyBody" tag="span" scope="global">
            <template #sticky><BankaiCode>position: sticky</BankaiCode></template>
            <template #where><BankaiCode>:where()</BankaiCode></template>
            <template #important><BankaiCode>!important</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="css" :code="stickyCss" />
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiHeader" />
    </BankaiFlex>
  </BankaiPage>
</template>
