<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiFooter · bankai-vue' });

// BankaiFooter renders a native <footer> contentinfo region and the theme paints the house foot look
// (the mirror of the header). Its content — when it IS vs. IS NOT the contentinfo landmark, and why not
// to nest it in BankaiLayout's #footer — is prose, not a props table.

// Rendered as text (not live) so the page does not emit a second <footer> contentinfo inside the docs
// shell — landmark uniqueness is exactly the concern BankaiFooter documents.
const usage = `<!-- a shell built WITHOUT BankaiLayout -->
<BankaiMain>…</BankaiMain>
<BankaiFooter>
  <small>© 2026 bankai-vue</small>
</BankaiFooter>`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiFooter</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.footer.lede" tag="span" scope="global">
          <template #footer><BankaiCode>&lt;footer&gt;</BankaiCode></template>
          <template #contentinfo><BankaiCode>contentinfo</BankaiCode></template>
          <template #bankaiHeader><BankaiCode>BankaiHeader</BankaiCode></template>
          <template #without
            ><em>{{ t('comp.footer.ledeWithout') }}</em></template
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
          <i18n-t keypath="comp.footer.uniquenessBody1" tag="span" scope="global">
            <template #footer><BankaiCode>&lt;footer&gt;</BankaiCode></template>
            <template #contentinfo><BankaiCode>contentinfo</BankaiCode></template>
            <template #not
              ><em>{{ t('comp.footer.uniquenessBody1Not') }}</em></template
            >
            <template #article><BankaiCode>&lt;article&gt;</BankaiCode></template>
            <template #aside><BankaiCode>&lt;aside&gt;</BankaiCode></template>
            <template #main><BankaiCode>&lt;main&gt;</BankaiCode></template>
            <template #nav><BankaiCode>&lt;nav&gt;</BankaiCode></template>
            <template #section><BankaiCode>&lt;section&gt;</BankaiCode></template>
            <template #bankaiFooter><BankaiCode>BankaiFooter</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.footer.uniquenessBody2" tag="span" scope="global">
            <template #not
              ><strong>{{ t('comp.footer.uniquenessBody2Not') }}</strong></template
            >
            <template #bankaiLayout><BankaiCode>BankaiLayout</BankaiCode></template>
            <template #footerSlot><BankaiCode>#footer</BankaiCode></template>
            <template #bankaiLayout2><BankaiCode>BankaiLayout</BankaiCode></template>
            <template #footer><BankaiCode>&lt;footer&gt;</BankaiCode></template>
            <template #bankaiFooter><BankaiCode>BankaiFooter</BankaiCode></template>
            <template #footer2><BankaiCode>&lt;footer&gt;</BankaiCode></template>
            <template #footer3><BankaiCode>&lt;footer&gt;</BankaiCode></template>
            <template #bankaiLayout3><BankaiCode>BankaiLayout</BankaiCode></template>
            <template #footerSlot2><BankaiCode>#footer</BankaiCode></template>
            <template #bankaiFooter2><BankaiCode>BankaiFooter</BankaiCode></template>
            <template #where><BankaiCode>:where()</BankaiCode></template>
            <template #important><BankaiCode>!important</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiFooter" />
    </BankaiFlex>
  </BankaiPage>
</template>
