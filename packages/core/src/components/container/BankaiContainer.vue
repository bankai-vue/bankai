<script lang="ts">
import type { VoidElementTagName } from '../../internal/dom';
import type { VNode } from 'vue';

// Styled via `@bankai-vue/theme-bankai` (`components/container.css`), NOT inline styles.
// `fluid` is reflected as a `data-bankai-fluid` presence flag on the root and consumed by a
// zero-specificity `:where()` rule, so a consumer's utility classes (Tailwind `max-w-*`, `mx-0`, …)
// win over the theme by ordinary specificity (SPEC.md §4.4, §4.6) — an inline `max-width` could not
// be overridden without `!important`. The centered width is intrinsic (`max-inline-size` +
// `margin-inline: auto`): it resolves against the containing block, so it collapses to edge-to-edge
// on its own when the parent is narrower than the max-width — no media queries, correct in embedded /
// side-by-side panes where the viewport is wide but the box is not (SPEC.md §4.19, §5.6).
// Trade-off: the width needs the theme CSS (or an equivalent targeting `.bankai-container`) loaded.

/**
 * Element the {@link BankaiContainer} root renders as (`as` prop).
 * Any non-void HTML tag name — `BankaiContainer` is polymorphic and defaults to `'div'`.
 * Void elements (`input`, `br`, `img`, …) are excluded since they can't hold children.
 *
 * Defaults to `'div'` on purpose: a width wrapper carries no semantics of its own, so it never
 * emits sectioning content you didn't ask for. Opt into `as="section"` (or `article`, …) only when
 * the box genuinely *is* that element.
 */
export type BankaiContainerAs = Exclude<keyof HTMLElementTagNameMap, VoidElementTagName>;

/**
 * Slots of a {@link BankaiContainer}.
 */
export interface BankaiContainerSlots {
  /**
   * Container children — the content whose width is constrained.
   */
  default?: () => VNode[];
}

/**
 * Props for {@link BankaiContainer}.
 */
export interface BankaiContainerProps {
  /**
   * Element to render as. Polymorphic — any non-void HTML tag name.
   *
   * @default 'div'
   */
  as?: BankaiContainerAs;
  /**
   * Fill the available width (edge-to-edge) instead of the centered max-width default. This is the
   * "bars left/right on huge viewports" toggle — `fluid` removes the max-width cap so the container
   * spans its parent, keeping only the inline gutter. Centered content already collapses to
   * edge-to-edge on its own when the parent is narrower than the max-width; `fluid` opts out of the
   * cap even when there *is* room for bars (full-bleed heroes, dashboards).
   *
   * @default false
   */
  fluid?: boolean;
}
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

const { as = 'div', fluid = false } = defineProps<BankaiContainerProps>();

/**
 * A polymorphic width utility. By default it centers its content at a themeable max-width
 * (`--bankai-container-max-width`) with an inline gutter (`--bankai-container-gutter`); `fluid`
 * reflects a `data-bankai-fluid` flag that the `@bankai-vue/theme-bankai` `:where()` rule turns into
 * an edge-to-edge, full-width box — so a consumer's utility classes override it by plain specificity
 * (SPEC.md §4.4, §4.6). The width is intrinsic (relative to the containing block, no media queries),
 * so it degrades correctly in embedded / side-by-side panes (SPEC.md §4.19). Renders a `<div>` by
 * default (override via `as`), exposes a `bankai-container` class plus `data-part="root"`, and merges
 * consumer `class`/`style`/attributes onto the root. Reusable anywhere (Card, section, hero); the
 * width layer of App › Layout › Page › Container (SPEC.md §5.6) — never renders its own `<main>`.
 */
defineOptions({ name: 'BankaiContainer', inheritAttrs: false });

// `inheritAttrs: false` + `v-bind="attrs"` FIRST on the root so the component-owned `data-part`/
// `data-bankai-fluid` can't be clobbered by a consumer fallthrough (SPEC.md §4.4, §5.6). `class`/`style`
// still merge, so consumer width utilities keep overriding the theme by ordinary specificity.
const attrs = useAttrs();

// `data-bankai-fluid` is a presence flag (empty string when on, absent when off) so the CSS can
// match `[data-bankai-fluid]` regardless of value; Vue drops the attribute when the value is
// `undefined`, keeping the DOM clean in the centered default.
const dataFluid = computed<'' | undefined>(() => (fluid ? '' : undefined));

defineSlots<BankaiContainerSlots>();
</script>

<template>
  <component
    :is="as"
    v-bind="attrs"
    class="bankai-container"
    data-part="root"
    :data-bankai-fluid="dataFluid"
  >
    <slot />
  </component>
</template>
