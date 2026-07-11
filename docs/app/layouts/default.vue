<script setup lang="ts">
// Marketing / top-level shell: <BankaiLayout> emits the header/main/footer landmark regions (no
// sidebar), and <BankaiContainer> centers the page content at the house width. SiteHeader/SiteFooter
// are auto-imported and slotted into #header/#footer; the default slot is BankaiLayout's sole <main>,
// so pages render content without their own landmark. Dogfoods the App › Layout › Container structure
// (SPEC.md §5.6) — the long-run goal is docs composed entirely of Bankai components.
</script>

<template>
  <BankaiLayout>
    <template #header>
      <SiteHeader />
    </template>

    <BankaiContainer class="site-page">
      <slot />
    </BankaiContainer>

    <template #footer>
      <SiteFooter />
    </template>
  </BankaiLayout>
</template>

<style scoped>
/* BankaiContainer owns the centered inline width + gutter; we only add the vertical rhythm. */
.site-page {
  padding-block: 4rem;
}
</style>
