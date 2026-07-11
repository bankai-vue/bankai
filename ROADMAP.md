# bankai-vue — Component Roadmap

This is the **tactical** component roadmap for the `0.x` "Shikai" phase.
It sequences _what gets built, in what order, and why_.
For decided direction, requirements, and architecture, `SPEC.md` remains the source of truth — this document cites it (e.g. §4.9) rather than restating it.

**Ordering philosophy (SPEC §7): dogfooding-driven.**
Build what the Nuxt docs shell needs first, then outward to the full set of basics, then the complex flagship components.
The docs site is bankai-vue built with bankai-vue, so every component the docs need is a component the ecosystem needs.

---

## How to read this

Most basics do not unlock in isolation — they sit on a small number of **cross-cutting foundations** (behavior composables, not user-facing components).
Building those foundations first is what makes each component phase cheap.
So the roadmap is: **Foundations → Phased components**, with the foundation each phase depends on called out.

### Per-component Definition of Done

Every component ships with all of:

- Typed props/slots + exported public types (§4.8)
- JSDoc on every consumable API
- Anatomy: stable root class + `data-part` + reflected state as `data-bankai-*` (§4.6)
- `@bankai-vue/theme-bankai` styles at `components/<name>.css` (core ships zero CSS)
- Unit (Vitest browser) + e2e (Playwright) + committed visual baseline
- **Real screen-reader pass on NVDA / JAWS / VoiceOver** — AI-written ARIA that is not AT-verified is a defect (§3, §4.16). Non-negotiable gate.

---

## Foundations

Behavior/composable layers (§4.17) built from scratch, native-first. Not user-facing on their own.

| Id     | Foundation                                                                                                                                            | Unlocks                                                                                    |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **F1** | **Overlay core** — native `<dialog>` + Popover API wrappers, focus trap/return, light-dismiss, `@floating-ui/vue` positioning composable (§4.9, §5.2) | `BankaiApp` (overlay/portal + toast root), Dialog, Popover, Tooltip, Menu, Select dropdown |
| **F2** | **Form-field core** — label↔id association (extends `useBankaiId`), field wrapper (label + help + error), form/validation context                     | every input control                                                                        |
| **F3** | **Collection / keyboard core** — roving tabindex, typeahead, list-navigation composable (§4.17)                                                       | Tabs, Menu, RadioGroup, Listbox, Tree                                                      |

---

## Native HTML foundations

**Native-modern-HTML-first (SPEC §4.9): a component is built on the native element that already does its job, and enhances from there** — rather than re-implementing behavior/a11y in JS the way older suites (built before these elements shipped) had to. This shrinks the behavior layer, inherits a11y for free, and survives without JS. Where a modern capability isn't Baseline-safe yet (customizable `<select>`, CSS anchor positioning), it's **progressive enhancement** over a working native baseline.

Per-component native anchors (annotated inline in the checklist below):

