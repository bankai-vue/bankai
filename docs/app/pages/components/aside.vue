<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiAside · bankai-vue' });

// BankaiAside renders a native <aside> complementary region and the theme paints the side-rail look.
// Its one prop, `label`, sets aria-label — the interesting content is WHY (multiple complementary
// landmarks need names) and the "don't nest in BankaiLayout's #sidebar" caveat.

// Rendered as text (not live) so the page does not emit an extra complementary landmark inside the
// docs shell.
const usage = `<!-- a shell built WITHOUT BankaiLayout -->
<div class="shell">
  <BankaiAside label="Secondary navigation">
    <BankaiSidebar />
  </BankaiAside>
  <main>…</main>
</div>`;
</script>

<template>
  <BankaiPage>
    <article class="doc">
      <BankaiText as="h1" size="2xl" weight="black">BankaiAside</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        A standalone <BankaiCode>&lt;aside&gt;</BankaiCode> complementary region — a side rail
        beside the main content, typically a sidebar nav. The native element carries the
        <BankaiCode>complementary</BankaiCode> role; the theme paints the house side-rail look
        (padding and an inline-end divider). Reach for it when you build a shell <em>without</em>
        <BankaiCode>BankaiLayout</BankaiCode>.
      </BankaiText>

      <section class="doc-section">
        <BankaiText as="h2" size="xl" weight="bold">Usage</BankaiText>
        <pre class="code"><code>{{ usage }}</code></pre>
      </section>

      <section class="doc-section">
        <BankaiText as="h2" size="xl" weight="bold">Naming the landmark</BankaiText>
        <BankaiText size="sm" tone="muted">
          A page can hold more than one <BankaiCode>complementary</BankaiCode> landmark (a left nav
          and a right rail, say). When it does, each needs an accessible name so a screen reader's
          landmark list can tell them apart — pass <BankaiCode>label</BankaiCode>, which sets
          <BankaiCode>aria-label</BankaiCode> (e.g. <BankaiCode>"Secondary navigation"</BankaiCode>,
          <BankaiCode>"Filters"</BankaiCode>). A single, unambiguous aside can omit it. Your own
          <BankaiCode>aria-label</BankaiCode> / <BankaiCode>aria-labelledby</BankaiCode> takes
          precedence over the prop, so you can point at a visible heading instead.
        </BankaiText>
      </section>

      <section class="doc-section">
        <BankaiText as="h2" size="xl" weight="bold">Landmark uniqueness</BankaiText>
        <BankaiText size="sm" tone="muted">
          Do <strong>not</strong> place it inside <BankaiCode>BankaiLayout</BankaiCode>'s
          <BankaiCode>#sidebar</BankaiCode> slot: <BankaiCode>BankaiLayout</BankaiCode> already
          emits an <BankaiCode>&lt;aside&gt;</BankaiCode> for that slot, so a nested
          <BankaiCode>BankaiAside</BankaiCode> would produce an
          <BankaiCode>&lt;aside&gt;</BankaiCode> inside an <BankaiCode>&lt;aside&gt;</BankaiCode>.
          With <BankaiCode>BankaiLayout</BankaiCode>, drop your sidebar straight into
          <BankaiCode>#sidebar</BankaiCode>; use <BankaiCode>BankaiAside</BankaiCode> only for a
          hand-rolled shell or a second rail. Every theme rule is zero-specificity
          (<BankaiCode>:where()</BankaiCode>), so a plain declaration or utility class overrides the
          padding, divider, or background without <BankaiCode>!important</BankaiCode>.
        </BankaiText>
      </section>

      <ComponentApi :meta="componentMeta.BankaiAside" />
    </article>
  </BankaiPage>
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

.code {
  margin: 0;
  padding: 1.25rem;
  overflow-x: auto;
  border-radius: 0.75rem;
  background: color-mix(in oklch, currentcolor 6%, transparent);
  font-size: var(--bankai-text-size-sm, 0.875rem);
  line-height: 1.6;
}
</style>
