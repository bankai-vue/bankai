# @bankai-vue/theme-tailwind

> **Status: investigation / first shaping.** The token bridge plus the first
> component (`BankaiButton`) are being shaped. Not published; API and token
> mapping are unstable.

A **per-framework** theme for [`@bankai-vue/core`](../core). Where the house
theme [`@bankai-vue/theme-bankai`](../theme-bankai) owns its own absolute design
tokens, this theme leans on **Tailwind**: it **remaps** `core`'s semantic spacing
scale onto Tailwind's `--spacing`, and styles components with **`@apply`** — so
your Tailwind design language drives them (`SPEC.md` §4.6, §5.4).

This is **not** a port of `theme-bankai`'s look. The goal is that components feel
like they belong in a stock Tailwind project — a default Tailwind look-and-feel
built from Tailwind's own utilities and scales — rather than reproducing the house
theme's exact sizes, colors, or radii.

**If your project uses Tailwind (or you want it to), this is the theme to reach
for.** Beyond just looking Tailwind-default out of the box, it is designed to be
Tailwind-native: built on Tailwind's tokens and utilities so it stays compatible
with your setup and is customizable the Tailwind way — retune your `@theme` /
config, or override with plain utilities, and the components follow. No separate
`--bankai-*` override surface to learn.

`@bankai-vue/core` ships no styles; a component's numeric spacing API (e.g.
an upcoming layout utility's `:gap="4"`) is a _semantic scale step_ that resolves to a
`--bankai-space-*` custom property. This package points those properties at
Tailwind's `--spacing`, instead of freezing them on the house 2px grid.

## Usage (planned)

Because components use `@apply`, this package is Tailwind **source**, not static
CSS — `@import` it from a Tailwind-processed stylesheet (not a JS `import`), so
`@apply` resolves against **your** Tailwind config:

```sh
pnpm add @bankai-vue/core @bankai-vue/theme-tailwind
```

```css
@import "tailwindcss";
@import "@bankai-vue/theme-tailwind";
```

## Spacing mapping

`tokens.css` maps **index-preserving**: `--bankai-space-n` == Tailwind `space-n`
(e.g. `--bankai-space-4` → `1rem`, same as `p-4`). It tracks Tailwind's `--spacing`,
so customizing that rescales the bankai steps too. Chosen over a value-preserving
mapping (which would keep the house theme's exact sizes) because a Tailwind theme
should speak Tailwind's spacing language — every step lands on Tailwind's grid. The
accepted trade-off: a component renders ~2× larger here than under `theme-bankai`.

## Token scope (spacing only, for now)

Today the only token bridged is **spacing** (`tokens.css`). That is the deliberate
first slice, not the finished token contract — the other `--bankai-*` tokens the
house theme exposes (**color**, **radius**, **focus ring**, **font**) are **not**
mirrored here yet and land in follow-up PRs.

Until then, components style those aspects directly with Tailwind utilities via
`@apply` (e.g. `button.css` uses `rounded-md`, `bg-slate-*`, `outline-blue-*`), so
they follow Tailwind's defaults instead of a `--bankai-*` override surface. This is
intentional given the "default Tailwind look-and-feel" goal above: a consumer
retunes them through their Tailwind config, not through bankai tokens. Expect the
override surface to differ from `theme-bankai` by design — the two themes are not
meant to be token-for-token interchangeable.

## Open questions

- **Component styling.** `components/button.css` is the first component, styled with `@apply`;
  further components follow the same per-file pattern.
- **Preflight interaction.** `@apply`'d rules stay zero-specificity (`:where()`), so Tailwind's
  Preflight button reset (an element selector, higher specificity) would beat them. `button.css`
  applies `border-solid` / an explicit outline style so it renders without Preflight; decide the
  Preflight stance (raise specificity, or document "load after / omit Preflight") before publishing.
