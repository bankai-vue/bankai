<script lang="ts">
import type { VoidElementTagName } from '../../internal/dom';
import type { LiteralUnion } from '../../internal/types';
import type { CSSProperties, VNode } from 'vue';

// Styled via `@bankai-vue/theme-bankai` (`components/flex.css`), NOT inline styles.
// The layout props are reflected as `data-*` on the root and consumed by zero-specificity
// `:where()` rules, so a consumer's utility classes (Tailwind `inline-flex`, `flex-col`, …)
// win over the theme by ordinary class specificity (SPEC.md §4.4, §4.6) — an inline
// `display:flex` could not be overridden without `!important`. `gap` is a continuous value,
// so it rides a `--bankai-flex-gap` custom property that the same `:where()` rule reads.
// Trade-off: the layout needs the theme CSS (or an equivalent targeting `.bankai-flex`) loaded.
//
// `align`/`justify` are named-set-plus-escape-hatch (like BankaiText's styling props): a named short
// keyword reflects as `data-bankai-align`/`data-bankai-justify` (the theme maps it to a CSS value),
// while any other value — a native CSS keyword (`space-between`, `flex-start`), a `var()`/`calc()` —
// rides a `--bankai-flex-align`/`--bankai-flex-justify` custom property the theme's base `:where()`
// rule applies. So the widened types never lie: an accepted value always lands (SPEC.md §4.4, §4.6).

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
 * A short box-alignment keyword (`start`/`end` map to `flex-start`/`flex-end`) reflects as
 * `data-bankai-align`; any other string is a verbatim `align-items` value (`'flex-start'`,
 * `'first baseline'`, `'safe center'`, `'var(--x)'`), carried on `--bankai-flex-align`.
 */
export type BankaiFlexAlign = LiteralUnion<
  'start' | 'end' | 'center' | 'baseline' | 'stretch',
  string
>;

/**
 * Main-axis distribution of a {@link BankaiFlex} — maps to `justify-content`.
 * A short keyword (`between`/`around`/`evenly` map to `space-between`/`space-around`/`space-evenly`)
 * reflects as `data-bankai-justify`; any other string is a verbatim `justify-content` value
 * (`'space-between'`, `'flex-start'`, `'var(--x)'`), carried on `--bankai-flex-justify`.
 * (A short `stretch` keyword is intentionally omitted: it's a no-op on a flex main axis — pass it
 * verbatim if you really want it.)
 */
export type BankaiFlexJustify = LiteralUnion<
  'start' | 'end' | 'center' | 'between' | 'around' | 'evenly',
  string
>;

/**
 * `flex-wrap` of a {@link BankaiFlex}. Values are the native CSS keywords.
 */
export type BankaiFlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

/**
 * Spacing between {@link BankaiFlex} children — maps to `gap`.
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
 * `'clamp(0.5rem, 2vw, 1.5rem)'` for fluid gaps, etc.
 */
export type BankaiFlexGap = LiteralUnion<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> | number;

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
   * Cross-axis alignment (`align-items`). A short keyword ({@link BankaiFlexAlign}) reflects as
   * `data-bankai-align`; any other string is a verbatim `align-items` value. Omitted when unset.
   */
  align?: BankaiFlexAlign;
  /**
   * Main-axis distribution (`justify-content`). A short keyword ({@link BankaiFlexJustify}) reflects as
   * `data-bankai-justify`; any other string is a verbatim `justify-content` value (`'space-between'`,
   * `'flex-start'`, `'var(--x)'`). Omitted when unset.
   */
  justify?: BankaiFlexJustify;
  /**
   * Spacing between children (`gap`). A named t-shirt step (`'xs'`–`'xl'`, `--bankai-gap-<name>`) or a
   * number/bare-numeric string (a rem-based `--bankai-space-<n>` step); any other string is a verbatim
   * CSS length (`'1rem'`, `'clamp(…)'`, `'var(--x)'`). Omitted when unset.
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

// Named members of the open `align`/`justify` props — a value in these sets reflects as its `data-*`
// (theme-mapped short keyword); anything else takes the verbatim `--bankai-flex-*` escape hatch. These
// mirror the theme's `[data-bankai-*]` rules; the reflect split itself is shared (SPEC.md §4.11).
// Module scope, so allocated once (not per instance).
const NAMED_ALIGNS = new Set<string>(['start', 'end', 'center', 'baseline', 'stretch']);
const NAMED_JUSTIFIES = new Set<string>(['start', 'end', 'center', 'between', 'around', 'evenly']);
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { reflectNamed } from '../../internal/reflect';
import { resolveGap } from '../../internal/spacing';

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
defineOptions({ name: 'BankaiFlex', inheritAttrs: false });

// `inheritAttrs: false` + `v-bind="attrs"` FIRST on the root so the component-owned `data-part` and every
// reflected `data-bankai-*` can't be clobbered by a consumer fallthrough (SPEC.md §4.4, §5.6). `class`/
// `style` still merge, so consumer utility classes keep overriding the theme by ordinary specificity.
const attrs = useAttrs();

// A named short keyword reflects as its `data-*` attribute (theme-mapped); any other value rides the
// `--bankai-flex-*` escape hatch instead. `reflectNamed` (shared with `BankaiGrid`, SPEC.md §4.11)
// splits each prop into those two mutually-exclusive channels, the unused side being `undefined`.
const alignParts = computed(() => reflectNamed(align, NAMED_ALIGNS));
const justifyParts = computed(() => reflectNamed(justify, NAMED_JUSTIFIES));

// The style object carries the escape-hatch values on custom properties the theme's base `:where()`
// rule applies: `gap` (resolved via `internal/spacing`, shared with `BankaiGrid` — SPEC.md §4.11) always
// rides `--bankai-flex-gap`; a *verbatim* (non-named) `align`/`justify` rides `--bankai-flex-align`/
// `-justify`. Each entry is `undefined` unless set, so when all are unset Vue emits no `style` attribute
// and the theme's `normal` fallback applies.
const rootStyle = computed<CSSProperties>(() => ({
  '--bankai-flex-gap': gap === undefined ? undefined : resolveGap(gap),
  '--bankai-flex-align': alignParts.value.escape,
  '--bankai-flex-justify': justifyParts.value.escape,
}));

// `data-bankai-inline` is a presence flag (empty string when on, absent when off) so the CSS can
// match `[data-bankai-inline]`. `direction`/`wrap` reflect their value verbatim, or are omitted
// when unset (Vue drops `undefined`/`null` attribute bindings), keeping the DOM clean.
const dataInline = computed<'' | undefined>(() => (inline ? '' : undefined));

defineSlots<BankaiFlexSlots>();
</script>

<template>
  <component
    :is="as"
    v-bind="attrs"
    class="bankai-flex"
    data-part="root"
    :data-bankai-direction="direction"
    :data-bankai-align="alignParts.data"
    :data-bankai-justify="justifyParts.data"
    :data-bankai-wrap="wrap"
    :data-bankai-inline="dataInline"
    :style="rootStyle"
  >
    <slot />
  </component>
</template>
