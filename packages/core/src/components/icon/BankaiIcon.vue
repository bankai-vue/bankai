<script lang="ts">
import type { LiteralUnion } from '../../internal/types';
import type { CSSProperties, VNode } from 'vue';

// Ships no CSS and no icon set (SPEC.md §4.9, §4.13):
// BankaiIcon is a consistent box + accessibility layer over WHATEVER icon mechanism the consumer already
// uses — an inline `<svg>` (or third-party icon component) in the default slot, a CSS icon class (a font
// set like Font Awesome, or a mask-based set like UnoCSS `i-*` / Iconify-CSS) via `class`, or a `name`
// token resolved to a class. The consumer picks the input style; the component owns sizing, the 1:1
// aspect box, `currentColor` alignment, and the a11y wiring — never the glyph.
// `size` is a named set plus an escape hatch: a named `xs`–`xl` step reflects as `data-bankai-size` (the
// theme maps it to a `--bankai-icon-size-*` token), while any other value rides the `--bankai-icon-size`
// custom property the theme's zero-specificity base rule applies — so it stays at a specificity a
// consumer's utility class can override (SPEC.md §4.4, §4.6).

/**
 * Element the {@link BankaiIcon} root renders as — the two conventional icon hosts, generic `'span'`
 * (default) and `'i'` (the classic icon-font element). Any other tag string is still accepted.
 */
export type BankaiIconElement = 'span' | 'i';

/**
 * Element the {@link BankaiIcon} root renders as (`as` prop).
 * Suggests {@link BankaiIconElement} (defaults to `'span'`); any other tag string is still accepted.
 */
export type BankaiIconAs = LiteralUnion<BankaiIconElement, string>;

/**
 * Size of a {@link BankaiIcon}.
 * A named `xs`–`xl` t-shirt step reflects as `data-bankai-size` and resolves to the theme's
 * `--bankai-icon-size-*` tokens; any other string is a verbatim CSS `font-size` (`'20px'`, `'1.5em'`,
 * `'var(--x)'`) — which drives the 1em box, so it scales inline SVG and em-based mask/font glyphs alike.
 */
export type BankaiIconSize = LiteralUnion<'xs' | 'sm' | 'md' | 'lg' | 'xl', string>;

/**
 * Slots of a {@link BankaiIcon}.
 */
export interface BankaiIconSlots {
  /**
   * The icon markup — an inline `<svg>`, a third-party icon component (e.g. Iconify's `<Icon>` /
   * `<iconify-icon>`), an `<img>`, or an SVG sprite `<use>`. The wrapper adds the box + a11y around it.
   */
  default?: () => VNode[];
}

/**
 * Props for {@link BankaiIcon}.
 */
export interface BankaiIconProps {
  /**
   * Element to render as. Polymorphic — suggests {@link BankaiIconElement} (`'span'` / `'i'`); any tag
   * string is also accepted.
   *
   * @default 'span'
   */
  as?: BankaiIconAs;
  /**
   * Icon token, applied as a class on the root — the ergonomic, reactive counterpart to writing the
   * class yourself. With no resolver it is applied verbatim (so `name="i-mdi-home"` works out of the box
   * for UnoCSS / Iconify-CSS); set `config.icon.class` to map a bare token (e.g. `'mdi:home'`) to your
   * setup's class. Omit it and use the default slot for an inline `<svg>` / icon component instead.
   */
  name?: string;
  /**
   * Icon size. A named `xs`–`xl` step (`--bankai-icon-size-*`) reflects as `data-bankai-size`; any other
   * string is a verbatim CSS `font-size` driving the 1em box.
   * Omitted when unset (inherits the ambient font size, so the icon matches surrounding text).
   */
  size?: BankaiIconSize;
  /**
   * Accessible name for a MEANINGFUL icon: sets `role="img"` + `aria-label`, so assistive tech announces
   * it. Leave unset for a DECORATIVE icon — the default — and the root is hidden from assistive tech with
   * `aria-hidden` (unless you supply your own `aria-label`/`aria-labelledby`/`title`/`role="img"`).
   */
  label?: string;
  /**
   * Opt out of the default 1:1 (square) box and let the icon keep its own aspect ratio (height driven by
   * `size`, width intrinsic). By default the root is a square box and non-square content is centered and
   * contained (letterboxed) rather than distorted. Reflected as `data-bankai-square="false"` when set.
   *
   * @default false
   */
  noSquare?: boolean;
}

// Named members of `size` — a value here reflects as `data-bankai-size` (theme-mapped); anything else
// takes the verbatim `--bankai-icon-size` escape hatch. Module scope, so allocated once.
const NAMED_ICON_SIZES = new Set<string>(['xs', 'sm', 'md', 'lg', 'xl']);
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useBankaiConfig } from '../../config';
import { reflectNamed } from '../../internal/reflect';

