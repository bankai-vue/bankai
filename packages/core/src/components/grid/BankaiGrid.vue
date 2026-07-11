<script lang="ts">
import type { VoidElementTagName } from '../../internal/dom';
import type { LiteralUnion } from '../../internal/types';
import type { CSSProperties, VNode } from 'vue';

// Styled via `@bankai-vue/theme-bankai` (`components/grid.css`), NOT inline styles.
// The layout props are reflected as `data-*` on the root and consumed by zero-specificity
// `:where()` rules, so a consumer's utility classes (Tailwind `grid-cols-2`, `items-center`, …)
// win over the theme by ordinary class specificity (SPEC.md §4.4, §4.6) — an inline
// `display:grid` could not be overridden without `!important`. The continuous track values
// (`columns`/`rows`/`areas`/`gap`) ride `--bankai-grid-*` custom properties that the same
// `:where()` rule reads. Trade-off: the layout needs the theme CSS (or an equivalent
// targeting `.bankai-grid`) loaded. Sibling of {@link BankaiFlex}, for 2D layouts.
//
// `align`/`justify` are named-set-plus-escape-hatch (like BankaiText's styling props): a named keyword
// reflects as `data-bankai-align`/`data-bankai-justify` (the theme maps it), while any other value — a
// native box-alignment keyword (`flex-start`, `first baseline`), a `var()`/`calc()` — rides a
// `--bankai-grid-align`/`--bankai-grid-justify` custom property the theme's base `:where()` rule
// applies. So the widened types never lie: an accepted value always lands (SPEC.md §4.4, §4.6).

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
 * A named t-shirt **step** (`'xs'`–`'xl'`) is the ergonomic semantic size: it resolves to the
 * theme-owned `--bankai-gap-<name>` token (`theme-bankai` sets `xs`=0.25rem … `xl`=1.5rem;
 * `theme-tailwind` maps onto its `--spacing`), so `gap="md"` "just works" instead of dying as an
 * invalid CSS length.
 *
 * A `number` (or a bare-numeric `string` like `'4'` from a static `gap="4"`) is a numbered **spacing-scale step**:
 * it resolves to the rem-based `--bankai-space-<n>` token from the active theme, so spacing scales with
 * the user's root font size (responsive/accessible), never a frozen pixel value. The step's absolute
 * size is theme-owned (`theme-bankai` uses a 2px-base grid; `theme-tailwind` maps to Tailwind's scale).
 * Steps outside a theme's scale fall back to `n × var(--bankai-space-unit)` — the theme's own base unit —
 * so any step still yields rem spacing consistent with the active theme.
 *
 * Any other `string` is a verbatim CSS length — `'1rem'`, `'var(--bankai-space-2)'`,
 * `'clamp(0.5rem, 2vw, 1.5rem)'` for fluid gaps, etc. Set the two axes independently with a
 * two-value string (`'1rem 2rem'` = row-gap column-gap). (A named step is single-axis only.)
 */
export type BankaiGridGap = LiteralUnion<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> | number;

/**
 * Auto-placement direction of a {@link BankaiGrid} — maps to `grid-auto-flow`.
 * `row-dense`/`column-dense` map to the two-keyword `row dense`/`column dense` (`dense` alone is `row dense`).
 */
export type BankaiGridFlow = 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense';

/**
 * In-cell alignment along the block axis of a {@link BankaiGrid} — maps to `align-items`.
 * A native box-alignment keyword reflects as `data-bankai-align`; any other string is a verbatim
 * `align-items` value (`'flex-start'`, `'first baseline'`, `'var(--x)'`), carried on `--bankai-grid-align`.
 */
export type BankaiGridAlign = LiteralUnion<
  'start' | 'end' | 'center' | 'baseline' | 'stretch',
  string
>;

/**
 * In-cell alignment along the inline axis of a {@link BankaiGrid} — maps to `justify-items`.
 * A native box-alignment keyword reflects as `data-bankai-justify`; any other string is a verbatim
 * `justify-items` value (`'left'`, `'flex-start'`, `'var(--x)'`), carried on `--bankai-grid-justify`.
 * (Unlike {@link BankaiFlex}'s `justify`, which distributes content on the main axis, a grid's
 * `justify` positions each item within its cell.)
 */
export type BankaiGridJustify = LiteralUnion<'start' | 'end' | 'center' | 'stretch', string>;

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
   * Spacing between tracks (`gap`). A named t-shirt step (`'xs'`–`'xl'`, `--bankai-gap-<name>`) or a
   * number/bare-numeric string (a rem-based `--bankai-space-<n>` step); any other string is a verbatim
   * CSS length (`'1rem'`, `'1rem 2rem'`, `'clamp(…)'`). Omitted when unset.
   */
  gap?: BankaiGridGap;
  /**
   * `grid-auto-flow` — direction the grid auto-places items. Omitted when unset (browser default `row`).
   */
  flow?: BankaiGridFlow;
  /**
   * In-cell block-axis alignment (`align-items`). A native keyword ({@link BankaiGridAlign}) reflects as
   * `data-bankai-align`; any other string is a verbatim `align-items` value. Omitted when unset.
   */
  align?: BankaiGridAlign;
  /**
   * In-cell inline-axis alignment (`justify-items`). A native keyword ({@link BankaiGridJustify}) reflects
   * as `data-bankai-justify`; any other string is a verbatim `justify-items` value. Omitted when unset.
   */
  justify?: BankaiGridJustify;
  /**
   * Render as `inline-grid` instead of `grid`.
   *
   * @default false
   */
  inline?: boolean;
}

