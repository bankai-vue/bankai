# docs

The bankai-vue documentation site. Per [`SPEC.md` §4.15](../SPEC.md), it is built
**fully on Nuxt + bankai-vue itself** (not VitePress) — building the docs _is_ the
requirements-discovery process and the live SSR/SSG proof.

## Status: minimal scaffold

A single Nuxt landing page that dogfoods the primitives shipping today
(`BankaiText`, `BankaiFlex`, `BankaiGrid`, `BankaiButton`). The page uses raw
`<header>`/`<main>`/`<footer>` landmarks **on purpose** — each is annotated as a
replacement target for the shell components (`BankaiLayout`, `BankaiHeader`,
`BankaiContainer`, …) as they land in ROADMAP Phase 1. Watching the raw markup
shrink is the dogfooding signal that drives what gets built next.

## Develop

The docs consume the workspace packages from their built `dist/`, so build the
packages once before running the docs:

```sh
pnpm run build                 # build @bankai-vue/core + themes + nuxt module
pnpm --filter @bankai-vue/docs run dev
```

## Deploy

Pushed to GitHub Pages by [`.github/workflows/deploy-docs.yml`](../.github/workflows/deploy-docs.yml)
on every push to `main`: `nuxi generate` → static output → Pages. The project-page
base path (`/bankai/`) is injected via `NUXT_APP_BASE_URL`, so local `dev`/`generate`
stay at `/`.
