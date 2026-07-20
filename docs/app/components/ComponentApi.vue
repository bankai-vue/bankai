<script setup lang="ts">
// Renders a component's full public API — Props / Emits / Slots / Exposes / Theming — from the generated
// manifest (docs/app/utils/component-meta.generated.ts → `pnpm docs:meta`), so the docs track the source
// SFC's props, defaults, JSDoc, slots, exposes, and the house theme's CSS token surface automatically.
// Every section always renders: when a component has nothing for one, it says so explicitly rather than
// hiding the section, so a reader can tell "no slots" from "docs forgot the slots".
//
// Theming rows (token name + default value) are generated per theme; the token *purpose* is localized and
// looked up by token name (theme-independent, like a prop description). `activeTheme` is fixed to the house
// theme today; it becomes reactive once the docs grow a theme switcher.
import type { ComponentMeta } from '../utils/component-meta.generated';

const { t } = useI18n();

defineProps<{ meta: ComponentMeta }>();

const activeTheme = 'bankai' as const;
</script>

<template>
  <!-- Props -->
  <BankaiFlex as="section" direction="column" gap="8">
    <BankaiText as="h2" size="xl" weight="bold">{{ t('api.props') }}</BankaiText>
    <PropsTable v-if="meta.props.length" :rows="meta.props" />
    <BankaiText v-else as="p" size="sm" tone="muted">{{ t('api.emptyProps') }}</BankaiText>
  </BankaiFlex>

  <!-- Emits -->
  <BankaiFlex as="section" direction="column" gap="8">
    <BankaiText as="h2" size="xl" weight="bold">{{ t('api.emits') }}</BankaiText>
    <div v-if="meta.events.length" class="api-table-wrap">
      <table class="api-table">
        <thead>
          <tr>
            <th>{{ t('table.event') }}</th>
            <th>{{ t('table.type') }}</th>
            <th>{{ t('table.description') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in meta.events" :key="event.name">
            <td>
              <!-- Prefixed with `@` — the Emits table documents the template listener you write. -->
              <BankaiCode>@{{ event.name }}</BankaiCode>
            </td>
            <td>
              <BankaiCode>{{ event.type }}</BankaiCode>
            </td>
            <td>{{ event.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <BankaiText v-else as="p" size="sm" tone="muted">{{ t('api.emptyEmits') }}</BankaiText>
  </BankaiFlex>

  <!-- Slots -->
  <BankaiFlex as="section" direction="column" gap="8">
    <BankaiText as="h2" size="xl" weight="bold">{{ t('api.slots') }}</BankaiText>
    <div v-if="meta.slots.length" class="api-table-wrap">
      <table class="api-table">
        <thead>
          <tr>
            <th>{{ t('table.slot') }}</th>
            <th>{{ t('table.description') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in meta.slots" :key="slot.name">
            <td>
              <!-- Prefixed with `#` — the Slots table documents the template slot you write (`v-slot`
                   shorthand). Names are shown verbatim: slots have no case conversion, so the name must
                   match the source exactly. -->
              <BankaiCode>#{{ slot.name }}</BankaiCode>
            </td>
            <td>{{ slot.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <BankaiText v-else as="p" size="sm" tone="muted">{{ t('api.emptySlots') }}</BankaiText>
  </BankaiFlex>

  <!-- Exposes -->
  <BankaiFlex as="section" direction="column" gap="8">
    <BankaiText as="h2" size="xl" weight="bold">{{ t('api.exposes') }}</BankaiText>
    <div v-if="meta.exposed.length" class="api-table-wrap">
      <table class="api-table">
        <thead>
          <tr>
            <th>{{ t('table.name') }}</th>
            <th>{{ t('table.type') }}</th>
            <th>{{ t('table.description') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="expose in meta.exposed" :key="expose.name">
            <td>
              <BankaiCode>{{ expose.name }}</BankaiCode>
            </td>
            <td>
              <BankaiCode>{{ expose.type }}</BankaiCode>
            </td>
            <td>{{ expose.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <BankaiText v-else as="p" size="sm" tone="muted">{{ t('api.emptyExposes') }}</BankaiText>
  </BankaiFlex>

  <!-- Theming -->
  <BankaiFlex as="section" direction="column" gap="8">
    <BankaiText as="h2" size="xl" weight="bold">{{ t('api.theming') }}</BankaiText>
    <template v-if="meta.theming[activeTheme].length">
      <BankaiText as="p" size="sm" tone="muted">
        <i18n-t keypath="api.themingBody" tag="span" scope="global">
          <template #root><BankaiCode>:root</BankaiCode></template>
          <template #where><BankaiCode>:where()</BankaiCode></template>
          <template #important><BankaiCode>!important</BankaiCode></template>
        </i18n-t>
      </BankaiText>
      <div class="api-table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th>{{ t('table.token') }}</th>
              <th>{{ t('table.default') }}</th>
              <th>{{ t('table.purpose') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="token in meta.theming[activeTheme]" :key="token.name">
              <td>
                <BankaiCode>{{ token.name }}</BankaiCode>
              </td>
              <td>
                <BankaiCode>{{ token.value }}</BankaiCode>
              </td>
              <td>{{ t(`theming.tokens.${token.name}`) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <BankaiText v-else as="p" size="sm" tone="muted">{{ t('api.emptyTheming') }}</BankaiText>
  </BankaiFlex>
</template>

<style scoped>
/* Matches PropsTable so the Emits/Slots/Exposes/Theming tables read identically. Horizontal scroll so a
   wide table never forces the page body to scroll sideways. */
.api-table-wrap {
  overflow-x: auto;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--bankai-text-size-sm, 0.875rem);
}

.api-table th,
.api-table td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--bankai-color-border, currentColor);
}

.api-table th {
  font-weight: 600;
  white-space: nowrap;
}

.api-table code {
  white-space: nowrap;
}
</style>
