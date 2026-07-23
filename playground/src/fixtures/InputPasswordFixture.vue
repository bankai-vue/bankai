<script setup lang="ts">
import { BankaiInputPassword } from '@bankai-vue/core';

// Deterministic fixture for visual regression: the default (masked, with the reveal toggle) at every size,
// a revealed instance (type=text, "Hide password" button), a bare instance (toggle=false — no wrapper or
// button), then disabled/read-only. Static `model-value`s and `revealed` bindings (no refs) keep
// screenshots stable. The `.bounds` wrapper gives the full-width controls a fixed inline-size so the
// baseline is deterministic.
const sizes = ['sm', 'md', 'lg'] as const;
</script>

<template>
  <div class="fixture" data-testid="input-password-fixture">
    <div class="bounds">
      <!-- Default: masked field + reveal button, at each size. -->
      <BankaiInputPassword
        v-for="size in sizes"
        :key="size"
        :size="size"
        :model-value="'hunter2'"
        :data-testid="`input-password-${size}`"
      />

      <!-- Revealed: type=text, the button reads 'Hide password'. -->
      <BankaiInputPassword
        :model-value="'revealed!'"
        :revealed="true"
        data-testid="input-password-revealed"
      />

      <!-- Bare: no wrapper, no reveal button. -->
      <BankaiInputPassword
        :model-value="'bare'"
        :toggle="false"
        data-testid="input-password-bare"
      />

      <!-- States. -->
      <BankaiInputPassword :model-value="'secret'" disabled data-testid="input-password-disabled" />
      <BankaiInputPassword :model-value="'secret'" readonly data-testid="input-password-readonly" />
    </div>
  </div>
</template>

<style scoped>
.fixture {
  display: inline-flex;
  padding: 1rem;
}

.bounds {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  inline-size: 20rem;
}
</style>
