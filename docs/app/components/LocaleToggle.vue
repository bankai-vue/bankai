<script setup lang="ts">
// Dogfood locale switcher for the docs header: flips `config.i18n.locale` at runtime, proving
// bankai-vue's i18n resolves reactively — every BankaiCodeBlock's copy button label follows the
// switch with no reload (SPEC §4.20). The `de` bundle is registered in nuxt.config so both locales
// are available to switch between.
//
// Session-only (no persistence): the SSR/SSG default ('en') matches the first client render, so the
// localized labels never cause a hydration mismatch — hence, unlike ColorSchemeToggle, this needs no
// <ClientOnly> wrapper or before-paint script. The choice persists across SPA navigation within the
// session; a full reload resets to the default.
//
// Two mutually-exclusive options → a WAI-ARIA radiogroup with a roving tabindex, matching the
// ColorSchemeToggle beside it.
import type { ComponentPublicInstance } from 'vue';
import { computed, ref } from 'vue';

const config = useBankaiConfig();

const options: Array<{ key: string; label: string; name: string }> = [
  { key: 'en', label: 'EN', name: 'English' },
  { key: 'de', label: 'DE', name: 'Deutsch' },
];

const group = ref<ComponentPublicInstance | null>(null);
const active = computed(() => config.i18n.locale);

function select(next: string): void {
  config.i18n.locale = next;
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
  const current = options.findIndex((opt) => opt.key === active.value);
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
    aria-label="Language"
    @keydown="onKeydown"
  >
    <BankaiButton
      v-for="opt in options"
      :key="opt.key"
      size="sm"
      role="radio"
      :variant="active === opt.key ? 'solid' : 'ghost'"
      :aria-checked="active === opt.key"
      :aria-label="opt.name"
      :tabindex="active === opt.key ? 0 : -1"
      @click="select(opt.key)"
    >
      {{ opt.label }}
    </BankaiButton>
  </BankaiFlex>
</template>
