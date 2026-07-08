<script lang="ts">
import type { VoidElementTagName } from '../../internal/dom';
import type { CSSProperties, VNode } from 'vue';

// Styled via `@bankai-vue/theme-bankai` (`components/grid.css`), NOT inline styles.
// The layout props are reflected as `data-*` on the root and consumed by zero-specificity
// `:where()` rules, so a consumer's utility classes (Tailwind `grid-cols-2`, `items-center`, …)
// win over the theme by ordinary class specificity (SPEC.md §4.4, §4.6) — an inline
// `display:grid` could not be overridden without `!important`. The continuous track values
// (`columns`/`rows`/`areas`/`gap`) ride `--bankai-grid-*` custom properties that the same
// `:where()` rule reads. Trade-off: the layout needs the theme CSS (or an equivalent
// targeting `.bankai-grid`) loaded. Sibling of {@link BankaiFlex}, for 2D layouts.

/**
 * Element the {@link BankaiGrid} root renders as (`as` prop).
 * Any non-void HTML tag name — `BankaiGrid` is polymorphic and defaults to `'div'`.
 * Void elements (`input`, `br`, `img`, …) are excluded since they can't hold children.
 */
export type BankaiGridAs = Exclude<keyof HTMLElementTagNameMap, VoidElementTagName>;

/**
 * `grid-template-columns` of a {@link BankaiGrid}.
 *
 * A `number` (or a bare-numeric `string` like `'3'` from a static `columns="3"`) is a **count of
 * equal tracks**: it expands to `repeat(<n>, minmax(0, 1fr))` — the `minmax(0, 1fr)` (rather than a
 * bare `1fr`) lets tracks shrink below their content's min-size, preventing the classic grid blowout.
 *
 * Any other `string` is a verbatim `grid-template-columns` value — `'200px 1fr'`,
 * `'repeat(auto-fill, minmax(10rem, 1fr))'`, `'var(--x)'`, etc.
 */
export type BankaiGridColumns = number | string;

/**
 * `grid-template-rows` of a {@link BankaiGrid}.
 *
 * A `number` (or a bare-numeric `string`) is a **count of equal tracks** → `repeat(<n>, minmax(0, 1fr))`.
 * Any other `string` is a verbatim `grid-template-rows` value (`'auto 1fr'`, `'repeat(3, 4rem)'`, …).
 */
export type BankaiGridRows = number | string;

/**
 * `grid-template-areas` of a {@link BankaiGrid}.
 *
 * A `string[]` is the ergonomic form — one entry per row, each auto-quoted:
 * `['header header', 'sidebar main']` → `"header header" "sidebar main"`.
 *
 * A `string` is passed through verbatim, so it must already carry its own quotes
 * (`'"header header" "sidebar main"'`).
 */
export type BankaiGridAreas = string | string[];

/**
 * Spacing between {@link BankaiGrid} tracks — maps to `gap`.
 *
 * A `number` (or a bare-numeric `string` like `'4'` from a static `gap="4"`) is a **spacing-scale step**:
 * it resolves to the rem-based `--bankai-space-<n>` token from the active theme, so spacing scales with
 * the user's root font size (responsive/accessible), never a frozen pixel value. The step's absolute
 * size is theme-owned (`theme-bankai` uses a 2px-base grid; `theme-tailwind` maps to Tailwind's scale).
 * Steps outside a theme's scale fall back to `n × var(--bankai-space-unit)` — the theme's own base unit —
 * so any step still yields rem spacing consistent with the active theme.
 *
 * Any other `string` is a verbatim CSS length — `'1rem'`, `'var(--bankai-space-2)'`,
 * `'clamp(0.5rem, 2vw, 1.5rem)'` for fluid gaps, etc. Set the two axes independently with a
 * two-value string (`'1rem 2rem'` = row-gap column-gap).
 */
export type BankaiGridGap = number | string;

/**
 * Auto-placement direction of a {@link BankaiGrid} — maps to `grid-auto-flow`.
 * `row-dense`/`column-dense` map to the two-keyword `row dense`/`column dense` (`dense` alone is `row dense`).
 */
export type BankaiGridFlow = 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense';

/**
 * In-cell alignment along the block axis of a {@link BankaiGrid} — maps to `align-items`.
 * Uses the native box-alignment keywords.
 */
export type BankaiGridAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

/**
 * In-cell alignment along the inline axis of a {@link BankaiGrid} — maps to `justify-items`.
 * Uses the native box-alignment keywords. (Unlike {@link BankaiFlex}'s `justify`, which distributes
 * content on the main axis, a grid's `justify` positions each item within its cell.)
 */
export type BankaiGridJustify = 'start' | 'end' | 'center' | 'stretch';

/**
 * Slots of a {@link BankaiGrid}.
 */
export interface BankaiGridSlots {
  /**
   * Grid children.
   */
  default?: () => VNode[];
}

/**
 * Props for {@link BankaiGrid}.
 */
