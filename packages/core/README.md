# @bankai-vue/core

> **Status: early development — "Shikai" phase (pre-`0.1.0`). Not yet released.**
> The API is being designed in the open; nothing is on npm yet. See the
> [repo root](https://github.com/bankai-vue/bankai) for the full picture.

The **agnostic, accessibility-first Vue 3 component framework** — the core
components, plus the config plugin and id composables they build on.

`@bankai-vue/core` ships **zero CSS**. It renders semantic, accessible markup with
stable component parts (a `bankai-<name>` class, `data-part`, and state reflected
as `data-bankai-*` / native attributes); a separate, opt-in **theme** package paints it.
Pair it with the signature [`@bankai-vue/theme-bankai`](../theme-bankai) or a
per-framework theme like [`@bankai-vue/theme-tailwind`](../theme-tailwind).

## Install

```sh
pnpm add @bankai-vue/core @bankai-vue/theme-bankai
```

Requires **Vue `^3.5`** (a peer dependency). ESM-only.

## Usage

```ts
// main.ts
import { createApp } from 'vue';
import { createBankai } from '@bankai-vue/core';
import '@bankai-vue/theme-bankai'; // opt-in styles — core itself ships none
import App from './App.vue';

createApp(App)
  .use(createBankai()) // optional; only needed to override defaults
  .mount('#app');
```

```vue
<script setup lang="ts">
import { BankaiButton, BankaiFlex, BankaiText } from '@bankai-vue/core';
</script>

<template>
  <BankaiFlex :gap="4" align="center">
    <BankaiText size="lg" weight="bold">Ready</BankaiText>
    <BankaiButton variant="solid">Bankai</BankaiButton>
  </BankaiFlex>
</template>
```

## What's here

The public surface today (growing per [`ROADMAP.md`](../../ROADMAP.md)):

**Components** — each with fully typed props/slots:

- `BankaiButton` — `variant` / `size` / `type` / `disabled`
- `BankaiFlex` — flexbox layout helper (`direction` / `align` / `justify` / `gap` / `wrap`)
- `BankaiText` — polymorphic (`as`) text primitive (`size` / `weight` / `tone` / `truncate`)

**Config** — an optional, per-app (SSR-safe) plugin:

- `createBankai(options?)` — install to configure the library app-wide
- `useBankaiConfig()` — read/mutate the reactive config during `setup`

**Composables** — hydration-safe id generation for ARIA wiring:

- `useBankaiId()` / `usePrefixedId()`

Plus `version`. Every component is also reachable via a per-entry subpath (e.g.
`@bankai-vue/core/components/button/BankaiButton`) for maximally granular imports;
tree-shaking via the barrel is the common path.

## Design principles

- **Agnostic** — core ships no styles and locks in no CSS framework; a theme is a swappable layer.
- **Accessibility-first** — targeting **WCAG 2.2 AA**, native modern HTML over JS reimplementations.
- **First-class TypeScript** — typed props and slot scopes are headline features.
- **Near-zero runtime dependencies** — a lean, audit-friendly core; `vue` is the only peer.

See [`SPEC.md`](../../SPEC.md) for the decided specification and rationale.

## License

[MIT](../../LICENSE) © [@Shinigami92](https://github.com/Shinigami92) and contributors.
