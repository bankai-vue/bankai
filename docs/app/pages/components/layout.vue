<script setup lang="ts">
import { BankaiText } from '@bankai-vue/core';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiLayout · bankai-vue' });

// Slots → landmark region. BankaiLayout has no configuration props: the grid tracks are controlled
// with plain CSS against `.bankai-layout` and the `data-part`s (SPEC §5.6), not a `view`-string DSL.
interface SlotRow {
  slot: string;
  element: string;
  description: string;
}

const slots: SlotRow[] = [
  {
    slot: 'header',
    element: '<header> · banner',
    description: 'Top region — typically a navbar. Omitted when the slot is not provided.',
  },
  {
    slot: 'sidebar',
    element: '<aside> · complementary',
    description: 'Side region — typically a sidebar nav. Omitted when the slot is not provided.',
  },
  {
    slot: 'default',
    element: '<main> · main',
    description:
      'Main content, always rendered. The sole <main> — nothing inside should render its own.',
  },
  {
    slot: 'footer',
    element: '<footer> · contentinfo',
    description: 'Bottom region. Omitted when the slot is not provided.',
  },
];

// Rendered as text (not live) so this page does not nest a second <main> inside the docs shell —
// landmark uniqueness is exactly what BankaiLayout protects.
const usage = `<BankaiLayout>
  <template #header><BankaiNavbar /></template>
  <template #sidebar><BankaiSidebar /></template>
  <BankaiPage>
    <BankaiContainer>… page content …</BankaiContainer>
  </BankaiPage>
  <template #footer>© bankai-vue</template>
</BankaiLayout>`;

// The grid tracks are controlled with plain CSS against `.bankai-layout`. Because every theme rule is
// zero-specificity `:where()`, a single plain declaration (or utility class) overrides it — no
// `!important`. Regions are pinned by NAME (`grid-area: sidebar`), so restructuring is just a new
// `grid-template-areas` on the root; DOM/source order stays header → sidebar → main → footer.
const overrideCss = `/* full-height sidebar, header/main/footer stacked in the content column */
.bankai-layout {
  grid-template-columns: 16rem 1fr;
  grid-template-areas:
    'sidebar header'
    'sidebar main'
    'sidebar footer';
}

/* swap sidebar and main to the opposite side */
.bankai-layout {
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'header  header'
    'main    sidebar'
    'footer  footer';
}`;

// Vertical/scroll recipes. The default is page-scroll (whole page scrolls, footer bottom-pinned on
// short pages). The app-shell variant pins the grid to the viewport and makes `main` the scroll
// container — fixed header/footer with no `position: fixed`. `min-block-size: 0` on the main item is
// the key: grid items floor at min-content, which would otherwise defeat the overflow scroll.
const scrollCss = `/* app-shell: fixed header + footer, only main scrolls */
.bankai-layout {
  block-size: 100dvh;
  min-block-size: 0;
}
.bankai-layout > [data-part='main'] {
  overflow: auto;
  min-block-size: 0;
}

/* or, in the page-scroll default, just pin the header on scroll */
.bankai-layout > [data-part='header'] {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
}`;
</script>

