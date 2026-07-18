<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiLayout · bankai-vue' });

// BankaiLayout has no configuration props: the grid tracks are controlled with plain CSS against
// `.bankai-layout` and the region classes (SPEC §5.6), not a `view`-string DSL. It composes the region
// components, so each slot maps to a `Bankai{Header,Aside,Main,Footer}` — documented in the generated
// Slots table (from the SFC's slot JSDoc).

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
.bankai-layout > .bankai-main {
  overflow: auto;
  min-block-size: 0;
}

/* or, in the page-scroll default, just pin the header on scroll */
.bankai-layout > .bankai-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
}`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiLayout</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="comp.layout.lede" tag="span" scope="global">
          <template #regions
            ><BankaiCode>&lt;header&gt;</BankaiCode
            >/<BankaiCode>&lt;aside&gt;</BankaiCode>/<BankaiCode>&lt;main&gt;</BankaiCode>/<BankaiCode
              >&lt;footer&gt;</BankaiCode
            ></template
          >
          <template #cls><BankaiCode>.bankai-layout</BankaiCode></template>
          <template #view><BankaiCode>view</BankaiCode></template>
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('comp.layout.structureHeading')
        }}</BankaiText>
        <BankaiText size="sm" tone="muted">{{ t('comp.layout.structureBody') }}</BankaiText>
        <!-- A plain-div diagram, NOT a live BankaiLayout: rendering one here would emit a <main> inside
           the docs shell's <main>, the very landmark clash the component prevents. -->
        <div class="diagram" aria-hidden="true">
          <div class="cell header">header</div>
          <div class="cell sidebar">sidebar</div>
          <div class="cell main">main</div>
          <div class="cell footer">footer</div>
        </div>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.usage') }}</BankaiText>
        <CodeBlock language="html" :code="usage" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('comp.layout.customizingHeading')
        }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.layout.customizingBody" tag="span" scope="global">
            <template #bankaiLayout><BankaiCode>BankaiLayout</BankaiCode></template>
            <template #where><BankaiCode>:where()</BankaiCode></template>
            <template #important><BankaiCode>!important</BankaiCode></template>
            <template #gridArea><BankaiCode>grid-area: header</BankaiCode></template>
            <template #gridTemplateAreas><BankaiCode>grid-template-areas</BankaiCode></template>
            <template #cls><BankaiCode>.bankai-layout</BankaiCode></template>
            <template #order><BankaiCode>header → sidebar → main → footer</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="css" :code="overrideCss" />

        <BankaiText as="h3" size="lg" weight="semibold">{{
          t('comp.layout.rtlHeading')
        }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.layout.rtlBody" tag="span" scope="global">
            <template #cols><BankaiCode>grid-template-columns: auto 1fr</BankaiCode></template>
            <template #minBlockSize><BankaiCode>min-block-size</BankaiCode></template>
            <template #rtl><BankaiCode>dir="rtl"</BankaiCode></template>
          </i18n-t>
        </BankaiText>

        <BankaiText as="h3" size="lg" weight="semibold">{{
          t('comp.layout.scrollHeading')
        }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.layout.scrollBody" tag="span" scope="global">
            <template #sidebar><BankaiCode>sidebar</BankaiCode></template>
            <template #main><BankaiCode>main</BankaiCode></template>
            <template #fr><BankaiCode>1fr</BankaiCode></template>
            <template #minBlockSize><BankaiCode>min-block-size: 100dvh</BankaiCode></template>
            <template #main2><BankaiCode>main</BankaiCode></template>
            <template #main3><BankaiCode>main</BankaiCode></template>
            <template #positionFixed><BankaiCode>position: fixed</BankaiCode></template>
            <template #alignSelf><BankaiCode>align-self: start</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="css" :code="scrollCss" />

        <BankaiText as="h3" size="lg" weight="semibold">{{
          t('comp.layout.tailwindHeading')
        }}</BankaiText>
        <BankaiText size="sm" tone="muted">
          <i18n-t keypath="comp.layout.tailwindBody" tag="span" scope="global">
            <template #colSpan><BankaiCode>col-span-*</BankaiCode></template>
            <template #rowSpan><BankaiCode>row-span-*</BankaiCode></template>
            <template #gridCols><BankaiCode>grid-cols-*</BankaiCode></template>
            <template #gridRows><BankaiCode>grid-rows-*</BankaiCode></template>
            <template #gridTemplateAreas><BankaiCode>grid-template-areas</BankaiCode></template>
            <template #gridTemplateColumns><BankaiCode>grid-template-columns</BankaiCode></template>
            <template #gridCols3><BankaiCode>grid-cols-3</BankaiCode></template>
            <template #areasNone><BankaiCode>grid-template-areas: none</BankaiCode></template>
          </i18n-t>
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiLayout" />
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
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
</style>
