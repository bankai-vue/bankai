# @bankai-vue/theme-bankai

The signature **bankai-vue** theme — opinionated styled defaults for
[`@bankai-vue/core`](../core), delivered as framework-agnostic CSS.

`@bankai-vue/core` ships no styles; a theme is an opt-in layer that targets the
components' parts (the `bankai-button` class, `data-part`) and reflected state
(`data-variant`, `data-size`, native `:disabled`). System-aware light/dark is
built in via `color-scheme` + `light-dark()` — no JavaScript, no flash.

## Usage

```sh
pnpm add @bankai-vue/core @bankai-vue/theme-bankai
```

```ts
import '@bankai-vue/theme-bankai';
```

Every rule is authored at zero specificity (`:where()`), so you can override any
part with a single plain selector, or retune the design tokens (the
`--bankai-*` custom properties).

## Page surface

Importing the theme also paints the page: `base.css` applies the
`--bankai-color-bg` / `--bankai-color-fg` tokens to `html`, so the document adopts
the themed light/dark surface with no setup. It targets `html` (not `body`) so the
background fills the whole viewport canvas — including the overscroll area —
regardless of content height.

For an **embedded / micro-frontend** setup where the theme should not repaint the
host page, skip the default entry and compose only the pieces you need — the
tokens and the components — leaving `base.css` out:

```css
@import '@bankai-vue/theme-bankai/tokens.css';
@import '@bankai-vue/theme-bankai/components/index.css'; /* all components; no base.css → `html` untouched */
```

For finer granularity, import individual `components/<name>.css` files instead of
the barrel. (A future `BankaiApp` wrapper will scope the surface for this case.)
