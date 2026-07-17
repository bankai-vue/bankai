<script setup lang="ts">
// Marketing / top-level shell: <BankaiLayout> emits the header/main/footer landmark regions (no
// sidebar). SiteHeader/SiteFooter are auto-imported and slotted into #header/#footer; the default slot
// is BankaiLayout's sole <main>, so pages render content without their own landmark. Per the App ›
// Layout › Page › Container structure (SPEC.md §5.6), the per-route host (<BankaiPage>) and its width
// (<BankaiContainer>) live in the page file, not this shell — the long-run goal is docs composed
// entirely of Bankai components.
</script>

<template>
  <BankaiLayout>
    <template #header>
      <SiteHeader />
    </template>

    <slot />

    <template #footer>
      <SiteFooter />
    </template>
  </BankaiLayout>
</template>
