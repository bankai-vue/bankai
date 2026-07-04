<script setup lang="ts">
import { BankaiButton } from '@bankai-vue/core';

// Deterministic fixture proving the `variant`/`size` escape hatch (LiteralUnion): a value
// outside the shipped set still reflects verbatim as `data-variant`/`data-size`, so a consumer
// can style it with their own rule against the anatomy (SPEC.md §4.4). The `<style>` below is
// that consumer rule — global (not scoped), like a real app's CSS — keyed on the custom values.
</script>

<template>
  <div class="fixture" data-testid="button-escape-hatch">
    <BankaiButton data-testid="custom-button" variant="brand" size="xl">custom</BankaiButton>
  </div>
</template>

<!-- Global (unscoped) consumer rules keyed on the reflected custom `data-*`, exactly how an app adds
     a variant/size outside the shipped set. Plain attribute selectors (natural specificity) so they
     beat the theme's zero-specificity `:where()` base regardless of stylesheet order. Distinctive
     values so the e2e can prove the rule fired (i.e. the custom value wasn't silently dropped). -->
<style>
.bankai-button[data-variant='brand'] {
  background-color: rgb(1, 2, 3);
}

.bankai-button[data-size='xl'] {
  padding-top: 42px;
}
</style>
