<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiMain · bankai-vue' });

// BankaiMain renders a native <main> content region. It takes no props (the main landmark is unique,
// so there is no accessible-name prop) and paints nothing but a min-inline-size floor — the interesting
// content is WHY (landmark uniqueness, the overflow-floor, why no padding/background).

// Rendered as text (not live) so the page does not emit a second <main> inside the docs shell — the
// main landmark must be unique per document.
const usage = `<!-- a shell built WITHOUT BankaiLayout -->
<BankaiHeader>…</BankaiHeader>
<BankaiMain>
  <BankaiContainer>… page content …</BankaiContainer>
</BankaiMain>
<BankaiFooter>…</BankaiFooter>`;
</script>

<template>
  <BankaiPage>
    <article class="doc">
      <BankaiText as="h1" size="2xl" weight="black">BankaiMain</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        A standalone <BankaiCode>&lt;main&gt;</BankaiCode> content region — the document's primary
        content. The native element carries the <BankaiCode>main</BankaiCode> role. Reach for it
        when you build a shell <em>without</em> <BankaiCode>BankaiLayout</BankaiCode>.
      </BankaiText>

      <section class="doc-section">
        <BankaiText as="h2" size="xl" weight="bold">Usage</BankaiText>
        <pre class="code"><code>{{ usage }}</code></pre>
      </section>

      <section class="doc-section">
        <BankaiText as="h2" size="xl" weight="bold">One per document</BankaiText>
        <BankaiText size="sm" tone="muted">
          The <BankaiCode>main</BankaiCode> landmark must be <strong>unique</strong> — a page has
          exactly one <BankaiCode>&lt;main&gt;</BankaiCode>, so
          <BankaiCode>BankaiMain</BankaiCode> takes no accessible-name prop (unlike
          <BankaiCode>BankaiAside</BankaiCode>, of which there can be several). Do
          <strong>not</strong> place it inside a <BankaiCode>BankaiLayout</BankaiCode>: Layout's
          default slot already emits the sole <BankaiCode>&lt;main&gt;</BankaiCode>, so a nested
          <BankaiCode>BankaiMain</BankaiCode> would be a
          <BankaiCode>&lt;main&gt;</BankaiCode> inside a <BankaiCode>&lt;main&gt;</BankaiCode>.
        </BankaiText>
      </section>

      <section class="doc-section">
        <BankaiText as="h2" size="xl" weight="bold">What it paints</BankaiText>
        <BankaiText size="sm" tone="muted">
          Almost nothing — it <em>is</em> the page surface (no background), and content width and
          gutter belong to <BankaiCode>BankaiContainer</BankaiCode> (no padding). The one house
          default is a <BankaiCode>min-inline-size: 0</BankaiCode> floor: as a grid or flex child
          the region would otherwise floor at its content's min width, so a wide, unbreakable
          descendant (a long <BankaiCode>&lt;pre&gt;</BankaiCode>, a table) pushes the whole content
          column wider and causes horizontal overflow. Flooring at <BankaiCode>0</BankaiCode> lets
          the region shrink to its container and the descendant scroll or wrap within. Every theme
          rule is zero-specificity (<BankaiCode>:where()</BankaiCode>), so a plain declaration or
          utility class overrides it without <BankaiCode>!important</BankaiCode>.
        </BankaiText>
      </section>

      <ComponentApi :meta="componentMeta.BankaiMain" />
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