<template>
  <article class="doc">
    <BankaiText as="h1" size="2xl" weight="black">BankaiLayout</BankaiText>
    <BankaiText as="p" size="lg" tone="muted">
      The persistent app shell: a CSS-grid root that wraps each slot in its native landmark region
      (<code>&lt;header&gt;</code>/<code>&lt;aside&gt;</code>/<code>&lt;main&gt;</code>/<code>&lt;footer&gt;</code>),
      so an application gets a correct, unique-per-page landmark set for free. The grid tracks are
      yours to control with plain CSS against <code>.bankai-layout</code> — there is no
      <code>view</code>-string DSL.
    </BankaiText>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Structure</BankaiText>
      <BankaiText size="sm" tone="muted">
        The default theme shell — header across the top, footer across the bottom, sidebar left of
        the main content. Absent regions collapse their track, so a header-less or sidebar-less app
        needs no override.
      </BankaiText>
      <!-- A plain-div diagram, NOT a live BankaiLayout: rendering one here would emit a <main> inside
           the docs shell's <main>, the very landmark clash the component prevents. -->
      <div class="diagram" aria-hidden="true">
        <div class="cell header">header</div>
        <div class="cell sidebar">sidebar</div>
        <div class="cell main">main</div>
        <div class="cell footer">footer</div>
      </div>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Usage</BankaiText>
      <pre class="code"><code>{{ usage }}</code></pre>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Customizing the grid</BankaiText>
      <BankaiText size="sm" tone="muted">
        <code>BankaiLayout</code> takes no layout props — you own the grid tracks with plain CSS.
        Every theme rule is zero-specificity (<code>:where()</code>), so a single declaration or
        utility class overrides it without <code>!important</code>. Regions are pinned by name
        (<code>grid-area: header</code>, …), so restructuring is just a new
        <code>grid-template-areas</code> on <code>.bankai-layout</code> — the DOM/source order stays
        <code>header → sidebar → main → footer</code>, only the visual placement moves.
      </BankaiText>
      <pre class="code"><code>{{ overrideCss }}</code></pre>

      <BankaiText as="h3" size="lg" weight="semibold">RTL</BankaiText>
      <BankaiText size="sm" tone="muted">
        Right-to-left works with no extra code. The default uses logical values (<code
          >grid-template-columns: auto 1fr</code
        >, <code>min-block-size</code>) and named areas rather than physical left/right, and CSS
        Grid lays columns along the inline axis — so under <code>dir="rtl"</code> the sidebar moves
        to the inline-start (right) edge automatically.
      </BankaiText>

      <BankaiText as="h3" size="lg" weight="semibold">Vertical &amp; scroll behavior</BankaiText>
      <BankaiText size="sm" tone="muted">
        By default <code>sidebar</code> and <code>main</code> stretch to fill the space between
        header and footer (the middle row is <code>1fr</code>), and the whole page scrolls — the
        footer scrolls in after the content, but stays pinned to the bottom of the viewport on short
        pages (<code>min-block-size: 100dvh</code>). For an app-shell feel — fixed header and footer
        with only <code>main</code> scrolling — pin the grid to the viewport and make
        <code>main</code> the scroll container (no <code>position: fixed</code> needed); a sticky
        header is a one-liner. To let the sidebar hug its content instead of stretching, use
        <code>align-self: start</code>.
      </BankaiText>
      <pre class="code"><code>{{ scrollCss }}</code></pre>

      <BankaiText as="h3" size="lg" weight="semibold">Tailwind &amp; utility classes</BankaiText>
      <BankaiText size="sm" tone="muted">
        Utilities win by ordinary specificity: <code>col-span-*</code>/<code>row-span-*</code> on
        children and <code>grid-cols-*</code>/<code>grid-rows-*</code> on the root all override the
        theme. One caveat — the theme also sets <code>grid-template-areas</code>, which governs
        where the named regions land and implies its own column count. Overriding only
        <code>grid-template-columns</code> (e.g. <code>grid-cols-3</code>) while the areas remain
        leaves a stray empty track and the regions still pinned to their areas; to go fully
        line-based, also clear the template with <code>grid-template-areas: none</code>.
      </BankaiText>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Slots</BankaiText>
      <div class="slots-wrap">
        <table class="slots">
          <thead>
            <tr>
              <th>Slot</th>
              <th>Element</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in slots" :key="row.slot">
              <td>
                <code>{{ row.slot }}</code>
              </td>
              <td>
                <code>{{ row.element }}</code>
              </td>
              <td>{{ row.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </article>
</template>

<style scoped>
.doc {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.doc-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Mirrors BankaiLayout's default grid, but with plain divs so no landmark is emitted. */
.diagram {
  display: grid;
  grid-template-columns: 8rem 1fr;
  grid-template-rows: auto 6rem auto;
  grid-template-areas:
    'header  header'
    'sidebar main'
    'footer  footer';
  gap: 0.25rem;
  max-width: 28rem;
}

.cell {
  display: grid;
  place-items: center;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background: color-mix(in oklch, currentcolor 10%, transparent);
  font-size: var(--bankai-text-size-sm, 0.875rem);
}

.cell.header {
  grid-area: header;
}

.cell.sidebar {
  grid-area: sidebar;
}

.cell.main {
  grid-area: main;
}

.cell.footer {
  grid-area: footer;
}

.code {
  margin: 0;
  padding: 1.25rem;
  overflow-x: auto;
  border-radius: 0.75rem;
  background: color-mix(in oklch, currentcolor 6%, transparent);
  font-size: var(--bankai-text-size-sm, 0.875rem);
  line-height: 1.6;
}

.slots-wrap {
  overflow-x: auto;
}

.slots {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--bankai-text-size-sm, 0.875rem);
}

.slots th,
.slots td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--bankai-color-border, currentColor);
}

.slots th {
  font-weight: 600;
  white-space: nowrap;
}

.slots code {
  white-space: nowrap;
}
</style>
