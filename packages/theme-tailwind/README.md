# @bankai-vue/theme-tailwind

> **Status: investigation / first shaping.** The token bridge plus the first
> components (`BankaiButton`, `BankaiFlex`, `BankaiText`) have landed and are
> still being shaped. Not published; API and token mapping are unstable.

A **per-framework** theme for [`@bankai-vue/core`](../core). Where the house
theme [`@bankai-vue/theme-bankai`](../theme-bankai) owns its own absolute design
tokens, this theme leans on **Tailwind**: it **remaps** `core`'s semantic spacing
scale onto Tailwind's `--spacing`, and styles components with **`@apply`** — so
your Tailwind design language drives them.

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
`BankaiFlex`'s `:gap="4"`) is a _semantic scale step_ that resolves to a
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

## Page surface

Importing the theme also paints the page: `base.css` applies the
`--bankai-color-bg` / `--bankai-color-fg` tokens (bridged onto your Tailwind
`--color-*` palette) to `html`, so the document gets the stock-Tailwind
application-UI surface — a themed page rather than an unpainted `<html>`. It targets
`html` so the background fills the whole viewport canvas (including the overscroll
area), and lives in `@layer base`, so a plain `bg-*` / `text-*` utility still
overrides it the Tailwind way.

For an **embedded / micro-frontend** setup where the theme should not repaint the
host page, compose only the pieces you need — leaving `base.css` out:

```css
@import "tailwindcss";
@import "@bankai-vue/theme-tailwind/tokens.css";
@import "@bankai-vue/theme-tailwind/components/index.css"; /* all components; no base.css → `html` untouched */
```

For finer granularity, import individual `components/<name>.css` files instead of
the barrel. (A future `BankaiApp` wrapper will scope the surface for this case.)

## Spacing mapping

`tokens.css` maps **index-preserving**: `--bankai-space-n` == Tailwind `space-n`
(e.g. `--bankai-space-4` → `1rem`, same as `p-4`). It tracks Tailwind's `--spacing`,
so customizing that rescales the bankai steps too. Chosen over a value-preserving
mapping (which would keep the house theme's exact sizes) because a Tailwind theme
should speak Tailwind's spacing language — every step lands on Tailwind's grid. The
accepted trade-off: a component renders ~2× larger here than under `theme-bankai`.

## Token scope (spacing + color, so far)

`tokens.css` bridges two token families onto Tailwind's scale, in order of landing:

- **Spacing** — `--bankai-space-*` → Tailwind's `--spacing` (see above).
- **Color** — the foundation semantic roles (`--bankai-color-fg`, `-bg`, `-surface`,
  `-border`, `-primary`/`-primary-fg`, `-accent`) plus `--bankai-focus-ring`, each
  pointing at the consumer's Tailwind `--color-*`. This theme mimics the **stock
  Tailwind look** (the palette a default Tailwind project reaches for): the neutral
  family is Tailwind's `gray`, and the primary action + focus accent are `indigo`
  (e.g. `--bankai-color-primary → light-dark(var(--color-indigo-600), var(--color-indigo-500))`,
  with white text — `indigo-600` in light, the lighter `indigo-500` in dark, per the
  stock Tailwind convention). Values are authored in OKLCH; the `var()` fallback is the shade's
  exact Tailwind value so it renders even if a consumer trims it. Dark mode rides these
  tokens' `light-dark()` values off `color-scheme` — not Tailwind's class-based `dark:`.
  `BankaiText`'s tone colors consume this family through a `--bankai-text-color*` surface
  (`default`/`muted`/`subtle` alias `--bankai-color-fg`/`-fg-muted`/`-fg-subtle`), so they
  flip on `color-scheme` too and follow a consumer retuning the fg palette.

Not yet bridged and landing in follow-up PRs: **radius** and **font** (components
still `@apply rounded-md` / `font-sans` directly), and the **semantic status**
palette (`success`/`warning`/`danger`/`info`).

The two themes share the same **roles**, not the same **palette** — `theme-bankai` is
the house identity (its own slate/blue-based look), this one is deliberately stock
Tailwind (gray + indigo). They are not meant to be token-for-token interchangeable.

## Open questions

- **Component styling.** `components/{button,flex,text}.css` are styled with `@apply`, one file
  per component; further components follow the same per-file pattern.
- **Preflight interaction.** `@apply`'d rules stay zero-specificity (`:where()`), so Tailwind's
  Preflight button reset (an element selector, higher specificity) would beat them. `button.css`
  applies `border-solid` / an explicit outline style so it renders without Preflight; decide the
  Preflight stance (raise specificity, or document "load after / omit Preflight") before publishing.
