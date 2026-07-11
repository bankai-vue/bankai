import type { Component, ComponentInternalInstance } from 'vue';
import { toRaw } from 'vue';

/**
 * Resolve the component `BankaiLink` should render for internal (`to`) navigation, so a single link
 * primitive works across all three environments with no consumer wiring (SPEC.md §5.6):
 *
 * 1. an explicit `override` ({@link BankaiConfig.linkComponent}) always wins;
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
    // A `BankaiConfig` stored via `createBankai` is `reactive`, so a component set on `linkComponent`
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
 * "Different host" needs a reference origin, which isn't knowable at SSR render time. Resolution order,
 * so a client SPA gets it for free while SSR/SSG stays deterministic (no hydration mismatch):
 *
 * 1. an explicit `origin` ({@link BankaiConfig.linkOrigin}) — applied identically on server and client;
 * 2. else `window.location.origin` in the browser — accurate for a client-only SPA;
 * 3. else (SSR with no configured origin) — no reference host, so any absolute `http(s)`/`//` URL is external.
 */
export function isExternalHref(href: string, origin: string | undefined): boolean {
  const reference = origin ?? (typeof window === 'undefined' ? undefined : window.location.origin);

  if (reference === undefined) {
    // No reference host (SSR, no configured origin): any absolute http(s) or protocol-relative URL is external.
    return /^(?:https?:)?\/\//iu.test(href);
  }

  try {
    // Resolve against the reference so a relative href collapses to the same host (→ internal).
    const target = new URL(href, reference);
    return (
      (target.protocol === 'http:' || target.protocol === 'https:') &&
      target.host !== new URL(reference).host
    );
  } catch {
    // Unparseable href (or a malformed configured origin) — don't confidently call it external.
    return false;
  }
}
