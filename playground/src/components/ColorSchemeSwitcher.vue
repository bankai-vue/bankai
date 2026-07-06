<script setup lang="ts">
// The bankai theme drives dark mode purely from `color-scheme` + `light-dark()` (SPEC §4.18),
// so switching modes is just overriding `color-scheme` on the root — no JS token swap, no flash.
// Inline style on <html> beats the theme's `:where(:root)` rule (zero specificity).
import { ref, watchEffect } from 'vue';

type ColorScheme = 'light dark' | 'light' | 'dark';

const labels: Record<ColorScheme, string> = {
  'light dark': 'System',
  light: 'Light',
  dark: 'Dark',
};

const scheme = ref<ColorScheme>('light dark');

watchEffect(() => {
  document.documentElement.style.colorScheme = scheme.value;
});
</script>

<template>
  <fieldset class="color-scheme-switcher" data-testid="color-scheme-switcher">
    <legend>Mode</legend>
    <label v-for="(label, key) in labels" :key="key">
      <input v-model="scheme" type="radio" name="color-scheme" :value="key" />
      {{ label }}
    </label>
  </fieldset>
</template>

<style scoped>
.color-scheme-switcher {
  display: inline-flex;
  gap: 1rem;
  align-items: center;
}

.color-scheme-switcher label {
  display: inline-flex;
  gap: 0.25rem;
  align-items: center;
}
</style>
