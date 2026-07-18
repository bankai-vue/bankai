<script setup lang="ts">
import { componentNav } from '../../utils/docs';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
// Function form so the title re-evaluates when the locale switches.
useHead(() => ({ title: t('pages.components.title') }));
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="8">
      <BankaiText as="h1" size="2xl" weight="black">{{ t('componentsIndex.heading') }}</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        {{ t('componentsIndex.lede') }}
      </BankaiText>

      <BankaiGrid columns="2" gap="8" class="component-grid">
        <NuxtLinkLocale v-for="item in componentNav" :key="item.to" :to="item.to" class="card">
          <BankaiText as="h2" size="md" weight="semibold">Bankai{{ item.name }}</BankaiText>
          <BankaiText as="p" size="sm" tone="muted">
            {{ t(`components.${item.key}.tagline`) }}
          </BankaiText>
        </NuxtLinkLocale>
      </BankaiGrid>
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
.component-grid {
  margin-top: 1rem;
}

.card {
  display: block;
  padding: 1rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.card:hover {
  background: color-mix(in oklch, currentcolor 6%, transparent);
}
</style>
