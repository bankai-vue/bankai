<script setup lang="ts">
// Interim theme switcher for the docs header → to be replaced by <BankaiThemeToggle> (ROADMAP Phase 1).
//
// The bankai theme drives dark mode purely from `color-scheme` + `light-dark()` (SPEC §4.18), so
// switching is just overriding `color-scheme` on <html> — no JS token swap. The stored choice is
// applied *before paint* by the inline head script in nuxt.config (no color flash). 'system' means
// "follow the OS" (the theme default).
//
// Rendered client-only (SiteHeader wraps it in <ClientOnly>), so setup reads the stored choice
// synchronously and the first paint already shows the right option selected — no active-state flash
// and no hydration mismatch, since there is no server-rendered version to reconcile against.
//
// The three options are mutually exclusive, so this is a WAI-ARIA radiogroup: arrow keys move the
// selection over a roving tabindex (only the selected radio is tabbable).
import type { ComponentPublicInstance } from 'vue';
import { BankaiButton, BankaiFlex } from '@bankai-vue/core';
import { ref } from 'vue';

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

function readStored(): Scheme {
  try {
    return fromStored(localStorage.getItem(STORAGE_KEY));
  } catch {
    // Ignore storage access errors (private mode, blocked cookies, etc.).
    return 'system';
  }
}

const scheme = ref<Scheme>(readStored());
const group = ref<ComponentPublicInstance | null>(null);

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

// Roving tabindex: move focus to the radio that just became selected.
function focusOption(index: number): void {
  const root = group.value?.$el as HTMLElement | undefined;
  root?.querySelectorAll<HTMLButtonElement>('button')[index]?.focus();
}

// Arrow keys cycle the selection (WAI-ARIA radiogroup pattern); preventDefault stops page scroll.
function onKeydown(event: KeyboardEvent): void {
  const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
  const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
  if (!forward && !backward) {
    return;
  }
  event.preventDefault();
  const current = options.findIndex((opt) => opt.key === scheme.value);
  const nextIndex = (current + (forward ? 1 : -1) + options.length) % options.length;
  const nextOption = options[nextIndex];
  if (!nextOption) {
    return;
  }
  select(nextOption.key);
  focusOption(nextIndex);
}
</script>

<template>
  <BankaiFlex
    ref="group"
    align="center"
    gap="1"
    role="radiogroup"
    aria-label="Color scheme"
    @keydown="onKeydown"
  >
    <BankaiButton
      v-for="opt in options"
      :key="opt.key"
      size="sm"
      role="radio"
      :variant="scheme === opt.key ? 'solid' : 'ghost'"
      :aria-checked="scheme === opt.key"
      :tabindex="scheme === opt.key ? 0 : -1"
      @click="select(opt.key)"
    >
      {{ opt.label }}
    </BankaiButton>
  </BankaiFlex>
</template>
