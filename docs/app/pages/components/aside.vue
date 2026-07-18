<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiAside · bankai-vue' });

// BankaiAside renders a native <aside> complementary region and the theme paints the side-rail look.
// Its one prop, `label`, sets aria-label — the interesting content is WHY (multiple complementary
// landmarks need names) and the "don't nest in BankaiLayout's #sidebar" caveat.

// Rendered as text (not live) so the page does not emit an extra complementary landmark inside the
// docs shell.
const usage = `<!-- a shell built WITHOUT BankaiLayout -->
<div class="shell">
  <BankaiAside label="Secondary navigation">
    <BankaiSidebar />
  </BankaiAside>
  <main>…</main>
</div>`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiAside</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.aside.lede" tag="span" scope="global">
          <template #aside><BankaiCode>&lt;aside&gt;</BankaiCode></template>
          <template #complementary><BankaiCode>complementary</BankaiCode></template>
          <template #without
            ><em>{{ t('comp.aside.ledeWithout') }}</em></template
          >
          <template #bankaiLayout><BankaiCode>BankaiLayout</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.usage') }}</BankaiText>
        <CodeBlock language="html" :code="usage" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('comp.aside.namingHeading') }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.aside.namingBody" tag="span" scope="global">
            <template #complementary><BankaiCode>complementary</BankaiCode></template>
            <template #label><BankaiCode>label</BankaiCode></template>
            <template #ariaLabel><BankaiCode>aria-label</BankaiCode></template>
            <template #ex1><BankaiCode>"Secondary navigation"</BankaiCode></template>
            <template #ex2><BankaiCode>"Filters"</BankaiCode></template>
            <template #ariaLabel2><BankaiCode>aria-label</BankaiCode></template>
            <template #ariaLabelledby><BankaiCode>aria-labelledby</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.landmarkUniqueness') }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.aside.uniquenessBody" tag="span" scope="global">
            <template #not
              ><strong>{{ t('comp.aside.uniquenessNot') }}</strong></template
            >
            <template #bankaiLayout><BankaiCode>BankaiLayout</BankaiCode></template>
            <template #sidebar><BankaiCode>#sidebar</BankaiCode></template>
            <template #bankaiLayout2><BankaiCode>BankaiLayout</BankaiCode></template>
            <template #aside><BankaiCode>&lt;aside&gt;</BankaiCode></template>
            <template #bankaiAside><BankaiCode>BankaiAside</BankaiCode></template>
            <template #aside2><BankaiCode>&lt;aside&gt;</BankaiCode></template>
            <template #aside3><BankaiCode>&lt;aside&gt;</BankaiCode></template>
            <template #bankaiLayout3><BankaiCode>BankaiLayout</BankaiCode></template>
            <template #sidebar2><BankaiCode>#sidebar</BankaiCode></template>
            <template #bankaiAside2><BankaiCode>BankaiAside</BankaiCode></template>
            <template #where><BankaiCode>:where()</BankaiCode></template>
            <template #important><BankaiCode>!important</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiAside" />
    </BankaiFlex>
  </BankaiPage>
</template>
