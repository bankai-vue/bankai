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
