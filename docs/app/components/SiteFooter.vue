<script setup lang="ts">
// Interim site footer → to be replaced by <BankaiFooter> inside <BankaiLayout> once it lands.
import { BankaiText } from '@bankai-vue/core';
</script>

<template>
  <footer class="site-footer">
    <BankaiText as="span" size="sm" tone="subtle">
      MIT © bankai-vue · This site is built with bankai-vue.
    </BankaiText>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--bankai-color-border, currentColor);
  text-align: center;
}
</style>
