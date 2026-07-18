<script setup lang="ts">
// Renders a component's Props / Slots / Events tables from the generated manifest
// (docs/app/utils/component-meta.generated.ts → `pnpm docs:meta`), so the API docs track the source
// SFC's props, defaults, JSDoc, and slots automatically. Props reuse PropsTable; a section is omitted
// when the component has none.
import type { ComponentMeta } from '../utils/component-meta.generated';

const { t } = useI18n();

defineProps<{ meta: ComponentMeta }>();
</script>

<template>
  <BankaiFlex v-if="meta.props.length" as="section" direction="column" gap="8">
    <BankaiText as="h2" size="xl" weight="bold">{{ t('api.props') }}</BankaiText>
    <PropsTable :rows="meta.props" />
  </BankaiFlex>

  <BankaiFlex v-if="meta.slots.length" as="section" direction="column" gap="8">
    <BankaiText as="h2" size="xl" weight="bold">{{ t('api.slots') }}</BankaiText>
    <div class="api-table-wrap">
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
              <BankaiCode>{{ slot.name }}</BankaiCode>
            </td>
            <td>{{ slot.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </BankaiFlex>

  <BankaiFlex v-if="meta.events.length" as="section" direction="column" gap="8">
    <BankaiText as="h2" size="xl" weight="bold">{{ t('api.events') }}</BankaiText>
    <div class="api-table-wrap">
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
              <BankaiCode>{{ event.name }}</BankaiCode>
            </td>
            <td>
              <BankaiCode>{{ event.type }}</BankaiCode>
            </td>
            <td>{{ event.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </BankaiFlex>
</template>

<style scoped>
/* Matches PropsTable so the Slots/Events tables read identically. Horizontal scroll so a wide table
   never forces the page body to scroll sideways. */
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
