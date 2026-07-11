<script lang="ts">
import type { BankaiLinkTo } from './registry';
import type { VNode } from 'vue';

// Ships no CSS (SPEC.md §7):
// consumers style it through the exposed parts (`data-part`, the `bankai-link` class) and the reflected
// state (`data-bankai-external`). The active/exact-active state comes from the underlying router link's
// own classes (`router-link-active` / `router-link-exact-active`), which fall through onto the root.

export type { BankaiLinkTo } from './registry';

/**
 * Slots of a {@link BankaiLink}.
 */
export interface BankaiLinkSlots {
  /**
   * Link content — the label, and optionally an icon.
   */
  default?: () => VNode[];
}

/**
 * Props for {@link BankaiLink}.
 *
 * `to` and `href` are **mutually exclusive**: they name the destination two different ways — router
 * navigation vs. a raw anchor — so setting both is a type error (a discriminated union with `never` on
 * the opposite branch, per the SPEC.md §5.6 no-silent-death stance), rather than silently dropping `to`.
 * Neither is required: a link with neither renders a bare `<a>` (e.g. a JS-driven control).
 */
export type BankaiLinkProps = {
  /**
   * Force a plain `<a>` even when `to` is set and a router is available — e.g. to leave the SPA for a
   * full-page navigation. Also marks the link external via `data-bankai-external` (independent of the
   * router path), so it works alongside either `to` or `href`.
   *
   * @default false
   */
  external?: boolean;
} & (
  | {
      /**
       * Internal navigation target, handed to the resolved router link (`NuxtLink`, else `RouterLink`).
       * When no router is installed, a `string` `to` degrades to a plain `<a :href>`; an object `to` needs
       * a router (there is nothing sensible to put in `href` without one).
       *
       * Its type is a router-agnostic fallback by default and vue-router's `RouteLocationRaw` once the
       * `@bankai-vue/core/vue-router` types augmentation is active — see {@link BankaiLinkTo}.
       */
      to?: BankaiLinkTo;
      href?: never;
    }
  | {
      /**
       * Explicit anchor target. Always renders a native `<a href>`, never a router link — use it for
       * external URLs, `mailto:`/`tel:`, fragments, and downloads.
       */
      href?: string;
      to?: never;
    }
);
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, useAttrs } from 'vue';
import { useBankaiConfig } from '../../config';
import { resolveLinkComponent } from '../../internal/link';

const { to, href, external = false } = defineProps<BankaiLinkProps>();

/**
 * A link primitive that renders the right thing for its environment with no consumer wiring: a globally
 * registered `NuxtLink` (preferred, under Nuxt) or `RouterLink` (vue-router) for internal `to` navigation,
 * and a native `<a>` when there is no router or the target is external (`href`/`external`/`target="_blank"`).
 * Exposes a `bankai-link` class plus `data-part`/`data-bankai-external` hooks and merges consumer
 * `class`/`style`/attributes onto the root; ships no CSS of its own. Override the internal-link component
 * or the `rel="noopener"` default via {@link BankaiConfig}.
 */
defineOptions({ name: 'BankaiLink', inheritAttrs: false });

const config = useBankaiConfig();
const instance = getCurrentInstance();
const attrs = useAttrs();

// The component to use for internal navigation (`undefined` → no router installed, fall back to `<a>`).
const routerComponent = computed(() => resolveLinkComponent(config.linkComponent, instance));

// Render an `<a>` unless there is a genuine internal `to` navigation AND a router to handle it.
const usesRouter = computed(
  () => to !== undefined && href === undefined && !external && routerComponent.value !== undefined,
);

// The tag/component the root renders as: the resolved router link, or a native anchor.
const tag = computed(() => (usesRouter.value ? routerComponent.value : 'a'));

// `href` for the native-anchor path. An explicit `href` wins; otherwise a `string` `to` degrades to it
// (an object `to` has no meaningful `href` without a router, so the anchor renders without one). Unset
// while a router handles `to`, so Vue drops the binding.
const anchorHref = computed<string | undefined>(() =>
  usesRouter.value ? undefined : (href ?? (typeof to === 'string' ? to : undefined)),
);

// `to` is only forwarded when a router link handles it (Vue drops the `undefined` binding on `<a>`).
const routerTo = computed(() => (usesRouter.value ? to : undefined));

// Auto-add `rel="noopener noreferrer"` for a new-tab link (a security default; `window.opener` reach-back),
// unless the consumer set their own `rel` or opted out via `config.linkNoopener`. Applies to router links
// too, since they also render an `<a>` and can open a new tab.
const relValue = computed<unknown>(() => {
  if (attrs.rel != null) {
    return attrs.rel;
  }

  return config.linkNoopener && attrs.target === '_blank' ? 'noopener noreferrer' : undefined;
});

// A presence flag (`''` when on, absent when off) marking an external destination — a themeable hook
// (e.g. an outbound icon). Set for a forced `external` or a new-tab target only; a raw `href` is NOT
// assumed external (URL-sniffing would be non-local guesswork — SPEC.md §5.6), so an internal
// full-page `href` stays unmarked. Declare `external` (or `target="_blank"`) to opt a link in.
const dataExternal = computed<'' | undefined>(() =>
  external || attrs.target === '_blank' ? '' : undefined,
);

defineSlots<BankaiLinkSlots>();
</script>

<template>
  <component
    :is="tag"
    class="bankai-link"
    data-part="root"
    v-bind="attrs"
    :to="routerTo"
    :href="anchorHref"
    :rel="relValue"
    :data-bankai-external="dataExternal"
  >
    <slot />
  </component>
</template>
