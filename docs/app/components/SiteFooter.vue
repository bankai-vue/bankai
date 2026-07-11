<script setup lang="ts">
// Interim site footer, rendered inside <BankaiLayout>'s #footer slot → to be replaced by
// <BankaiFooter> once it lands. BankaiLayout wraps this in the <footer> contentinfo landmark, so the
// root here is a plain <div> — a nested <footer> would create a duplicate contentinfo landmark.
</script>

<template>
  <div class="site-footer">
    <BankaiText as="span" size="sm" tone="subtle">
      MIT © bankai-vue · This site is built with bankai-vue.
    </BankaiText>
  </div>
</template>

<style scoped>
.site-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--bankai-color-border, currentColor);
  text-align: center;
}
</style>
