<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiPage · bankai-vue' });

// BankaiPage is the per-route content host. It takes no props and paints nothing but a min-block-size
// fill — the interesting content is WHY (not a landmark, "no black magic", why it lands thin).

const usage = `<!-- every route file starts with BankaiPage -->
<template>
  <BankaiPage>
    <BankaiContainer>… route content …</BankaiContainer>
  </BankaiPage>
</template>`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiPage</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.page.lede" tag="span" scope="global">
          <template #main><BankaiCode>&lt;main&gt;</BankaiCode></template>
          <template #not
            ><em>{{ t('comp.page.ledeNot') }}</em></template
          >
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.usage') }}</BankaiText>
        <CodeBlock language="vue" :code="usage" />
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.page.usageBody" tag="span" scope="global">
            <template #page
              ><strong>{{ t('comp.page.usagePage') }}</strong></template
            >
            <template #bankaiLayout><BankaiCode>BankaiLayout</BankaiCode></template>
            <template #bankaiMain><BankaiCode>BankaiMain</BankaiCode></template>
            <template #main><BankaiCode>&lt;main&gt;</BankaiCode></template>
            <template #bankaiPage><BankaiCode>BankaiPage</BankaiCode></template>
            <template #bankaiContainer><BankaiCode>BankaiContainer</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('comp.page.fillsHeading') }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.page.fillsBody" tag="span" scope="global">
            <template #minBlockSize><BankaiCode>min-block-size</BankaiCode></template>
            <template #percent><BankaiCode>100%</BankaiCode></template>
            <template #not
              ><strong>{{ t('comp.page.fillsNot') }}</strong></template
            >
            <template #dvh><BankaiCode>100dvh</BankaiCode></template>
            <template #where><BankaiCode>:where()</BankaiCode></template>
            <template #important><BankaiCode>!important</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <div class="page-demo">
          <BankaiPage class="page-box">
            <BankaiText size="sm">A short route still fills the height above.</BankaiText>
          </BankaiPage>
        </div>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('comp.page.notLandmarkHeading')
        }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.page.notLandmarkBody" tag="span" scope="global">
            <template #bankaiPage><BankaiCode>BankaiPage</BankaiCode></template>
            <template #div><BankaiCode>&lt;div&gt;</BankaiCode></template>
            <template #main><BankaiCode>&lt;main&gt;</BankaiCode></template>
            <template #no
              ><strong>{{ t('comp.page.notLandmarkNo') }}</strong></template
            >
            <template #bankaiHeading><BankaiCode>BankaiHeading</BankaiCode></template>
            <template #level><BankaiCode>level</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiPage" />
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
/* Bound the live demo with a definite block size so the min-block-size fill is observable. */
.page-demo {
  block-size: 10rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  outline: 1px dashed color-mix(in oklch, currentcolor 30%, transparent);
}

.page-box {
  padding: 0.75rem;
  border-radius: 0.375rem;
  outline: 2px solid color-mix(in oklch, currentcolor 20%, transparent);
}
</style>