const { as = 'span', name, size, label, noSquare = false } = defineProps<BankaiIconProps>();

/**
 * An agnostic icon wrapper. Renders whatever icon mechanism the consumer provides — an inline `<svg>` /
 * icon component in the default slot, a CSS icon class via `class`, or a `name` token resolved to a class
 * — inside a consistent box: a square 1:1 frame (opt out with `no-square`), `size` reflected on the root
 * as `data-bankai-size` (named) or `--bankai-icon-size` (verbatim) for the theme's `:where()` rules, and
 * `currentColor` alignment. Decorative by default (`aria-hidden`); pass `label` for a meaningful icon
 * (`role="img"` + `aria-label`). Ships no CSS and no icons of its own.
 */
defineOptions({ name: 'BankaiIcon', inheritAttrs: false });

// `inheritAttrs: false` + `v-bind="attrs"` FIRST on the root so the component-owned `data-part` and every
// reflected `data-bankai-*` can't be clobbered by a consumer fallthrough (SPEC.md §4.4, §5.6). `class`/
// `style` still merge, so a consumer utility class (or their own icon class) keeps overriding by ordinary
// specificity.
const attrs = useAttrs();

const config = useBankaiConfig();

// `name` becomes a class on the root: through `config.icon.class` if the consumer registered one (mapping a
// bare token to their setup's class), else verbatim (so `i-mdi-home` / a font class just works). The raw
// `class` attribute is the always-available equivalent; `name` is the same seam, resolver-aware.
const resolvedClass = computed<string | undefined>(() =>
  name === undefined ? undefined : (config.icon.class?.(name) ?? name),
);

// Split `size` into its `data-bankai-size` (named keyword) vs `--bankai-icon-size` (verbatim escape hatch)
// channels via the shared `reflectNamed` helper (SPEC.md §4.4/§4.6). Vue drops the `undefined` side.
const sizeParts = computed(() => reflectNamed(size, NAMED_ICON_SIZES));

// The escape-hatch size rides a custom property the theme's base `:where(.bankai-icon)` rule applies. Set
// only for a non-named value; when unset the object is all-`undefined`, so Vue emits no `style` attribute.
const rootStyle = computed<CSSProperties>(() => ({
  '--bankai-icon-size': sizeParts.value.escape,
}));

// `data-bankai-square` is reflected only in the opt-out case (`'false'`), keeping the theme's common
// selector positive — the square 1:1 box is the unmarked default.
const dataSquare = computed<'false' | undefined>(() => (noSquare ? 'false' : undefined));

// Accessibility. `label` names a MEANINGFUL icon (`role="img"` + `aria-label`); with no `label` the icon is
// DECORATIVE and hidden from assistive tech (`aria-hidden`). These are bound after `v-bind="attrs"`, so each
// must fall back to the consumer's own value rather than emit a clobbering `undefined` — otherwise a
// consumer's `aria-label`/`role`/`aria-hidden` (used without the prop) would be silently erased. The `label`
// prop still wins when set; an explicit consumer labeling (`aria-label`/`aria-labelledby`/`title`/
// `role="img"`, or any `aria-hidden`) suppresses the decorative default.
const hasConsumerLabel = computed<boolean>(
  () =>
    'aria-label' in attrs || 'aria-labelledby' in attrs || 'title' in attrs || attrs.role === 'img',
);
// A meaningful icon carries a name — either the `label` prop or a consumer-supplied labeling attribute;
// a decorative one has neither and is hidden from assistive tech.
const meaningful = computed<boolean>(() => label !== undefined || hasConsumerLabel.value);
const role = computed<string | undefined>(() =>
  label === undefined ? (attrs.role as string | undefined) : 'img',
);
const ariaLabel = computed<string | undefined>(
  () => label ?? (attrs['aria-label'] as string | undefined),
);
const ariaHidden = computed<string | undefined>(() =>
  'aria-hidden' in attrs
    ? (attrs['aria-hidden'] as string | undefined)
    : meaningful.value
      ? undefined
      : 'true',
);

defineSlots<BankaiIconSlots>();
</script>

<template>
  <component
    :is="as"
    v-bind="attrs"
    :class="['bankai-icon', resolvedClass]"
    data-part="root"
    :data-bankai-size="sizeParts.data"
    :data-bankai-square="dataSquare"
    :style="rootStyle"
    :role="role"
    :aria-label="ariaLabel"
    :aria-hidden="ariaHidden"
  >
    <slot />
  </component>
</template>
