<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiIcon · bankai-vue' });

// The three input styles as source, so the docs show `class`/`name` usage even though the docs site
// ships no icon set (the live demo below uses inline SVGs, which need no dependency).
const usageExample = `<!-- 1) default slot: an inline <svg> (or any icon component) -->
<BankaiIcon label="Home">
  <svg viewBox="0 0 24 24"><path d="M12 3 3 10v11h6v-6h6v6h6V10z" /></svg>
</BankaiIcon>

<!-- 2) class: a CSS icon class straight through (UnoCSS, Iconify-CSS, a font set) -->
<BankaiIcon class="i-mdi-home" label="Home" />

<!-- 3) name: the same, but through the optional config.icon.class resolver -->
<BankaiIcon name="i-mdi-home" label="Home" />`;

const iconSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiIcon</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.icon.lede" tag="span" scope="global">
          <template #currentColor><BankaiCode>currentColor</BankaiCode></template>
          <template #svg><BankaiCode>&lt;svg&gt;</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.example') }}</BankaiText>
        <div class="demo">
          <BankaiFlex direction="column" gap="6">
            <BankaiFlex align="center" gap="4">
              <BankaiIcon
                v-for="size in iconSizes"
                :key="size"
                :size="size"
                :label="`home ${size}`"
              >
                <svg viewBox="0 0 24 24"><path d="M12 3 3 10v11h6v-6h6v6h6V10z" /></svg>
              </BankaiIcon>
            </BankaiFlex>
            <BankaiFlex align="center" gap="4">
              <BankaiIcon size="xl" label="wide, square" class="demo-boxed">
                <svg viewBox="0 0 48 24"><rect x="2" y="2" width="44" height="20" rx="3" /></svg>
              </BankaiIcon>
              <BankaiIcon size="xl" no-square label="wide, intrinsic" class="demo-boxed">
                <svg viewBox="0 0 48 24"><rect x="2" y="2" width="44" height="20" rx="3" /></svg>
              </BankaiIcon>
            </BankaiFlex>
          </BankaiFlex>
        </div>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="4">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('comp.icon.stylesHeading') }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="comp.icon.stylesBody" tag="span" scope="global">
            <template #svg><BankaiCode>&lt;svg&gt;</BankaiCode></template>
            <template #slot><BankaiCode>slot</BankaiCode></template>
            <template #classAttr><BankaiCode>class</BankaiCode></template>
            <template #nameProp><BankaiCode>name</BankaiCode></template>
            <template #iconClass><BankaiCode>config.icon.class</BankaiCode></template>
            <template #token><BankaiCode>mdi:home</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="html" :code="usageExample" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="4">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('comp.icon.a11yHeading') }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="comp.icon.a11yBody" tag="span" scope="global">
            <template #ariaHidden><BankaiCode>aria-hidden</BankaiCode></template>
            <template #labelProp><BankaiCode>label</BankaiCode></template>
            <template #roleImg><BankaiCode>role="img"</BankaiCode></template>
            <template #ariaLabel><BankaiCode>aria-label</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="4">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('comp.icon.sizeHeading') }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="comp.icon.sizeBody" tag="span" scope="global">
            <template #sizeProp><BankaiCode>size</BankaiCode></template>
            <template #xs><BankaiCode>xs</BankaiCode></template>
            <template #xl><BankaiCode>xl</BankaiCode></template>
            <template #noSquare><BankaiCode>no-square</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiIcon" />
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
.demo {
  padding: 1.5rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}

.demo-boxed {
  outline: 1px dashed color-mix(in oklch, currentcolor 30%, transparent);
}
</style>
