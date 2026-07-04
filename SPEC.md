# bankai-vue — Specification / RFC

> **Status:** Draft · **Version:** 0.0.1 (pre-Shikai) · **Last updated:** 2026-06-30
> **Author:** [@Shinigami92](https://github.com/Shinigami92) · **Org:** [`@bankai-vue`](https://github.com/bankai-vue)
> **Target:** earliest stable (`1.0` / "Bankai") in **2027**

---

## 1. Overview

**bankai-vue** is a guiding, design-agnostic, accessibility-first **Vue 3 component framework** with first-class TypeScript, native modern-HTML foundations, and a near-zero-dependency core.

It exists to fill a specific gap that opened in mid-2026: with PrimeTek moving PrimeVue 5+ to a commercial (PrimeUI) licence, the Vue ecosystem lost its only **design-agnostic, styled, enterprise-grade component suite with a first-class DataTable** under MIT. Reka UI (headless), Nuxt UI (Tailwind-locked), and the Material/own-CSS libraries (Vuetify, Quasar, Element Plus, Ant Design Vue, Naive UI) each cover part of the space, but none combines _agnostic styling + guiding defaults + enterprise data components + MIT_. That intersection is bankai-vue's reason to exist.

bankai-vue is **Vue-only by design**. There are no React/Angular sister projects. Focus is a feature, not a limitation — it is baked into the name.

### Naming & narrative

- Flagship package family: **`@bankai-vue/*`**.
- "Bankai" (卍解, _the ultimate released form_ in Bleach) is the `1.0` milestone. The pre-stable `0.x` era is the **"Shikai"** phase (the initial released form that precedes Bankai).
- "MegatronVue" is the launch-day positioning jab (the Megatron to PrimeVue's Optimus _Prime_) — marketing, not a package name.

---

## 2. Vision & principles

The through-line is **"agnostic at every layer."** The library owns the accessible, typed, native-HTML _shell_; the consumer chooses the engine at each layer:

| Layer             | Consumer chooses                                                 |
| ----------------- | ---------------------------------------------------------------- |
| CSS / styling     | Tailwind **or** Bootstrap **or** UnoCSS **or** custom            |
| Data-table engine | TanStack (opt-in adapter) **or** built-in **or** bring-your-own  |
| Rendering mode    | VDOM today; **Vapor** when interop matures                       |
| Dark mode wiring  | system preference, synced to the consumer's framework convention |

Guiding principles, in priority order when they conflict:

1. **Accessibility is non-negotiable** (WCAG 2.2 AA target — see §4.16).
2. **Native platform first** — prefer browser primitives over JS reimplementations.
3. **Agnostic, not opinionated-by-lock-in** — never force a CSS framework, data engine, or theme convention.
4. **Lean** — near-zero runtime deps in `core` (see §4.13).
5. **Typed** — generics and typed slots are headline features, not afterthoughts.

---

## 3. Operating model

- **Human guides the spec.** [@Shinigami92](https://github.com/Shinigami92) owns direction and final decisions.
- **AI accelerates research and implementation** — deep research on patterns, ARIA semantics, and edge cases; generating implementations under type-system guardrails.
- **Real assistive-technology testing is mandatory and not substitutable.** AI can guide toward correct ARIA, but cannot verify it. Every interactive component must be tested against **NVDA, JAWS, and VoiceOver** before it is considered done. AI-generated ARIA that "looks right" in code review but fails a real screen reader is treated as a defect, not a pass.

---

## 4. Requirements

Each requirement lists its **rationale** and any known **open risk**.

### 4.1 Component coverage

Ship complex components — **DataTable** and **Tree** — alongside the full set of basics (buttons, inputs, selects, checkboxes, radios, switches, sliders, tabs, tooltips, menus, accordions, dialogs, popovers, etc.).

- _Rationale:_ the enterprise DataTable is the single biggest hole in the MIT Vue commons; no headless foundation provides one.
- _Open risk:_ DataTable is the largest single build; see §5.3.

### 4.2 Guiding

Provide **styled, overridable defaults** — not bare headless primitives. Consumers should get a "pro" look out of the box, then override.

- _Rationale:_ the spec deliberately sits between headless (too much work for users) and locked-in design systems (too rigid).

### 4.3 Package-installed, not copy-paste

Components are imported from the published package, **not** scaffolded into the user's repo (the anti-shadcn position).

- _Rationale:_ updates, bug fixes, and security patches flow through the dependency, not manual re-copying.

### 4.4 Manual styling supported

Users can fully override and restyle components with their own CSS — **by construction, not by convention**.

- _Approach:_ components expose a stable root class plus a `data-*` **state anatomy** (reflected props/state) instead of baking styling into inline `style` declarations, and the theme packages apply every rule through **zero-specificity `:where()`** selectors. A plain consumer selector (specificity ≥ `0-1-0`) — hand-written CSS or a utility class (Tailwind/Bootstrap/UnoCSS) — therefore overrides the theme with **no `!important`**. Inline `style` (which no selector can beat) is used only to pass a _value_ a rule consumes (e.g. a CSS custom property such as `--bankai-*-gap`), never to apply the styling itself. `BankaiButton` is the shipped example: `.bankai-button` + `data-variant`/`data-size`, styled entirely through `:where()` in `@bankai-vue/theme-bankai`. This is what makes §4.6 real.

### 4.5 Tree-shakeable

Only imported components/code land in the consumer's bundle. Per-component entry points; side-effect-free packaging.

### 4.6 CSS-framework agnostic

**Tailwind, Bootstrap, and UnoCSS must each be freely usable** by the consumer (one at a time, their choice). The library must not bake in or conflict with any of them.

- _Rationale:_ this is the defining differentiator vs. every styled incumbent; it is what PrimeVue's unstyled/Pass-Through model uniquely offered and what left the MIT commons.
- _Approach:_ an unstyled/agnostic core with a typed **anatomy / parts** model so consumers can target internal parts with their CSS framework of choice.

### 4.7 Open source, MIT

The library is and remains **MIT**. (This is the entire reason the project exists; non-negotiable.)

### 4.8 First-class TypeScript

Generic components and **typed slot scopes** are headline features.

- _Toolchain plan:_
  - **Author on TS 6.0 strict defaults** from day one (greenfield = the stricter defaults are free wins, not migrations).
  - **Target TS 7.0 as the consumer baseline** (7.0 is a semantic-preserving port of 6.0, so types that check on 6.0 check identically on 7.0).
  - **Hybrid build:** native `tsc`/`tsgo` for fast `.ts` checks; **vue-tsc on the TS 6.x bridge for `.vue` SFC type-checking and `.d.ts` emit** until the native TypeScript Language Service API (which Volar/vue-tsc depend on) ships — signalled as post-7.0.
- _Open risk:_ **per-column cell slot typing** (e.g. `#cell-email` inferring `Row['email']`) is at the current edge of vue-tsc/Volar capability. Row-level generics (`#cell="{ row }"` → `row: T`) are safe today; per-column-keyed typing must be prototyped before being promised in the public API. Track `vuejs/language-tools#5381` for the native LS-API milestone.

### 4.9 Native modern HTML

Build overlays on the native **`<dialog>` element** and the **Popover API** (top-layer, light-dismiss, `::backdrop`, focus handling) rather than JS portals.

- _Rationale:_ by the 2027 horizon these are Baseline-safe; native top-layer avoids the z-index/portal machinery the headless incumbents maintain, and (see §4.18) avoids Teleport hydration headaches under SSR.
- _Open risk:_ **CSS anchor positioning** is the laggard; treat anchored/collision-aware placement as progressive enhancement with **Floating UI** (`@floating-ui/vue`) as the JS fallback.

### 4.10 Pluggable data-table engine

The DataTable's data engine is a **swappable adapter behind an internal `TableModel<T>` contract**. `@tanstack/vue-table` is the **opt-in** recommended adapter (shipped as a separate entry point / subpackage, e.g. `@bankai-vue/table-tanstack`, with TanStack as an optional peer dep), **never a hard dependency of core**. A lightweight built-in model covers simple cases; consumers may supply their own (e.g. server-driven).

- _Rationale:_ mirrors the agnostic philosophy at the data layer; keeps `core` lean and tree-shakeable.
- _Open risk:_ generic `T` must flow through the adapter to slot scopes without widening to `any`.

### 4.11 Composition API only

**No Options API support.** `<script setup>` throughout.

- _Rationale:_ removes the Options-API typing surface (the exact source of PrimeVue's weak types) and is a hard prerequisite for Vapor.
- _Vapor:_ architect **Vapor-ready** from the start (prop-getter / state-machine patterns over vnode-cloning/`asChild`; avoid VDOM-only APIs; `getCurrentInstance()` returns null in Vapor; Vapor custom-directive form). Ship **VDOM builds first**, add **Vapor builds when interop matures** (Vue 3.6 Vapor is feature-complete but beta as of mid-2026; slot-heavy third-party libraries are the weakest interop case today).

### 4.12 Runtime targets

Support **plain Vue (Vite SPA)** and **Nuxt** in **SSR, SSG, and client-only (`ssr: false`)** modes.

- _Deliverables:_ a first-party **Nuxt module** (auto-imports, SSR-safe registration) alongside the plain-Vue Vite plugin path.
- _Must-dos:_ **`useId()`-based hydration-stable IDs** everywhere ARIA relationships are minted (the #1 SSR breakage for component libraries); no `window`/`document` access at setup time; **Teleport-free native overlays** as an SSR advantage (browser top-layer instead of portals).

### 4.13 Near-zero runtime dependencies

`core` ships with minimal dependencies. Every dependency must earn its place via this **decision ladder** — stop at the first that works:

1. **Platform API** (e.g. `<dialog>`, Popover API, `ResizeObserver`, `addEventListener`)
2. **Vue core (3.5+)** (e.g. `useId`, `useTemplateRef`, `defineModel`, `onWatcherCleanup`)
3. **Reimplement a tiny helper** — own the code and types; no third-party source
4. **Narrow focused dependency** — peer where the ecosystem already has it (e.g. `@floating-ui/vue`)
5. **Broad convenience libs (VueUse)** — only as opt-in / peer, **never bundled into `core`**

- **Do not `noExternal` third-party source for things small enough to own.** Inlining source is redistribution: it carries the licence/attribution obligation _and_ the patch burden, kills consumer-side dedup, and hides the dependency from `npm audit`/SBOM tooling. Prefer **reimplementation** for the small composables (`onClickOutside`, `useEventListener`, `useResizeObserver`, `useElementBounding`, `useVModel`-style helpers) — several of which the native overlay bets (Popover light-dismiss, `<dialog>` focus trap) already make unnecessary.
- _Rationale:_ "near-zero deps" must survive an enterprise security review — _actually_ dependency-free, not dependency-hidden. Post-2025 supply-chain incidents make a lean graph a genuine selling point.

### 4.14 Tooling stack (locked)

- **pnpm workspaces** monorepo
- **Vitest** (unit / component testing)
- **Playwright** (e2e + cross-browser)
- **Changesets** (versioning / release)

### 4.15 Documentation site

A documentation website **fully built on bankai-vue + Nuxt from day one** (not VitePress).

- _Rationale:_ maximal dogfooding — building the docs site _is_ the requirements-discovery process and the live SSR/SSG proof; you feel every missing primitive immediately. Also satisfies the spirit of EN 301 549 Chapter 12 (accessible documentation) for free, provided the components are accessible.
- _Consequence to manage:_ early component priorities are driven by "what the docs shell needs" (layout, nav, theme toggle, code block, tabs) — sequence the roadmap accordingly.

### 4.16 Accessibility — WCAG 2.2 AA, EU-law anchored

Target **WCAG 2.2 Level AA**, framed as _"enables EN 301 549 / EAA / BFSG conformance for downstream users."_

- _Legal context (not legal advice):_ the **European Accessibility Act** (enforceable since 2025-06-28) and its German transposition **BFSG** (penalties up to €100k; microenterprise exemption) point to **EN 301 549** as the technical benchmark. EN 301 549 **v3.2.1** currently incorporates **WCAG 2.1 AA**; **v4.1.1 (expected 2026)** moves to **WCAG 2.2 AA** — likely the operative standard by the 2027 launch. The legal obligation falls on the _deployer_, not the library; bankai-vue's job is to ensure the component layer never blocks a user's audit.
- _Why 2.2 specifically:_ it is a near-superset of 2.1, future-proofs against v4.1.1, and its new criteria (focus appearance, focus not obscured, target size minimum, dragging alternatives) are _directly_ a component library's responsibility.
- _Deliverables:_ real NVDA/JAWS/VoiceOver testing (§3); **per-component accessibility conformance docs** (ACR / EN 301 549 Annex C style) as a procurement differentiator.

### 4.17 Behavior layer — built from scratch

The accessibility/behavior layer (keyboard nav, focus management, ARIA, controlled/uncontrolled state) is **built from scratch**, not borrowed from Zag/Ark or Reka.

- _Rationale:_ AI-assisted research + TS guardrails substantially lower the cost of _writing_ this layer; native platform features (`<dialog>`, Popover, `inert`) now cover much of what foundations used to polyfill; and full ownership keeps the project Vapor-pure and dependency-lean. The residual value of a foundation (crystallized AT-quirk knowledge) is reacquired via the mandatory real-AT-testing discipline (§3).
- _Escape hatch:_ revisit per-component if a specific widget proves genuinely too hard to get right (combobox/menu/tree keyboard semantics are the riskiest). **Floating UI** is the only narrow borrow currently sanctioned (positioning only).

### 4.18 System-aware dark mode with guaranteed no-flash (from day one)

- **Respect `prefers-color-scheme` by default** via pure CSS (`color-scheme` / `light-dark()`) — no JS, no flash, SSR/SSG-safe by construction.
- **Manual override, if present, is cookie-based and SSR-resolved** — the server renders the correct theme attribute in the initial HTML. **Never `localStorage`-gated before paint** (that is the classic dark-mode flash). Optional inline head script as the SSG/CDN fallback.
- **Set `color-scheme` correctly** so native `<dialog>`, `::backdrop`, Popover surfaces, form controls, and scrollbars theme automatically — the same lever that makes §4.9 native overlays theme-correct for free.
- **Mechanism stays CSS-framework-agnostic** — drive off `color-scheme` + a neutral `data-*` hook, documented to sync with Tailwind (`.dark`), Bootstrap (`data-bs-theme`), or UnoCSS. Do **not** hard-couple to one convention.
- _Note:_ the **token system** layered on top is intentionally **discover-as-you-go** (§7) — only the _mechanism_ is locked here.

---

## 5. Architecture summary

### 5.1 Layered model

A styled component library is two layers:

1. **Behavior** (state, keyboard, focus, ARIA) — **built from scratch** (§4.17), native-first.
2. **Presentation** (markup, styling, tokens, typed API, defaults) — **always bankai-vue's own**; this is the identity.

### 5.2 Overlays

Native-first: `<dialog>` + Popover API for top-layer/light-dismiss/backdrop/focus; Floating UI only for collision-aware positioning as progressive enhancement.

### 5.3 DataTable

Presentation + typed slots are bankai-vue's; the engine is a swappable adapter behind `TableModel<T>` (§4.10). TanStack adapter recommended and opt-in. This single component de-risks three requirements at once (adapter pattern, typed slots, native overlay for row detail) and is the recommended **first spike**.

### 5.4 Package family (initial)

- `@bankai-vue/core` — components; ships **zero CSS** (markup, behavior, typed API, `data-*` anatomy)
- `@bankai-vue/theme-bankai` — the signature theme: agnostic CSS that styles `core`'s anatomy via `:where()` (the house look)
- `@bankai-vue/nuxt` — Nuxt module
- `@bankai-vue/table-tanstack` — opt-in TanStack adapter
- (docs app — fully Nuxt + bankai-vue)

Themes are **separate, swappable CSS packages**; `core` stays unstyled. Design tokens (e.g. the `--bankai-space-*` spacing scale) live in the theme and are **theme-owned**, so a component's numeric spacing API (`BankaiFlex :gap="4"`) is a _semantic scale step_ whose absolute value the theme decides. Beyond the house `theme-bankai`, first-party **per-framework themes** are planned (e.g. `@bankai-vue/theme-tailwind`) that remap those tokens onto the consumer's framework scale (Tailwind's own `--spacing`), so the consumer's design language drives the components (§4.6).

### 5.5 Dependency posture

`core` near-zero deps via the §4.13 ladder. Sanctioned narrow/peer deps: `@floating-ui/vue` (positioning). Optional/peer only: VueUse.

---

## 6. Tooling & horizon

- Monorepo: **pnpm workspaces** + **Changesets**.
- Test: **Vitest** + **Playwright** + real AT (NVDA/JAWS/VoiceOver).
- Horizon: foundations chosen at **"Vue 3.6 beta / TS 7.0 RC now → stable by launch."** Earliest stable **2027**.

---

## 7. Roadmap

- **Shikai (`0.x`)** — initial released form. Driven by what the Nuxt docs shell needs first (layout, nav, theme toggle, code block, tabs), then outward to the full basics and the DataTable/Tree spike.
- **Bankai (`1.0`, 2027)** — stable public API, full basics + DataTable + Tree, WCAG 2.2 AA with per-component conformance docs, plain-Vue + Nuxt SSR/SSG/client-only, dark mode, near-zero-dep core.
- **Post-`0.1.0` (within `0.x`):** **i18n / RTL** — important, iterated after the initial release rather than blocking `0.1.0`.
- **Discover-as-you-go (deferred by design):** the **theming token system** — to be designed once real components exist, not in the abstract. _First slice landed:_ a rem-based, theme-owned **spacing scale** (`--bankai-space-*`) introduced with the layout utilities.
- **When interop matures:** **Vapor builds**.

---

## 8. Non-goals

bankai-vue deliberately does **not**:

- Support the **Options API**.
- Ship **React / Angular / other-framework** sisters — Vue-only, on purpose.
- Use a **copy-paste / scaffold-into-repo** distribution model (anti-shadcn).
- **Lock in or bundle** any CSS framework, data-table engine, or theming convention.
- Bake **broad convenience libraries** (VueUse) into `core`.
- Claim to be **"legally EAA-compliant"** as a library — it _enables_ downstream conformance; the legal obligation is the deployer's.

---

_This document is the living source of truth for bankai-vue's direction. It records what is **decided**; open questions, tracking, and getting-started steps live in issues, the project board, and the README/CONTRIBUTING docs._
