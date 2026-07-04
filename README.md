<div align="center">

<img src="./assets/logo.svg" alt="bankai-vue" width="120" height="120" />

# bankai-vue

**The agnostic, accessibility-first Vue 3 component framework.**

Guiding defaults you can fully restyle · bring your own CSS framework · native modern HTML · first-class TypeScript · MIT, forever.

</div>

---

> [!WARNING]
> **Status: early development — "Shikai" phase (pre-`0.1.0`). Not yet released.**
> The API is being designed in the open. Watch/star to follow along; nothing is on npm yet.

---

## Why this exists

In mid-2026, PrimeVue 5+ moved to a commercial licence. With it, the Vue ecosystem lost the one thing nothing else combined under MIT: a **design-agnostic, styled, enterprise-grade component suite with a first-class DataTable**.

The pieces that remain each cover only part of the gap — Reka UI is headless (you style everything), Nuxt UI is Tailwind-locked, and Vuetify / Quasar / Element Plus / Ant Design Vue / Naive UI each ship their own styling you have to fight. None of them lets you **bring your own CSS framework**, ships a **real DataTable**, _and_ stays **MIT**.

**bankai-vue** is built for exactly that intersection.

## What makes it different

- **Agnostic at every layer.** Use **Tailwind, Bootstrap, or UnoCSS** — your choice, none baked in. Swap the DataTable engine (TanStack opt-in). Pick your rendering mode over time.
- **Guiding, not bare.** Styled, "pro"-looking defaults out of the box — then override anything.
- **Native modern HTML first.** Overlays built on the native `<dialog>` element and the Popover API (top-layer, light-dismiss, `::backdrop`) instead of JS portals.
- **First-class TypeScript.** Generic components and typed slot scopes are headline features, not afterthoughts.
- **Accessibility is non-negotiable.** Targeting **WCAG 2.2 AA** (aligned with EN 301 549 / the European Accessibility Act), verified against real screen readers — so the component layer never blocks your audit.
- **Plain Vue and Nuxt** — SSR, SSG, and client-only, with hydration-safe IDs and a first-party Nuxt module.
- **Near-zero runtime dependencies.** A lean, audit-friendly `core`.
- **Vue-only, on purpose.** No React/Angular sisters. Focus is a feature.
- **MIT, forever.**

## Planned package family

| Package                      | Purpose                            |
| ---------------------------- | ---------------------------------- |
| `@bankai-vue/core`           | The components (unstyled — ships zero CSS)         |
| `@bankai-vue/theme-bankai`   | The signature theme: agnostic CSS + design tokens  |
| `@bankai-vue/nuxt`           | First-party Nuxt module            |
| `@bankai-vue/table-tanstack` | Opt-in TanStack data-table adapter |

_(Names reserved; not yet published.)_

## Non-goals

bankai-vue deliberately does **not**: support the Options API · ship other-framework sisters · use a copy-paste/scaffold-into-repo model · lock in or bundle any CSS framework or theming convention · bake broad convenience libs into `core`.

## Roadmap

- **Shikai (`0.x`)** — the initial released form. Built outward from what the (fully bankai-vue) docs site needs.
- **Bankai (`1.0`, targeted 2027)** — the ultimate form: full basics + DataTable + Tree, WCAG 2.2 AA with per-component conformance docs, plain-Vue + Nuxt SSR/SSG/client-only, system-aware dark mode, near-zero-dep core.
- **Later:** i18n / RTL · a theming token system · Vapor builds once interop matures.

See [`ROADMAP.md`](./ROADMAP.md) for the tactical component build order, and [`SPEC.md`](./SPEC.md) for the full, decided specification and rationale.

## Contributing

Early days — issues and discussions are the best way in. If you were displaced by the PrimeVue licence change and have opinions about what a worthy MIT successor looks like, this is the moment to weigh in.

## License

[MIT](./LICENSE) © [@Shinigami92](https://github.com/Shinigami92) and contributors.

---

<div align="center">
<sub>Released your Shikai. Bankai comes next.</sub>
</div>
