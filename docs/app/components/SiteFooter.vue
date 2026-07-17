<script setup lang="ts">
// Interim site footer, rendered inside <BankaiLayout>'s #footer slot. BankaiLayout composes
// BankaiFooter for the #footer slot, so this root is a plain <div> (a nested <footer> would duplicate
// the contentinfo landmark) AND the foot bar look — padding + a top border — now comes from
// BankaiFooter's theme paint, not this component; only the centering stays here.
</script>

<template>
  <div class="site-footer">
    <BankaiText as="span" size="sm" tone="subtle">
      MIT © bankai-vue · This site is built with bankai-vue.
    </BankaiText>
  </div>
</template>

<style scoped>
/* Padding + top border come from BankaiFooter's theme paint (BankaiLayout wraps this slot in one);
   only the centering is docs-specific. */
.site-footer {
  text-align: center;
}
</style>
