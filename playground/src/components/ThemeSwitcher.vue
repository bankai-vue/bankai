<script setup lang="ts">
// Both themes as CSS strings (not injected on import) so exactly one is ever mounted at a time.
// - theme-bankai ships plain CSS.
// - theme-tailwind uses `@apply`, so we import the COMPILED entry (../tailwind.css), whose `?inline`
//   output has `@apply` resolved and Tailwind's variables inlined.
import bankaiCss from '@bankai-vue/theme-bankai?inline';
import { onScopeDispose, ref, watchEffect } from 'vue';
import tailwindCss from '../tailwind.css?inline';

type ThemeName = 'bankai' | 'tailwind';

const labels: Record<ThemeName, string> = {
  bankai: 'Default (theme-bankai)',
  tailwind: 'Tailwind (theme-tailwind)',
};
const themeCss: Record<ThemeName, string> = {
  bankai: bankaiCss,
  tailwind: tailwindCss,
};

const theme = ref<ThemeName>('bankai');

// Mount the selected theme (and only that theme) into a single managed <style>. Swapping its
// content unloads the previous theme's CSS entirely, so the two never apply at the same time.
const styleEl = document.createElement('style');
styleEl.id = 'playground-active-theme';
document.head.append(styleEl);
watchEffect(() => {
  styleEl.textContent = themeCss[theme.value];
});
onScopeDispose(() => styleEl.remove());
</script>

<template>
  <fieldset class="theme-switcher" data-testid="theme-switcher">
    <legend>Theme</legend>
    <label v-for="(label, key) in labels" :key="key">
      <input v-model="theme" type="radio" name="theme" :value="key" />
      {{ label }}
    </label>
  </fieldset>
</template>

<style scoped>
.theme-switcher {
  display: inline-flex;
  gap: 1rem;
  align-items: center;
}

.theme-switcher label {
  display: inline-flex;
  gap: 0.25rem;
  align-items: center;
}
</style>