| Component(s)                                                                   | Native anchor                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BankaiDialog` · `Modal` · `Popover` · `Tooltip` · `Menu`                      | `<dialog>` + Popover API (top-layer, light-dismiss) — foundation F1 (Modal = Dialog preset)                                                                                                                                              |
| `BankaiDisclosure` · `BankaiAccordion`                                         | `<details>` / `<summary>` (Accordion = `<details name>` for native exclusive-open)                                                                                                                                                       |
| `BankaiSelect`                                                                 | customizable `<select>` (`appearance: base-select` + `::picker(select)` + `<selectedcontent>`) — _progressive enhancement; styled-native fallback today_                                                                                 |
| `BankaiCombobox`                                                               | `<input list>` + `<datalist>` baseline; custom listbox for rich options                                                                                                                                                                  |
| `BankaiSlider` / `InputNumber` / `ColorPicker` / `DatePicker` / `TimePicker`   | `<input type=range/number/color/date/time>`                                                                                                                                                                                              |
| `BankaiInput` · `Textarea` · `Checkbox` · `Radio` · `Switch`                   | `<input>` (text/checkbox/radio) · `<textarea>` — Switch = checkbox + `role="switch"`                                                                                                                                                     |
| `BankaiForm` · `BankaiFieldset` · `BankaiRadioGroup`                           | `<form>` / `<fieldset>` / `<legend>`                                                                                                                                                                                                     |
| `BankaiProgress` · `BankaiMeter`                                               | `<progress>` (task) · `<meter>` (scalar-in-range) — distinct elements                                                                                                                                                                    |
| `BankaiSeparator`                                                              | `<hr>`                                                                                                                                                                                                                                   |
| `BankaiDescriptions`                                                           | `<dl>` / `<dt>` / `<dd>`                                                                                                                                                                                                                 |
| `BankaiImage` · `BankaiVideo` · `BankaiAudio`                                  | `<picture>` / `<video>` / `<audio>`                                                                                                                                                                                                      |
| `BankaiSearch`                                                                 | `<search>` landmark                                                                                                                                                                                                                      |
| `BankaiLayout` · `Header` · `Aside` · `Main` · `Footer` · `Navbar` · `Sidebar` | `<header>` / `<nav>` / `<aside>` / `<main>` / `<footer>` landmarks (regions vs. content: Navbar→Header, Sidebar→Aside)                                                                                                                   |
| `BankaiPage` · `BankaiContainer`                                               | `<div>` structural wrappers — Page = per-route host, Container = width utility; **neither is a landmark** (§5.6)                                                                                                                         |
| `BankaiFlex` · `Grid` · `Stack` · `Group`                                      | `<div>` (polymorphic via `as`) — props reflected as `data-bankai-*` (+ a `--bankai-*-gap` custom prop) consumed by zero-specificity `:where()` theme CSS, so consumer utility classes override (§4.4/§4.6); Stack/Group are Flex presets |
| `BankaiHeading` · `Paragraph` · `Code` · `Kbd` · `Text`                        | `<h1>`–`<h6>` / `<p>` / `<code>` / `<kbd>` / `<span>` + inline text semantics (`<mark>`, `<abbr>`, `<time>`, `<s>`…)                                                                                                                     |
| `BankaiSimpleTable` · `BankaiDataTable`                                        | `<table>` (+ `<thead>`/`<tbody>`/`<tr>`/`<td>`/`<th>`/`<caption>`)                                                                                                                                                                       |
| `BankaiButton` · `ButtonGroup` · `Link` · `Icon`                               | `<button>` · `role="group"` · `<a>` · `<svg>` (BYO icon, `currentColor`)                                                                                                                                                                 |
| `BankaiVisuallyHidden`                                                         | `<span>` (visually-hidden / sr-only clip)                                                                                                                                                                                                |

---

## Phases

### Phase 0 — Landed ✅

`BankaiButton` · `createBankai` / `useBankaiConfig` · `useBankaiId` / `usePrefixedId` · `@bankai-vue/theme-bankai` base tokens · cross-engine unit + Playwright e2e + visual-regression infra.

### Phase 1 — Docs-shell dogfooding

Gets the Nuxt docs site standing, then broadens to the cheap, native-anchored primitives the docs lean on. Per SPEC §7: _layout, nav, theme toggle, code block, tabs_ — plus typography, presentational, and feedback basics. The checklist below is the full list; rationale for the notable pieces:

- **Layout regions + navigation** _(core components)_ — a CSS-grid `BankaiLayout` shell emitting native landmarks, with Navbar/Sidebar content shipped from `@bankai-vue/core`, not docs-app-local.
- **Tabs** _(F3)_ — first real keyboard/ARIA component; high dogfooding value.
- **ThemeToggle** — small stateful control over the §4.18 CSS-only dark-mode mechanism (no flash, no JS theme state).
- **CodeBlock** — copy-to-clipboard (reuses `BankaiButton`). Syntax highlighting stays docs-side, not in core.
- **Typography + presentational basics** — the Text family plus Card/Badge/Alert/Skeleton/SimpleTable etc.: low-effort, high-use, mostly native-anchored.

_Phase 1 is deliberately front-loaded — it's a lot of components, but most are thin presentational wrappers, not behavior-heavy._

### Phase 2 — Form basics _(F2, F3)_

Form orchestration (`BankaiForm`) + the field wrapper (`BankaiField` / `BankaiFieldset`) + the native input set, ending with the heavier Combobox and the date/time family. Native-element-anchored throughout (§4.9); see the checklist for the full list.

- **Open decision — Select strategy:** leaning native-modern — customizable `<select>` (`appearance: base-select`) as progressive enhancement over a styled-native baseline, rather than a from-scratch listbox. Confirm when Phase 2 starts (Baseline support timing is the deciding factor).

### Phase 3 — Overlays & disclosure _(F1)_

Dialog (+ `Modal` sugar) · Drawer · Popover · Tooltip · Toast · Menu · Disclosure · Accordion. Overlays on native `<dialog>` + Popover API; disclosure/accordion on native `<details>`/`<summary>`.

### Phase 4 — Flagship / complex

- **DataTable** — presentation + typed slots are bankai-vue's own; the engine is a swappable adapter behind the `TableModel<T>` contract (§4.10), with `@bankai-vue/table-tanstack` as the opt-in recommended adapter.
- **Tree** _(F3)_.

> **Typing risk to prototype before promising the API (§4.8):** per-column cell-slot typing (`#cell-email` → `Row['email']`) is at the edge of vue-tsc/Volar today. Row-level generics (`#cell="{ row }"` → `row: T`) are safe. Prototype the per-column form _before_ it is part of the public DataTable surface — even though the full DataTable build is sequenced here in Phase 4, not run as an early spike.

