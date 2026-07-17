<script lang="ts">
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7): the theme styles the `bankai-header` class + `data-part="root"`.
// A standalone `<header>` banner region — the content layer of the App › Layout › Page › Container
// structure (SPEC.md §5.6, ROADMAP). It renders the native `<header>` element so the `banner` landmark
// is carried by the element itself (SPEC.md §4.9); BankaiHeader only adds the themeable `bankai-header`
// hook (the house banner look — inline/block padding + a bottom border). It typically holds a
// `BankaiNavbar`.
//
// `<header>` is the `banner` landmark ONLY when it is NOT nested inside `<article>`/`<aside>`/`<main>`/
// `<nav>`/`<section>` — so this standalone version is for a top-level app header. `BankaiLayout` already
// emits its own `<header>` for the `#header` slot, so DON'T put a `BankaiHeader` inside that slot (it
// would nest `<header>` in `<header>` → a duplicate `banner` landmark). Reach for `BankaiHeader` when you
// build a shell WITHOUT `BankaiLayout`, or need a header region standalone.

/**
 * Slots of a {@link BankaiHeader}.
 */
export interface BankaiHeaderSlots {
  /**
   * Header content — typically a `BankaiNavbar` (brand + links + actions).
   */
  default?: () => VNode[];
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';

/**
 * A standalone `<header>` banner region. Renders a native
 * `<header class="bankai-header" data-part="root">` so the element carries the `banner` landmark; the
 * accompanying `@bankai-vue/theme-bankai` `:where()` rules give it the house banner look (inline/block
 * padding + a bottom border), which a consumer's utility classes override by plain specificity
 * (SPEC.md §4.4, §4.6). Merges consumer `class`/`style`/attributes onto the root; ships no CSS.
 *
 * The content layer of App › Layout › Page › Container (SPEC.md §5.6) — for a shell built WITHOUT
 * `BankaiLayout`. Do not place it inside `BankaiLayout`'s `#header` slot, which already emits a
 * `<header>` (landmark uniqueness).
 */
defineOptions({ name: 'BankaiHeader', inheritAttrs: false });

// `inheritAttrs: false` + `v-bind="attrs"` FIRST in the template so the component-owned `data-part` can't
// be clobbered by a consumer fallthrough `data-part` (SPEC.md §4.4, §5.6). `class`/`style` still merge.
const attrs = useAttrs();

defineSlots<BankaiHeaderSlots>();
</script>

<template>
  <header v-bind="attrs" class="bankai-header" data-part="root"><slot /></header>
</template>
