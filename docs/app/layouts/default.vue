<template>
  <!--
    Interim shell → to be replaced by <BankaiLayout> (which will emit the header/main/footer
    landmark regions) once it lands (ROADMAP Phase 1). SiteHeader/SiteFooter are auto-imported.
    This layout owns the sole <main>, so pages render content into the slot without their own.
  -->
  <SiteHeader />
  <main class="site-main">
    <slot />
  </main>
  <SiteFooter />
</template>

<style scoped>
.site-main {
  max-width: 64rem;
  margin-inline: auto;
  padding: 4rem 1.5rem;
}
</style>