---

## Component checklist

The working registry of `Bankai*` names, tracked by done-state. Grouped by the phases above. Compound components list their sub-parts in parentheses.
Components marked _(universal)_ ship in essentially every major Vue framework (Element Plus, Ant Design Vue, PrimeVue, Vuetify, Quasar, Naive UI, Reka UI, Nuxt UI).

> **Names are not final.** Every `Bankai*` name below is a working proposal and may be adjusted when the component is actually implemented — as its API, anatomy, and scope become concrete. Treat this list as intent and coverage, not a locked naming contract.

### Foundations (composables)

Not set in stone — these names and APIs are **provisional** and get developed **when the first component that needs them lands**, not up front. Listed here only to name the shared behavior each phase leans on (see the Foundations table above).

- `useBankaiOverlay` — F1, native `<dialog>` + Popover API + focus management
- `useBankaiPosition` — F1, `@floating-ui/vue` collision-aware placement
- `useBankaiField` — F2, label↔id + validation/error context
- `useBankaiCollection` — F3, roving tabindex + typeahead + list navigation

### Phase 0 — Landed

- [x] `BankaiButton`

### Phase 1 — Docs-shell dogfooding

Layout regions — `BankaiLayout` wraps each slot in the matching landmark region below (the regions also work standalone). Together with `BankaiApp` (Phase 3) they form a **four-layer app structure**, each layer with a non-overlapping job (full roles + nesting rules in SPEC §5.6):

**App** (infra singleton) › **Layout** (shell + landmarks) › **Page** (per-route host) › **Container** (width utility).