export interface BankaiGridProps {
  /**
   * Element to render as. Polymorphic — any HTML tag name.
   *
   * @default 'div'
   */
  as?: BankaiGridAs;
  /**
   * `grid-template-columns`. A number (or a bare-numeric string like `'3'`) is a count of equal
   * `repeat(<n>, minmax(0, 1fr))` tracks; any other string is a verbatim value
   * (`'200px 1fr'`, `'repeat(auto-fill, minmax(10rem, 1fr))'`). Omitted when unset.
   */
  columns?: BankaiGridColumns;
  /**
   * `grid-template-rows`. A number (or a bare-numeric string) is a count of equal
   * `repeat(<n>, minmax(0, 1fr))` tracks; any other string is a verbatim value. Omitted when unset.
   */
  rows?: BankaiGridRows;
  /**
   * `grid-template-areas`. A string array is auto-quoted per row (`['a b', 'c d']` → `"a b" "c d"`);
   * a string is used verbatim (must already carry its own quotes). Omitted when unset.
   */
  areas?: BankaiGridAreas;
  /**
   * Spacing between tracks (`gap`). A number (or a bare-numeric string like `'4'`) is a rem-based
   * spacing-scale step (`--bankai-space-<n>`); any other string is a verbatim CSS length
   * (`'1rem'`, `'1rem 2rem'`, `'clamp(…)'`). Omitted when unset.
   */
  gap?: BankaiGridGap;
  /**
   * `grid-auto-flow` — direction the grid auto-places items. Omitted when unset (browser default `row`).
   */
  flow?: BankaiGridFlow;
  /**
   * In-cell block-axis alignment (`align-items`). Omitted when unset.
   */
  align?: BankaiGridAlign;
  /**
   * In-cell inline-axis alignment (`justify-items`). Omitted when unset.
   */
  justify?: BankaiGridJustify;
  /**
   * Render as `inline-grid` instead of `grid`.
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
  columns,
  rows,
  areas,
  gap,
  flow,
  align,
  justify,
  inline = false,
} = defineProps<BankaiGridProps>();

/**
 * A polymorphic CSS-grid container. `flow`/`align`/`justify`/`inline` are reflected on the root as
 * `data-*`, and the continuous track values `columns`/`rows`/`areas`/`gap` as `--bankai-grid-*`
 * custom properties; the accompanying `@bankai-vue/theme-bankai` `:where()` rules turn those into
 * the actual grid layout — so a consumer's utility classes override it by plain specificity
 * (SPEC.md §4.4, §4.6). Renders a `<div>` by default (override via `as`), exposes a `bankai-grid`
 * class plus `data-part="root"`, and merges consumer `class`/`style`/attributes onto the root.
 * The 2D sibling of {@link BankaiFlex}.
 */
defineOptions({ name: 'BankaiGrid', inheritAttrs: true });

// Resolve a `gap` prop to the CSS value carried by `--bankai-grid-gap` (the theme's `:where()` rule
// reads it). A number — or a bare-numeric string, since a static `gap="4"` arrives as `'4'` — is a
// spacing-scale STEP: it resolves to the rem-based `--bankai-space-<n>` token, with a
// `calc(n × var(--bankai-space-unit))` fallback for out-of-scale/no-theme steps. The base unit is
// theme-owned (`--bankai-space-unit`), so the fallback tracks the *active* theme's grid — core bakes
// no base; the literal `0.125rem` is only the last-resort default when no theme is loaded at all.
// Any other string is a verbatim CSS length (`'1rem'`, `'1rem 2rem'`, `'var(--x)'`, `'clamp(…)'`).
function resolveGap(value: BankaiGridGap): string {
  if (typeof value === 'string' && !/^\d+(?:\.\d+)?$/u.test(value)) {
    return value;
  }

  const step = Number(value);
  const fallback = `calc(${step} * var(--bankai-space-unit, 0.125rem))`;
  // Only whole steps have a `--bankai-space-<n>` token (fractional names aren't valid identifiers).
  return Number.isInteger(step) ? `var(--bankai-space-${step}, ${fallback})` : fallback;
}

// Resolve a `columns`/`rows` prop to a `grid-template-*` value. A number — or a bare-numeric string,
// since a static `columns="3"` arrives as `'3'` — is a count of equal tracks, expanded to
// `repeat(<n>, minmax(0, 1fr))`; the `minmax(0, 1fr)` (not a bare `1fr`) lets tracks shrink below
// content min-size, avoiding grid blowout. Any other string is a verbatim template value.
function resolveTracks(value: BankaiGridColumns): string {
  if (typeof value === 'string' && !/^\d+$/u.test(value)) {
    return value;
  }

  return `repeat(${Number(value)}, minmax(0, 1fr))`;
}

// Resolve an `areas` prop to a `grid-template-areas` value. An array is the ergonomic form: each
// entry is one row, auto-wrapped in quotes (`['a b', 'c d']` → `"a b" "c d"`). A string is verbatim,
// so it must already carry its own quotes.
function resolveAreas(value: BankaiGridAreas): string {
  return Array.isArray(value) ? value.map((row) => `"${row}"`).join(' ') : value;
}

// Unset props are omitted (Vue drops an `undefined` style value), so the theme's `:where()` fallback
// (`none`/`normal`) applies and the DOM stays clean.
const rootStyle = computed<CSSProperties>(() => ({
  '--bankai-grid-columns': columns === undefined ? undefined : resolveTracks(columns),
  '--bankai-grid-rows': rows === undefined ? undefined : resolveTracks(rows),
  '--bankai-grid-areas': areas === undefined ? undefined : resolveAreas(areas),
  '--bankai-grid-gap': gap === undefined ? undefined : resolveGap(gap),
}));

// `data-bankai-inline` is a presence flag (empty string when on, absent when off) so the CSS can
// match `[data-bankai-inline]`. The enumerated props reflect their value verbatim, or are omitted
// when unset (Vue drops `undefined`/`null` attribute bindings), keeping the DOM clean.
const dataInline = computed<'' | undefined>(() => (inline ? '' : undefined));

defineSlots<BankaiGridSlots>();
</script>

<template>
  <component
    :is="as"
    class="bankai-grid"
    data-part="root"
    :data-bankai-flow="flow"
    :data-bankai-align="align"
    :data-bankai-justify="justify"
    :data-bankai-inline="dataInline"
    :style="rootStyle"
  >
    <slot />
  </component>
</template>
