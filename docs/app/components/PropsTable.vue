<script setup lang="ts">
// Interim props table → to be replaced by <BankaiSimpleTable> once it lands (ROADMAP Phase 1).
// Rows are hand-authored per page today; a source-generated table is a later step.
import type { PropRow } from '../utils/docs';
import { BankaiCode } from '@bankai-vue/core';

defineProps<{ rows: PropRow[] }>();
</script>

<template>
  <div class="props-table-wrap">
    <table class="props-table">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.name">
          <td>
            <BankaiCode>{{ row.name }}</BankaiCode>
          </td>
          <td>
            <BankaiCode>{{ row.type }}</BankaiCode>
          </td>
          <td>
            <BankaiCode v-if="row.default !== undefined">{{ row.default }}</BankaiCode>
            <span v-else>—</span>
          </td>
          <td>{{ row.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Horizontal scroll so a wide table never forces the page body to scroll sideways. */
.props-table-wrap {
  overflow-x: auto;
}

.props-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--bankai-text-size-sm, 0.875rem);
}

.props-table th,
.props-table td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--bankai-color-border, currentColor);
}

.props-table th {
  font-weight: 600;
  white-space: nowrap;
}

.props-table code {
  white-space: nowrap;
}
</style>
