<script lang="ts">
import type { VoidElementTagName } from '../../internal/dom';
import type { CSSProperties, VNode } from 'vue';

// Styled via `@bankai-vue/theme-bankai` (`components/flex.css`), NOT inline styles.
// The layout props are reflected as `data-*` on the root and consumed by zero-specificity
// `:where()` rules, so a consumer's utility classes (Tailwind `inline-flex`, `flex-col`, …)
// win over the theme by ordinary class specificity (SPEC.md §4.4, §4.6) — an inline
// `display:flex` could not be overridden without `!important`. `gap` is a continuous value,
// so it rides a `--bankai-flex-gap` custom property that the same `:where()` rule reads.
// Trade-off: the layout needs the theme CSS (or an equivalent targeting `.bankai-flex`) loaded.

/**
 * Element the {@link BankaiFlex} root renders as (`as` prop).
 * Any non-void HTML tag name — `BankaiFlex` is polymorphic and defaults to `'div'`.
 * Void elements (`input`, `br`, `img`, …) are excluded since they can't hold children.
 */
export type BankaiFlexAs = Exclude<keyof HTMLElementTagNameMap, VoidElementTagName>;

/**
 * `flex-direction` of a {@link BankaiFlex}. Values are the native CSS keywords.
 */
export type BankaiFlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

/**
 * Cross-axis alignment of a {@link BankaiFlex} — maps to `align-items`.
 * Uses the short box-alignment keywords (`start`/`end` map to `flex-start`/`flex-end`).
 */
export type BankaiFlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

/**
 * Main-axis distribution of a {@link BankaiFlex} — maps to `justify-content`.
 * `between`/`around`/`evenly` map to `space-between`/`space-around`/`space-evenly`.
 * (`stretch` is intentionally omitted: it's a no-op on a flex main axis.)
 */
export type BankaiFlexJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

/**
 * `flex-wrap` of a {@link BankaiFlex}. Values are the native CSS keywords.
 */
export type BankaiFlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

/**
 * Spacing between {@link BankaiFlex} children — maps to `gap`.
 *
 * A `number` (or a bare-numeric `string` like `'4'` from a static `gap="4"`) is a **spacing-scale step**:
 * it resolves to the rem-based `--bankai-space-<n>` token from the active theme, so spacing scales with
 * the user's root font size (responsive/accessible), never a frozen pixel value. The step's absolute
 * size is theme-owned (`theme-bankai` uses a 2px-base grid; `theme-tailwind` maps to Tailwind's scale).
 * Steps outside a theme's scale fall back to `n × var(--bankai-space-unit)` — the theme's own base unit —
 * so any step still yields rem spacing consistent with the active theme.
 *
 * Any other `string` is a verbatim CSS length — `'1rem'`, `'var(--bankai-space-2)'`,
 * `'clamp(0.5rem, 2vw, 1.5rem)'` for fluid gaps, etc.
 */
export type BankaiFlexGap = number | string;

/**
 * Slots of a {@link BankaiFlex}.
 */
export interface BankaiFlexSlots {
  /**
   * Flex children.
   */
  default?: () => VNode[];
}

/**
 * Props for {@link BankaiFlex}.
 */
export interface BankaiFlexProps {
  /**
   * Element to render as. Polymorphic — any HTML tag name.
   *
   * @default 'div'
   */
  as?: BankaiFlexAs;
  /**
   * `flex-direction`. Omitted from the style when unset (browser default `row` applies).
   */
  direction?: BankaiFlexDirection;
  /**
   * Cross-axis alignment (`align-items`). Omitted when unset.
   */
  align?: BankaiFlexAlign;
  /**
   * Main-axis distribution (`justify-content`). Omitted when unset.
   */
  justify?: BankaiFlexJustify;
  /**
   * Spacing between children (`gap`). A number (or a bare-numeric string like `'4'`) is a rem-based
   * spacing-scale step (`--bankai-space-<n>`); any other string is a verbatim CSS length
   * (`'1rem'`, `'clamp(…)'`, `'var(--x)'`). Omitted when unset.
   */
  gap?: BankaiFlexGap;
  /**
   * `flex-wrap`. Omitted when unset (browser default `nowrap` applies).
   */
  wrap?: BankaiFlexWrap;
  /**
   * Render as `inline-flex` instead of `flex`.
   *
   * @default false
   */
  inline?: boolean;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';

const {
  as = 'div',
  direction,
  align,
  justify,
  gap,
  wrap,
  inline = false,
} = defineProps<BankaiFlexProps>();

/**
 * A polymorphic flexbox container. `direction`/`align`/`justify`/`wrap`/`inline` are reflected
 * on the root as `data-*` and `gap` as a `--bankai-flex-gap` custom property; the accompanying
 * `@bankai-vue/theme-bankai` `:where()` rules turn those into the actual flex layout — so a
 * consumer's utility classes override it by plain specificity (SPEC.md §4.4, §4.6).
 * Renders a `<div>` by default (override via `as`), exposes a `bankai-flex` class plus `data-part="root"`,
 * and merges consumer `class`/`style`/attributes onto the root.
 */
defineOptions({ name: 'BankaiFlex', inheritAttrs: true });

// Resolve a `gap` prop to the CSS value carried by `--bankai-flex-gap` (the theme's `:where()`
// rule reads it). A number — or a bare-numeric string, since a static `gap="4"` arrives as `'4'` —
// is a spacing-scale STEP: it resolves to the rem-based `--bankai-space-<n>` token, with a
// `calc(n × var(--bankai-space-unit))` fallback for out-of-scale/no-theme steps. The base unit is
// theme-owned (`--bankai-space-unit`), so the fallback tracks the *active* theme's grid — core bakes
// no base; the literal `0.125rem` is only the last-resort default when no theme is loaded at all.
// (A hardcoded base here would silently use `theme-bankai`'s 2px grid under `theme-tailwind`.)
// Any other string is a verbatim CSS length (`'1rem'`, `'var(--x)'`, `'clamp(…)'`).
function resolveGap(value: BankaiFlexGap): string {
  if (typeof value === 'string' && !/^\d+(?:\.\d+)?$/u.test(value)) {
    return value;
  }

  const step = Number(value);
  const fallback = `calc(${step} * var(--bankai-space-unit, 0.125rem))`;
  // Only whole steps have a `--bankai-space-<n>` token (fractional names aren't valid identifiers).
  return Number.isInteger(step) ? `var(--bankai-space-${step}, ${fallback})` : fallback;
}

// Unset → omitted (Vue drops an `undefined` style value), so the theme's `normal` fallback applies.
const rootStyle = computed<CSSProperties>(() => {
  const gapCss = gap === undefined ? undefined : resolveGap(gap);
  return { '--bankai-flex-gap': gapCss };
});

// `data-inline` is a presence flag (empty string when on, absent when off) so the CSS can
// match `[data-inline]`. The enumerated props reflect their value verbatim, or are omitted
// when unset (Vue drops `undefined`/`null` attribute bindings), keeping the DOM clean.
const dataInline = computed<'' | undefined>(() => (inline ? '' : undefined));

defineSlots<BankaiFlexSlots>();
</script>

<template>
  <component
    :is="as"
    class="bankai-flex"
    data-part="root"
    :data-direction="direction"
    :data-align="align"
    :data-justify="justify"
    :data-wrap="wrap"
    :data-inline="dataInline"
    :style="rootStyle"
  >
    <slot />
  </component>
</template>
