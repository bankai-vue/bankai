<script lang="ts">
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7): the theme styles the `bankai-aside` class + `data-part="root"`.
// A standalone `<aside>` complementary region — a side rail next to the main content (typically a
// sidebar nav). It renders the native `<aside>` element so the `complementary` landmark is carried by
// the element itself (SPEC.md §4.9); BankaiAside adds the themeable `bankai-aside` hook (padding + an
// inline-end divider border).
//
// `<aside>` is the `complementary` landmark at the top level. A page may hold MORE THAN ONE — so each
// needs an accessible name to tell them apart: the `label` prop sets `aria-label`. A single aside can
// omit it. `BankaiLayout` already emits its own `<aside>` for the `#sidebar` slot, so DON'T put a
// `BankaiAside` inside that slot (it would nest `<aside>` in `<aside>`). Reach for `BankaiAside` when you
// build a shell WITHOUT `BankaiLayout`, or need a second/standalone side rail.

/**
 * Props of a {@link BankaiAside}.
 */
export interface BankaiAsideProps {
  /**
   * Accessible name for the region, set as `aria-label`. A page can have several `complementary`
   * landmarks, so label each one (e.g. `"Secondary navigation"`, `"Filters"`) to tell them apart in a
   * screen reader's landmark list. Omit for a single, unambiguous aside. A consumer's own `aria-label`
   * / `aria-labelledby` fallthrough takes precedence over this default.
   */
  label?: string;
}

/**
 * Slots of a {@link BankaiAside}.
 */
export interface BankaiAsideSlots {
  /**
   * Side-rail content — typically a `BankaiSidebar` (sections, collapsible groups).
   */
  default?: () => VNode[];
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';

/**
 * A standalone `<aside>` complementary region. Renders a native
 * `<aside class="bankai-aside" data-part="root">` so the element carries the `complementary` landmark;
 * the accompanying `@bankai-vue/theme-bankai` `:where()` rules give it the house side-rail look (padding
 * + an inline-end divider border), which a consumer's utility classes override by plain specificity
 * (SPEC.md §4.4, §4.6). The `label` prop sets `aria-label` so multiple asides on a page stay
 * distinguishable. Merges consumer `class`/`style`/attributes onto the root; ships no CSS.
 *
 * For a shell built WITHOUT `BankaiLayout` — do not place it inside `BankaiLayout`'s `#sidebar` slot,
 * which already emits an `<aside>`.
 */
defineOptions({ name: 'BankaiAside', inheritAttrs: false });

const { label } = defineProps<BankaiAsideProps>();

// `inheritAttrs: false` + `v-bind="attrs"` on the root so the component-owned `class`/`data-part`
// (bound AFTER `attrs`) can't be clobbered by a consumer fallthrough (SPEC.md §4.4, §5.6). `aria-label`
// is bound BEFORE `attrs` — it is a DEFAULT the component provides, so a consumer's own `aria-label` /
// `aria-labelledby` fallthrough overrides it, and an unset `label` never clobbers a fallthrough one.
const attrs = useAttrs();

defineSlots<BankaiAsideSlots>();
</script>

<template>
  <aside :aria-label="label" v-bind="attrs" class="bankai-aside" data-part="root"><slot /></aside>
</template>
