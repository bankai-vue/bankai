<script setup lang="ts">
import { BankaiButton, BankaiFlex } from '@bankai-vue/core';
// Interim theme switcher for the docs header → to be replaced by <BankaiThemeToggle> (ROADMAP Phase 1).
//
// The bankai theme drives dark mode purely from `color-scheme` + `light-dark()` (SPEC §4.18), so
// switching is just overriding `color-scheme` on <html> — no JS token swap. The stored choice is
// applied *before paint* by the inline head script in nuxt.config (no flash); this control only
// reflects and updates it. 'system' means "follow the OS" (the theme default).
import { onMounted, ref } from 'vue';

type Scheme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'bankai-docs-color-scheme';
const cssValue: Record<Scheme, string> = {
  system: 'light dark',
  light: 'light',
  dark: 'dark',
};
const options: Array<{ key: Scheme; label: string }> = [
  { key: 'system', label: 'System' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
];

function fromStored(value: string | null): Scheme {
  if (value === 'light') {
    return 'light';
  }
  if (value === 'dark') {
    return 'dark';
  }
  return 'system';
}

// SSR/first client render is always 'system' so hydration matches; onMounted reconciles with the
// stored choice (which the head script has already applied to <html>).
const scheme = ref<Scheme>('system');

onMounted(() => {
  try {
    scheme.value = fromStored(localStorage.getItem(STORAGE_KEY));
  } catch {
    // Ignore storage access errors (private mode, blocked cookies, etc.).
  }
});

function select(next: Scheme): void {
  scheme.value = next;
  document.documentElement.style.colorScheme = cssValue[next];
  try {
    if (next === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, cssValue[next]);
    }
  } catch {
    // Ignore storage access errors (private mode, blocked cookies, etc.).
  }
}
</script>

<template>
  <BankaiFlex align="center" gap="1" role="group" aria-label="Color scheme">
    <BankaiButton
      v-for="opt in options"
      :key="opt.key"
      size="sm"
      :variant="scheme === opt.key ? 'solid' : 'ghost'"
      :aria-pressed="scheme === opt.key"
      @click="select(opt.key)"
    >
      {{ opt.label }}
    </BankaiButton>
  </BankaiFlex>
</template>