- [x] `BankaiLayout` — CSS-grid app shell; wraps `#header`/`#sidebar`/`#footer`/default slots in the region landmarks below (emitted inline; no props — consumer controls the grid via CSS, no `view`-string DSL). Persists across routes. ≈ Element Plus `el-container` / Quasar `QLayout`, not `QPage`
- [ ] `BankaiHeader` — `<header>` region (holds `BankaiNavbar`) — standalone version; `BankaiLayout` emits `<header>` inline for its `#header` slot
- [ ] `BankaiAside` — `<aside>` region (holds `BankaiSidebar`) — standalone version; `BankaiLayout` emits `<aside>` inline for its `#sidebar` slot
- [ ] `BankaiMain` — `<main>` region — emitted by `BankaiLayout`'s default slot, so nothing nested inside should render its own `<main>` (landmark uniqueness)
- [ ] `BankaiFooter` — `<footer>` region — standalone version; `BankaiLayout` emits `<footer>` inline for its `#footer` slot
- [ ] `BankaiPage` — per-route content host inside `<main>`; ≈ Quasar `QPage`. Owns per-route concerns (min-height fill so short pages still push the footer down, scroll region, route-transition host) + the "every route starts with `<BankaiPage>`" DX convention. **Not** a landmark, and deliberately does **no** implicit child-rewriting (no auto heading-levels — see §5.6). Can land thin (a min-height wrapper) and grow once there's routing to dogfood
- [x] `BankaiContainer` — width utility: polymorphic `as` (default `<div>`) + `fluid` boolean. Centered at `--bankai-container-max-width` (with a `--bankai-container-gutter` inline padding) by default; `fluid` reflects `data-bankai-fluid` and drops the cap for full-width (the "bars left/right on huge viewports" toggle). The width is intrinsic, not viewport-driven — it collapses to edge-to-edge on its own in a narrow/embedded parent, no media queries (SPEC §4.19). Reusable anywhere (Card, section, hero), not once-per-route. ≈ Quasar `QPageContainer` / Bootstrap `container`/`-fluid`. Still unblocks the **docs-shell migration** (a follow-up PR): moving `docs/app/layouts/{default,docs}.vue` onto `BankaiLayout` + `BankaiContainer` — the current shell has full-bleed header/footer bars + a body centered at 72rem, which wants a Container inside the regions rather than baking a max-width into the Layout grid. That migration must also strip the `<header>`/`<footer>` landmark wrappers from `SiteHeader`/`SiteFooter` (else they nest inside Layout's region landmarks) and move both layouts together (they share those components).

Composition — the consumer fills slots with content; `BankaiLayout` emits the landmarks, `BankaiPage` hosts the route, `BankaiContainer` sets the content width:

```vue
<BankaiLayout>
  <template #header><BankaiNavbar /></template>
  <template #sidebar><BankaiSidebar /></template>
  <template #footer>…</template>
  <BankaiPage>
    <BankaiContainer>… page content …</BankaiContainer>
  </BankaiPage>
</BankaiLayout>

<!-- renders → -->
<div class="bankai-layout"><!-- display: grid -->
  <header data-part="header">…</header>
  <aside  data-part="sidebar">…</aside>
  <main   data-part="main">…page › container › content…</main>
  <footer data-part="footer">…</footer>
</div>
```

Full-bleed-hero-plus-centered-body falls out naturally — two Containers at different widths inside one Page (`<BankaiContainer fluid>` hero, then a default `<BankaiContainer>` for the article).

**`BankaiContainer` — potential ideas (not committed; add the API when dogfooding needs it):**

- **`size` prop** — a named max-width scale (e.g. `sm`/`md`/`lg`/`xl`, plus a verbatim escape hatch for any CSS length, per the escape-hatch pattern) mapping onto a `--bankai-container-max-width-*` token family in both themes (theme-tailwind onto Tailwind's `--container-*` scale). It answers _which_ cap; today there is one (`--bankai-container-max-width`), retunable via CSS. **Ship it as the mutually-exclusive branch of a discriminated union with `fluid`**, so `size` (a cap) and `fluid` (no cap) can't both be set — a type error at the call site via vue-tsc, since they fight over the same axis:
  ```ts
  type BankaiContainerProps = { as?: BankaiContainerAs } & (
    { fluid?: boolean; size?: never } | { size?: BankaiContainerSize; fluid?: never }
  );
  ```
  This addition is **non-breaking**: it keeps `fluid` and only rejects `<BankaiContainer fluid size="…">`, which was never expressible before. `size` still needs no responsiveness of its own — each cap degrades to edge-to-edge intrinsically below its width (§4.19). Verify Vue's `defineProps` resolves the intersection-of-a-union and that Reactive Props Destructure with a `= false` default behaves, via `.test-d.ts`, when it lands.

**`BankaiLayout` — potential ideas (not committed; add the API when dogfooding needs it):**

- **`aside-span` preset prop** — the default shell spans the header across the top; the other canonical dashboard archetype is a **full-height sidebar** with header/main/footer stacked in the content column. Reachable today by overriding `grid-template-areas` on `.bankai-layout`, but a named enum reflected as `data-bankai-aside-span` (e.g. `full`) would give it ergonomically, styled by a `:where()` rule that swaps in `grid-template-areas: 'sidebar header' 'sidebar main' 'sidebar footer'`. This is an enumerated `data-*` prop, **not** the rejected `view`-string DSL (§5.6), and keeps the raw-CSS override as the escape hatch.
- **Second aside (end rail)** — today there is one `#sidebar` slot → one `<aside>`. A right/end rail should **not** be a second Layout slot: multiple `complementary` landmarks each need an `aria-label`, which belongs to the standalone `BankaiAside` component (labelled, grid-positioned by the consumer), not baked into Layout. If it ever becomes a Layout slot, name it **logically** (`#aside-start`/`#aside-end`), never left/right — the grid is writing-mode-aware and flips under RTL.
- **`scroll` mode prop** — vertically there are two archetypes: **page scroll** (the default — whole page scrolls, footer bottom-pinned on short pages via `min-block-size: 100dvh` + the `1fr` main row) and **app-shell** (fixed header + footer, only `main` scrolls — a viewport-height grid with `overflow` on the main region, no `position: fixed` needed). Reachable today via CSS overrides (documented on the component's docs page), but the real axis is a single enumerated prop, e.g. `scroll="page" | "app"` reflected as `data-bankai-scroll`, **not** per-region `sticky-header`/`fixed-footer` booleans. Note: aside + main **already** stretch between header and footer by default (`1fr` middle row + grid's default `stretch`); hugging content is an `align-self: start` override, not a prop.

Layout utilities — prop-driven layout: props are reflected as `data-bankai-*` on the root (`gap` as a `--bankai-*-gap` custom property) and turned into layout by zero-specificity `:where()` rules in `@bankai-vue/theme-bankai`, so a consumer's utility classes (Tailwind/Bootstrap/UnoCSS) override by plain specificity — no `!important` (§4.4/§4.6). Polymorphic `as` (default `<div>`); needs the theme CSS (or equivalent targeting the root class) loaded. The composable replacement for Vuetify `VRow`/`VCol`:

- [x] `BankaiFlex` — flexbox helper; `direction`/`align`/`justify`/`gap`/`wrap`/`inline` props → `data-bankai-*` (+ `--bankai-flex-gap`) styled by theme `:where()` (`display:flex`)
- [x] `BankaiGrid` — CSS-grid helper; `columns`/`rows`/`areas`/`gap`/`flow`/`align`/`justify`/`inline` props → `data-bankai-*` (enumerated) + `--bankai-grid-*` (continuous track values) styled by theme `:where()` (`display:grid`, 2D layouts)
- [ ] `BankaiStack` — vertical preset over `BankaiFlex` (`direction=column`); ergonomic sugar
- [ ] `BankaiGroup` — **uncertain** — a horizontal preset would just be `BankaiFlex`'s default (`direction=row`), so it may be redundant; decide when Flex lands
- [ ] `BankaiVisuallyHidden` — sr-only utility (`<span>` clip); visible to assistive tech only. On-mission for the a11y-first DoD

Navigation content — dropped into the region slots:

- [ ] `BankaiNavbar` — styled top nav bar (brand + links + actions); goes in the `#header` slot
- [ ] `BankaiSidebar` — styled side-nav panel (sections, collapsible groups); goes in the `#sidebar` slot
- [x] `BankaiLink` — router-aware link (`to`/`href`/`external`); auto-resolves `NuxtLink` → `RouterLink` → native `<a>` from the app's global component registry (no vue-router dep in core; `vue-router` an optional peer). `to`'s type is a router-agnostic fallback by default and vue-router's `RouteLocationRaw` via the opt-in `@bankai-vue/core/vue-router` types augmentation. Auto `rel="noopener noreferrer"` on `target="_blank"` (opt out via `config.linkNoopener`); `config.linkComponent` overrides the internal-link component. Reflects `data-bankai-external`. Used by nav, Breadcrumb, Menu
- [ ] `BankaiBreadcrumb` _(universal)_ — hierarchical trail
- [ ] `BankaiPagination` _(universal)_ — paged navigation
- [ ] `BankaiTabs` (`BankaiTab`, `BankaiTabPanel`)
- [ ] `BankaiThemeToggle`
- [ ] `BankaiCodeBlock` — fenced/block code + copy button
- [ ] `BankaiSearch` — native `<search>` landmark wrapping the docs search/filter controls

Typography — anchors the `@bankai-vue/theme-bankai` type scale; the home for inline text semantics:

- [x] `BankaiText` _(universal; a.k.a. Typography)_ — polymorphic (`as`) text primitive: `size` (`xs`–`2xl` type scale)/`weight` (`thin`–`black`)/`tone`/`truncate`; each styling prop is a named set plus a verbatim escape hatch (any CSS length / a `number` for the variable-font `wght` axis / any CSS color / any tag string), wired via `data-bankai-*` for named values and `--bankai-text-*` custom properties for verbatim ones. Inline semantics (code, kbd, mark, strong, em, del) reached via `as`. Ships neutral tones only (`default`/`muted`/`subtle`); semantic status tones (`success`/`warning`/`danger`/`info`) deferred to the color-tokening follow-up (see Cross-cutting), though arbitrary colors already work via the `tone` escape hatch
- [ ] `BankaiHeading` — native `<h1>`–`<h6>` via `level` prop
- [ ] `BankaiParagraph` — native `<p>`
- [x] `BankaiCode` — inline code, native `<code>` (distinct from block `BankaiCodeBlock`). A pure, themeable wrapper: renders `.bankai-code` `<code data-part="root">` with no props today; the theme gives it the house monospace stack (`--bankai-font-mono`), an `em`-relative size (scales with surrounding text), and a subtle chip background (`--bankai-code-bg`, the surface role). A polymorphic `as` (for `<kbd>`/`<samp>`/`<var>`) is a possible non-breaking addition later. Every chip value is a `--bankai-code-*` token (bg/radius/font-size/padding). Introduced the shared `--bankai-font-mono` token; `theme-tailwind` mirrors via `@apply font-mono` + the same tokens (radius → Tailwind `--radius-md`; no token bridge needed — Tailwind has `font-mono`). Used across the docs in place of raw `<code>`.
- [ ] `BankaiKbd` — keyboard input, native `<kbd>`

Presentational basics — low-effort, high-use, dogfooded by the docs site:

- [ ] `BankaiIcon` — agnostic icon wrapper: renders a BYO SVG/slot with `currentColor` + size tokens + `aria-hidden`/labeling. Ships **no** icon set. Unblocks icon usage across every component
- [ ] `BankaiButtonGroup` _(universal)_ — segmented/grouped buttons (`role="group"`); toolbars, split actions
- [ ] `BankaiCard` _(universal)_ — content container
- [ ] `BankaiBadge` _(universal)_ — count/status marker
- [ ] `BankaiTag` _(universal)_ — label/chip
- [ ] `BankaiAvatar` _(universal)_ — user/entity image
- [ ] `BankaiSeparator` _(universal)_ — divider, native `<hr>` (Divider alias TBD)
- [ ] `BankaiAlert` _(universal)_ — inline callout/message
- [ ] `BankaiSkeleton` _(universal)_ — loading placeholder
- [ ] `BankaiProgress` _(universal)_ — task-completion bar, native `<progress>`
- [ ] `BankaiMeter` — scalar-in-range gauge, native `<meter>` (distinct from Progress; e.g. score, password strength)
- [ ] `BankaiSpinner` _(universal)_ — indeterminate loading indicator (also DataTable loading state)
- [ ] `BankaiEmptyState` _(universal; a.k.a. Empty/Result)_ — no-data / result placeholder
- [ ] `BankaiSimpleTable` _(universal; a.k.a. MarkupTable / basic Table)_ — thin styled native `<table>` for static tabular content; no sorting/pagination/virtualization (that's the Phase 4 `BankaiDataTable`)

### Phase 2 — Form basics

- [ ] `BankaiForm` _(universal)_ — native `<form>` orchestrator: submission + validation context (the user-facing counterpart to F2); wraps the fields below
- [ ] `BankaiField` — label + help + error wrapper for a single control
- [ ] `BankaiFieldset` — native `<fieldset>` / `<legend>` grouping for related controls (backs `BankaiRadioGroup` + checkbox groups)
- [ ] `BankaiLabel`
- [ ] `BankaiInput`
- [ ] `BankaiTextarea` — native `<textarea>`
- [ ] `BankaiInputNumber` _(universal)_ — native `<input type=number>` with step/format
- [ ] `BankaiCheckbox`
- [ ] `BankaiRadio` + `BankaiRadioGroup` — group renders `<fieldset>`/`<legend>`
- [ ] `BankaiSwitch`
- [ ] `BankaiSlider` — native `<input type=range>`
- [ ] `BankaiSelect` — _strategy TBD; leaning native-modern: customizable `<select>` (`appearance: base-select`) as progressive enhancement over a styled-native baseline, rather than a from-scratch listbox_
- [ ] `BankaiCombobox` _(universal; a.k.a. Autocomplete)_ — `<input list>`+`<datalist>` baseline; custom listbox (F1 + F3) for rich options; heavier

Date/time family — designed together, slots late in the phase (heaviest inputs). Native `<input type=date/time/datetime-local/month/week>` baseline:

- [ ] `BankaiDatePicker` _(universal)_
- [ ] `BankaiTimePicker` _(universal)_
- [ ] `BankaiCalendar` _(universal)_ — inline month/date grid the pickers build on

### Phase 3 — Overlays & disclosure

- [ ] `BankaiApp` — optional app-level wrapper (à la Nuxt UI `UApp` / Vuetify `v-app`): a single overlay/portal mount target + toast host + app-side config context, and an **embedded-mode surface** (carries `--bankai-color-bg`/`color`/`color-scheme` on its own box, so a bankai island in a foreign page is self-contained without the global page-surface paint). Lands with F1, when the overlay/portal root it provides first has consumers. **Singleton at the root** — its services are `provide/inject`, so **side-by-side is fine** (embedded micro-frontends, split-screen) but **nesting App-in-App is discouraged** (an inner App silently shadows the outer's overlay/toast host). See SPEC §5.6
- [ ] `BankaiDialog` — native `<dialog>`; `modal` prop (`showModal()` + `::backdrop` + focus trap) & `dismissable` prop (Esc / click-outside)
- [ ] `BankaiModal` — sugar for `BankaiDialog :modal :dismissable="false"` (must be explicitly closed); preset, same as Stack/Group over Flex
- [ ] `BankaiDrawer` _(universal)_ — edge-anchored panel (PrimeVue/Nuxt call it Drawer; ex-Sidebar)
- [ ] `BankaiPopover` — Popover API
- [ ] `BankaiTooltip`
- [ ] `BankaiToast` _(universal; a.k.a. Notification/Message)_ — transient feedback; needs F1
- [ ] `BankaiMenu` (`BankaiMenuItem`)
- [ ] `BankaiDisclosure` — native `<details>` / `<summary>` single collapsible (zero-JS)
- [ ] `BankaiAccordion` (`BankaiAccordionItem`) — grouped `<details name>` for native exclusive-open

### Phase 4 — Flagship / complex

- [ ] `BankaiDataTable` — full data grid (sort/filter/paginate/select); distinct from the Phase 1 `BankaiSimpleTable`
- [ ] `BankaiTree` (`BankaiTreeItem`)

---

## Deferred candidates (post-`0.1.0`)

Components common across the Vue ecosystem but **not committed** — a prioritised backlog to evaluate after the initial release, drawn from a survey of the major Vue frameworks (Element Plus, Ant Design Vue, PrimeVue, Vuetify, Quasar, Naive UI, Reka UI, Nuxt UI). Ranked by how many frameworks ship them. Tiers A/B are candidates for `@bankai-vue/core`; Tier C is **out of core but not off the table** — see below.

**Tier A — near-universal:**

- [ ] `BankaiTimeline`
- [ ] `BankaiCarousel`
- [ ] `BankaiImage` — native `<picture>`/`<img>`, lazy-load + preview
- [ ] `BankaiVideo` — thin native `<video>` wrapper (styled controls); a heavy player (e.g. video.js-based) is a separate non-core package — see Tier C
- [ ] `BankaiAudio` — thin native `<audio>` wrapper
- [ ] `BankaiFileUpload` _(a.k.a. Upload / FileInput)_ — native `<input type=file>`
- [ ] `BankaiColorPicker` — native `<input type=color>` baseline
- [ ] `BankaiRating`
- [ ] `BankaiStepper` (`BankaiStep`)

**Tier B — common (3–4 frameworks):**

- [ ] `BankaiSplitter` — resizable split panes
- [ ] `BankaiTransfer` — dual-list picker
- [ ] `BankaiCascader` — hierarchical select
- [ ] `BankaiPinInput` _(a.k.a. OTP input)_
- [ ] `BankaiTagsInput` — chip/token entry
- [ ] `BankaiSegmented` _(a.k.a. SegmentedControl / ToggleGroup)_
- [ ] `BankaiPopconfirm` — inline confirm popover
- [ ] `BankaiScrollArea` — styled custom scrollbars
- [ ] `BankaiAnchor` + `BankaiBackTop` — docs-site scroll aids
- [ ] `BankaiDescriptions` — key/value detail list, native `<dl>`/`<dt>`/`<dd>`
- [ ] `BankaiStatistic` — highlighted metric
- [ ] `BankaiMention` — `@`-mention text input

**Tier C — dep-heavy / specialised: candidates for separate opt-in packages, never `core`.**

These pull in heavy dependencies or serve narrow use cases, so they violate `core`'s near-zero-dep, agnostic posture (SPEC §4.13) — but they can ship as their own `@bankai-vue/*` packages (the `@bankai-vue/table-tanstack` precedent, §5.4), each an opt-in install with its own dep footprint. Package boundaries decided per-component when picked up; illustrative groupings:

- **Data-viz** — Sparkline, Pie/charts, Heatmap _(e.g. a `@bankai-vue/charts`)_
- **Rich text** — WYSIWYG Editor _(e.g. a `@bankai-vue/editor`)_
- **Rich media player** — full-featured video/audio player (e.g. a `@bankai-vue/player` wrapping video.js) — distinct from the thin native `BankaiVideo`/`BankaiAudio` wrappers in `core`
- **Standalone widgets** — CommandPalette, Hotkey, QRCode, Watermark, OrgChart, SpeedDial, Terminal, Dock, Marquee, PullToRefresh, Parallax

## Cross-cutting (deferred by design, SPEC §7)

- **i18n / RTL** — important; iterated **post-`0.1.0`, within `0.x`**, not a `0.1.0` blocker.
- **Theming token system** — grows **discover-as-you-go** on top of the §4.18 dark-mode mechanism, as real components land. Not designed in the abstract. _Slices landed:_ the rem-based, theme-owned `--bankai-space-*` spacing scale (introduced with `BankaiFlex`); the `--bankai-text-size-*` type scale + neutral text-tone colors (introduced with `BankaiText`); the foundation semantic **color tokens** — `--bankai-color-*` (fg/fg-muted/fg-subtle, bg/surface/border, primary/primary-fg, accent), OKLCH + `light-dark()`-themed — which now back `BankaiButton` and `BankaiText`'s neutral tones. `theme-tailwind` exposes the same **roles** with an independent **palette** (stock Tailwind: `gray` neutrals + `indigo` primary/accent), pointed at the consumer's Tailwind `--color-*`. Layered on top: the **page surface** — both themes paint `--bankai-color-bg`/`-fg` onto `html` via a severable `base.css` (imported by default for zero-config, but omittable so embedding never repaints a host page's `html`; `theme-tailwind` mirrors it in `@layer base`).
  - _Follow-up — semantic status colors:_ the `success`/`warning`/`danger`/`info` palette, layered on the foundation color tokens above, which then backs `BankaiText`'s status tones and the first color-carrying presentational components (Alert/Badge/Tag). Deferred from the foundation slice so the status palette is shaped by a component that actually needs semantic color.
- **Vapor builds** — added when interop matures (§4.11); VDOM builds ship first.

## Open structural question (revisit before `1.0` / Bankai)

Whether components stay in a **per-component** source layout (`components/button/`) or move to **family/category** folders (e.g. `components/actions/`). Undecided; per-component during `0.x`. Families may end up being only a docs-navigation grouping without changing the source tree.

---

_The `1.0` "Bankai" milestone (targeted 2027): stable public API, full basics + DataTable + Tree, WCAG 2.2 AA with per-component conformance docs, plain-Vue + Nuxt SSR/SSG/client-only, dark mode, near-zero-dep core (SPEC §7)._
