<script setup lang="ts">
// Favicon lives here (not in nuxt.config's static head) so its href can be prefixed with the
// resolved baseURL — an absolute path (`/favicon.svg` locally, `/bankai/favicon.svg` in prod) that
// resolves on nested routes like /components/button, where a relative href would 404.
const { app } = useRuntimeConfig();

useHead({
  link: [{ rel: 'icon', type: 'image/svg+xml', href: `${app.baseURL}favicon.svg` }],
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