// Named members of the open `align`/`justify` props — a value in these sets reflects as its `data-*`
// (theme-mapped keyword); anything else takes the verbatim `--bankai-grid-*` escape hatch. Module scope,
// so allocated once (not per instance). Grid `justify` (`justify-items`) has no `baseline` keyword.
const NAMED_ALIGNS = new Set<string>(['start', 'end', 'center', 'baseline', 'stretch']);
const NAMED_JUSTIFIES = new Set<string>(['start', 'end', 'center', 'stretch']);

// Resolve a `columns`/`rows` prop to a `grid-template-*` value. A number — or a bare-numeric string,
// since a static `columns="3"` arrives as `'3'` — is a count of equal tracks, expanded to
// `repeat(<n>, minmax(0, 1fr))`; the `minmax(0, 1fr)` (not a bare `1fr`) lets tracks shrink below
// content min-size, avoiding grid blowout. Any other string is a verbatim template value.
// Grid-only (no other component reuses it), so it lives at module scope — allocated once, not per
// instance — rather than in `internal/` (SPEC.md §4.11 share-or-hoist rule).
function resolveTracks(value: BankaiGridColumns): string {
  if (typeof value === 'string' && !/^\d+$/u.test(value)) {
    return value;
  }

  return `repeat(${Number(value)}, minmax(0, 1fr))`;
}

// Resolve an `areas` prop to a `grid-template-areas` value. An array is the ergonomic form: each
// entry is one row, auto-wrapped in quotes (`['a b', 'c d']` → `"a b" "c d"`). A string is verbatim,
// so it must already carry its own quotes. Grid-only → module scope (see `resolveTracks`).
function resolveAreas(value: BankaiGridAreas): string {
  return Array.isArray(value) ? value.map((row) => `"${row}"`).join(' ') : value;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { resolveGap } from '../../internal/spacing';

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

// A named keyword reflects verbatim as its `data-*` attribute (theme-mapped); any other value takes
// the `--bankai-grid-*` escape hatch below, so `data-*` is omitted for it (Vue drops `undefined`).
const dataAlign = computed(() =>
  align !== undefined && NAMED_ALIGNS.has(align) ? align : undefined,
);
const dataJustify = computed(() =>
  justify !== undefined && NAMED_JUSTIFIES.has(justify) ? justify : undefined,
);

// `gap` resolves via `internal/spacing` (shared with `BankaiFlex`, SPEC.md §4.11); `columns`/`rows`
// and `areas` use the Grid-only module-scope resolvers above; a *verbatim* (non-named) `align`/`justify`
// rides `--bankai-grid-align`/`-justify`, applied by the theme's base rule.
// Unset props are omitted (Vue drops an `undefined` style value), so the theme's `:where()` fallback
// (`none`/`normal`) applies and the DOM stays clean.
const rootStyle = computed<CSSProperties>(() => ({
  '--bankai-grid-columns': columns === undefined ? undefined : resolveTracks(columns),
  '--bankai-grid-rows': rows === undefined ? undefined : resolveTracks(rows),
  '--bankai-grid-areas': areas === undefined ? undefined : resolveAreas(areas),
  '--bankai-grid-gap': gap === undefined ? undefined : resolveGap(gap),
  '--bankai-grid-align': align !== undefined && !NAMED_ALIGNS.has(align) ? align : undefined,
  '--bankai-grid-justify':
    justify !== undefined && !NAMED_JUSTIFIES.has(justify) ? justify : undefined,
}));

// `data-bankai-inline` is a presence flag (empty string when on, absent when off) so the CSS can
// match `[data-bankai-inline]`. `flow` reflects its value verbatim, or is omitted when unset
// (Vue drops `undefined`/`null` attribute bindings), keeping the DOM clean.
const dataInline = computed<'' | undefined>(() => (inline ? '' : undefined));

defineSlots<BankaiGridSlots>();
</script>

<template>
  <component
    :is="as"
    class="bankai-grid"
    data-part="root"
    :data-bankai-flow="flow"
    :data-bankai-align="dataAlign"
    :data-bankai-justify="dataJustify"
    :data-bankai-inline="dataInline"
    :style="rootStyle"
  >
    <slot />
  </component>
</template>
