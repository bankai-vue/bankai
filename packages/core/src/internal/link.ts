import type { Component, ComponentInternalInstance } from 'vue';
import { toRaw } from 'vue';

/**
 * Resolve the component `BankaiLink` should render for internal (`to`) navigation, so a single link
 * primitive works across all three environments with no consumer wiring (SPEC.md §5.6):
 *
 * 1. an explicit `override` ({@link BankaiLinkConfig.component}) always wins;
 * 2. else a globally-registered `NuxtLink` — preferred under Nuxt, since it adds prefetch, base-URL, and
 *    external-URL handling on top of `RouterLink`;
 * 3. else a globally-registered `RouterLink` (a plain vue-router app);
 * 4. else `undefined` — no router is installed, and the caller falls back to a native `<a>`.
 *
 * Detection reads the app's global component registry (`appContext.components`), which is exactly where
 * both `vue-router` (`app.use(router)`) and Nuxt register these — so core needs no dependency on either
 * lib, and never imports `vue-router` at runtime. Both PascalCase and kebab-case registration keys are
 * checked, since either spelling resolves the same component in a template.
 */
export function resolveLinkComponent(
  override: Component | string | undefined,
  instance: ComponentInternalInstance | null,
): Component | string | undefined {
  if (override !== undefined) {
    // A `BankaiConfig` stored via `createBankai` is `reactive`, so a component set on `link.component`
    // arrives here as a reactive proxy — binding that to `<component :is>` triggers Vue's "component was
    // made reactive" warning. Unwrap to the raw component. `toRaw` is a safe identity on a plain string
    // or a non-proxied component, so the auto-detected paths below are unaffected.
    return toRaw(override);
  }

  const components = instance?.appContext.components;
  if (components === undefined) {
    return undefined;
  }

  return (
    components.NuxtLink ??
    components['nuxt-link'] ??
    components.RouterLink ??
    components['router-link']
  );
}

/**
 * Whether an `href` leaves the current site, driving `BankaiLink`'s `data-bankai-external` hook.
 *
 * Only an absolute `http(s)` URL — or a protocol-relative `//host/…` one — can be external; a relative
 * path (`/x`, `x`, `#frag`), a `mailto:`/`tel:` scheme, or an unparseable value is treated as same-site
 * (those get marked external only via `external`/`target="_blank"`).
 *
 * Pure by design: the caller passes the reference `origin` and this function never reads `window`, so its
 * result depends only on its inputs. That's what keeps `data-bankai-external` hydration-safe — `BankaiLink`
 * withholds `window.location.origin` until after hydration (see its `referenceOrigin`), so SSR and the
 * client's first render feed the same `origin` here.
 *
 * @param href - the rendered anchor `href` to classify.
 * @param origin - the reference origin to resolve `href` against:
 *   - an explicit origin ({@link BankaiLinkConfig.origin}, or the post-hydration `window.location.origin`) →
 *     external iff the resolved `http(s)` host differs from it;
 *   - `undefined` (SSR, or the pre-hydration client render with no configured origin) → no reference host,
 *     so any absolute `http(s)`/`//` URL is treated as external.
 */
export function isExternalHref(href: string, origin: string | undefined): boolean {
  if (origin === undefined) {
    // No reference host: any absolute http(s) or protocol-relative URL is external.
    return /^(?:https?:)?\/\//iu.test(href);
  }

  try {
    // Resolve against the reference so a relative href collapses to the same host (→ internal).
    const target = new URL(href, origin);
    return (
      (target.protocol === 'http:' || target.protocol === 'https:') &&
      target.host !== new URL(origin).host
    );
  } catch {
    // Unparseable href (or a malformed configured origin) — don't confidently call it external.
    return false;
  }
}
