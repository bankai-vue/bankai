# Contributing to bankai-vue

Thanks for your interest in bankai-vue! This guide covers how to set up the repo,
the day-to-day scripts, and the expectations for a change to be merge-ready.

> [!IMPORTANT]
> [`SPEC.md`](./SPEC.md) is the **authoritative source of truth** for every
> decision on this project. When something here and the spec disagree, the spec
> wins — and please open an issue so we can fix this document.

---

## Prerequisites

The required tool versions live in the root [`package.json`](./package.json) —
treat it as the single source of truth. This guide intentionally avoids repeating
version numbers so it doesn't go stale.

- **Node.js** — see the `engines.node` range in `package.json`.
- **pnpm** — pinned via the `packageManager` field, so you don't install a
  specific version by hand. Just make pnpm available and it self-selects the
  pinned version:
  - **Recommended:** `npm install -g pnpm` — pnpm 9+ then re-execs the pinned
    version automatically inside this repo.
  - **Alternative:** Corepack (`corepack enable pnpm`). Note that recent Node
    releases no longer bundle Corepack, so you may need to install it first
    (`npm install -g corepack`).
- **Git**.
- **GitHub CLI (`gh`)** — optional; only needed to regenerate visual-regression
  baselines (see [Visual regression](#visual-regression)).

This repo is a **pnpm workspaces monorepo**; do not use npm or yarn.

---

## Setup

```bash
# 1. Clone
git clone git@github.com:bankai-vue/bankai.git
cd bankai

# 2. Install dependencies
pnpm install

# 3. Install the browser used by the tests (once per machine)
pnpm exec playwright install chromium
```

That's it — the same steps work identically on Windows, macOS, and Linux. Line
endings are normalized to LF via `.gitattributes`, so no CRLF churn across
platforms.

To sanity-check your setup, run the one-shot gate locally:

```bash
pnpm preflight
```

`preflight` reinstalls dependencies and then runs `format:check`, `lint`,
`typecheck`, `build`, and `test` in sequence — the same gate CI enforces. It does
**not** run the end-to-end tests; run those separately with `pnpm test:e2e` when
your change touches e2e or `@visual` behavior.

---

## MCP servers (optional — for AI-assisted development)

The repo ships an [`.mcp.json`](./.mcp.json) that MCP-aware clients (e.g. Claude
Code) auto-discover. It exposes three [Playwright MCP](https://github.com/microsoft/playwright-mcp)
servers — `playwright-chromium`, `playwright-firefox`, and `playwright-webkit` —
so an AI agent can drive a **real** browser on each engine against the running
playground, matching our real-browser testing philosophy.

This is entirely optional and not part of any gate. If you use it:

```bash
# 1. Start the playground (defaults to http://localhost:5173)
pnpm dev

# 2. One-time: install the browser binaries the MCP servers use.
#    These are separate from the test browser installed in Setup.
pnpx @playwright/mcp@latest install-browser chrome-for-testing
pnpx @playwright/mcp@latest install-browser firefox
pnpx @playwright/mcp@latest install-browser webkit
```

The servers write snapshot/console artifacts into `.playwright-mcp/`, which is
git-ignored.

---

## Repository layout

> [!NOTE]
> The project is in its early "Shikai" phase — this layout is a **scaffold** and
> will keep evolving as real components land. Expect folders and packages to be
> added or rearranged.

```
packages/
  core/            @bankai-vue/core           — the components (ships zero CSS)
  theme-bankai/    @bankai-vue/theme-bankai   — the signature theme: agnostic CSS + design tokens
  nuxt/            @bankai-vue/nuxt           — first-party Nuxt module
  table-tanstack/  @bankai-vue/table-tanstack — opt-in TanStack DataTable adapter
playground/        private Vite + Vue 3 SPA — manual testing & the DataTable spike host
docs/              reserved stub for the future (Nuxt + bankai-vue) documentation site
```

Publishable packages are ESM-only, side-effect-free, and expose **per-component
entry points** for tree-shaking (`SPEC.md` §4.5). `core` never takes a hard
runtime dependency — every dependency must earn its place via the §4.13
dependency ladder.

---

## Scripts

Run these from the repo root.

| Script | What it does |
| --- | --- |
| `pnpm build` | Builds every publishable package. |
| `pnpm dev` | Starts the playground dev server. |
| `pnpm typecheck` | Type-checks the repo (both halves of the hybrid check — see below). |
| `pnpm typecheck:ts` | Type-checks `.ts` files. |
| `pnpm typecheck:vue` | Type-checks `.vue` SFCs. |
| `pnpm test` | Runs unit/component tests in a real browser. |
| `pnpm test:watch` | The same, in watch mode. |
| `pnpm test:e2e` | Runs the end-to-end tests. |
| `pnpm test:update-visual-snapshots <pr>` | Regenerates a PR's visual baselines across all OSes (see below). |
| `pnpm lint` / `pnpm lint:fix` | Lints (and auto-fixes). |
| `pnpm format` / `pnpm format:check` | Formats (and checks) code. |
| `pnpm preflight` | Reinstalls deps, then runs the full merge gate (`format:check` → `lint` → `typecheck` → `build` → `test`). Excludes e2e. |
| `pnpm clean` | Removes all git-ignored files (`git clean -fdx`), keeping `.claude/` and `local/`. |
| `pnpm changeset` | Records a release intent (see Changesets below). |

### Why two type-checkers?

Until the native TypeScript Language Service API that Volar/vue-tsc depend on
ships, we run a **hybrid** (see `SPEC.md` §4.8 for the full rationale, and
tracking issue `vuejs/language-tools#5381`):

- **`.ts` files** → `tsgo` (the native Go TypeScript compiler) for speed.
- **`.vue` SFCs** → `vue-tsc`, which runs on the last JS-based TypeScript line.

Both must pass. `typescript` resolves to that JS-based line repo-wide (what
vue-tsc and your editor use); `tsgo` comes from `@typescript/native-preview`.
Exact pinned versions live in the pnpm catalog in
[`pnpm-workspace.yaml`](./pnpm-workspace.yaml).

---

## Testing expectations

### Automated

- **Component/unit tests run in a real browser** (Chromium via Playwright), not a
  DOM shim — this is deliberate so native-HTML behavior (`<dialog>`, the Popover
  API, top-layer, focus handling) is exercised faithfully.
- Add tests next to the package under `packages/<pkg>/test/*.{test,spec}.ts`.
- End-to-end flows live in `e2e/` and run against the playground.

### Visual regression

Some e2e tests assert appearance with Playwright's `toHaveScreenshot`. They're
tagged `@visual`, and their baseline PNGs are committed under
`e2e/**/<spec>.ts-snapshots/`.

Baselines are **per-OS and per-engine** — one image per `{chromium, firefox,
webkit}` × `{linux, darwin, win32}` combination — because each platform renders
fonts, anti-aliasing, and device-pixel-ratio differently.

> [!IMPORTANT]
> **Never commit baselines generated only on your own machine.** The full
> cross-platform set is produced in CI by the **Update Visual Snapshots**
> workflow; a single-OS set fails e2e on every other platform.

When a change alters how a `@visual` component looks (new component, styling or
theme tweak), regenerate the whole set for your PR:

```bash
pnpm test:update-visual-snapshots <pr-number>
```

The script needs the authenticated **GitHub CLI (`gh`)** and a Node version with
native TypeScript execution (Node ≥ 23.6; the repo develops on Node 26). It
triggers the workflow on the PR's branch, waits for the cross-OS run, and
downloads every baseline into `e2e/` — then you review and commit the result (it
never touches git). Maintainers can alternatively comment **`/update-snapshots`**
on the PR.

To eyeball a change fast you can regenerate **only your platform's** baselines
with `pnpm test:e2e --update-snapshots --grep @visual` — but always regenerate
the full set via the script before committing.

**Adding a visual test:** add a deterministic fixture under
`playground/src/fixtures/` (no time/random/animation), add a `*.visual.spec.ts`
tagged `@visual` that screenshots the **fixture element** (not the whole page) so
the baseline crops tightly, then generate baselines with the script above.

### Real assistive-technology testing is mandatory (`SPEC.md` §3)

> **This cannot be substituted by automated checks or by AI review.**

Every **interactive** component must be tested against real screen readers —
**NVDA, JAWS, and VoiceOver** — before it is considered done. ARIA that "looks
right" in code review but fails a real screen reader is treated as a **defect,
not a pass**. Accessibility target is **WCAG 2.2 AA** (`SPEC.md` §4.16).

If your change adds or alters interactive behavior, note in the PR which screen
readers you tested with and the outcome.

---

## Coding guidelines

These are hard constraints from the spec — please don't work around them:

- **Vue 3 Composition API only** — `<script setup>` throughout. No Options API
  (`SPEC.md` §4.11).
- **Native modern HTML first** — build overlays on `<dialog>` + the Popover API,
  not JS portals/Teleport (`SPEC.md` §4.9).
- **CSS-framework agnostic** — never bake in or hard-couple Tailwind / Bootstrap /
  UnoCSS (`SPEC.md` §4.6).
- **Overridable by construction** — a component exposes a stable root class + a
  `data-*` state anatomy; its styling lives in a theme package
  (`@bankai-vue/theme-<name>/components/<name>.css`) wrapped in zero-specificity
  `:where()` so a consumer's plain CSS or utility class overrides it without
  `!important`. **Never apply styling via inline `style`** (inline beats every
  selector) — inline is only for passing a *value* a rule reads (e.g. a
  `--bankai-*` custom property). `core` ships no CSS (`SPEC.md` §4.4, §4.6).
- **First-class TypeScript** — generic components and typed slot scopes; authored
  on strict TypeScript defaults (`SPEC.md` §4.8).
- **Near-zero deps** — justify any new dependency against the §4.13 ladder; MIT
  only. `core` stays lean and audit-friendly.
- **SSR-safe** — use `useId()` for ARIA relationship IDs; no `window`/`document`
  access at setup time (`SPEC.md` §4.12).

Run `pnpm lint` and `pnpm format` before committing; both must be clean.

---

## Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/), e.g.:

```
feat(core): add Dialog component
fix(table-tanstack): keep row generic from widening to any
docs: clarify hybrid typecheck setup
chore(deps): bump vitest
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`. Keep the
subject imperative and scoped to the affected package where it makes sense.

---

## Changesets (versioning & release)

We version and publish with [Changesets](https://github.com/changesets/changesets).

**If your change affects a published package** (`core`, `nuxt`,
`table-tanstack`), add a changeset in the same PR:

```bash
pnpm changeset
```

Pick the affected package(s) and the bump type. While we're in the `0.x`
("Shikai") phase, prefer:

- **patch** — fixes and internal changes.
- **minor** — new features / new components.
- Breaking changes are expected during `0.x`; call them out clearly in the
  changeset summary.

Changes that touch only `playground`, `docs`, tooling, or the repo itself do
**not** need a changeset (those packages are ignored by Changesets).

Maintainers run `pnpm version` (applies bumps + changelogs) and `pnpm release`
(builds + publishes).

---

## Opening a pull request

1. Branch off `main`.
2. Make your change in small, reviewable commits.
3. Ensure the full gate passes locally: run `pnpm preflight`, and `pnpm test:e2e`
   if your change touches e2e or `@visual` behavior.
4. Add a changeset if a published package changed.
5. For interactive components, include your **real screen-reader test results**.
6. Open the PR against `bankai-vue/bankai` with a clear description of the change
   and its rationale.

Early days — if you're unsure about direction, open an issue or discussion first.
Thanks for helping build a worthy MIT successor. 🌊
