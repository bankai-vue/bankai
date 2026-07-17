<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiHeader · bankai-vue' });

// BankaiHeader has no configuration props: it renders a native <header> banner region and the theme
// paints the house bar look. The interesting content — when it IS vs. IS NOT the banner landmark, and
// why not to nest it in BankaiLayout's #header — is prose, not a props table.

// Rendered as text (not live) so the page does not emit a second <header> banner inside the docs
// shell — landmark uniqueness is exactly the concern BankaiHeader documents.
const usage = `<!-- a shell built WITHOUT BankaiLayout -->
<BankaiHeader>
  <BankaiNavbar />
</BankaiHeader>
<main>…</main>`;

const stickyCss = `/* the header paints the page background, so a sticky bar covers content scrolling under it */
.bankai-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
}`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiHeader</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        A standalone <BankaiCode>&lt;header&gt;</BankaiCode> banner region — the top-of-page
        landmark that typically holds your navbar. The native element carries the
        <BankaiCode>banner</BankaiCode> role; the theme paints the house bar look (padding and a
        bottom border). Reach for it when you build a shell <em>without</em>
        <BankaiCode>BankaiLayout</BankaiCode>.
      </BankaiText>

      <section class="doc-section">
        <BankaiText as="h2" size="xl" weight="bold">Usage</BankaiText>
        <pre class="code"><code>{{ usage }}</code></pre>
      </section>

      <section class="doc-section">
        <BankaiText as="h2" size="xl" weight="bold">Landmark uniqueness</BankaiText>
        <BankaiText size="sm" tone="muted">
          A native <BankaiCode>&lt;header&gt;</BankaiCode> is the
          <BankaiCode>banner</BankaiCode> landmark only when it is <em>not</em> nested inside
          <BankaiCode>&lt;article&gt;</BankaiCode>, <BankaiCode>&lt;aside&gt;</BankaiCode>,
          <BankaiCode>&lt;main&gt;</BankaiCode>, <BankaiCode>&lt;nav&gt;</BankaiCode>, or
          <BankaiCode>&lt;section&gt;</BankaiCode> — so use <BankaiCode>BankaiHeader</BankaiCode> at
          the top level of your document, not deep inside content.
        </BankaiText>
        <BankaiText size="sm" tone="muted">
          Do <strong>not</strong> place it inside <BankaiCode>BankaiLayout</BankaiCode>'s
          <BankaiCode>#header</BankaiCode> slot: <BankaiCode>BankaiLayout</BankaiCode> already emits
          a <BankaiCode>&lt;header&gt;</BankaiCode> for that slot, so a nested
          <BankaiCode>BankaiHeader</BankaiCode> would produce a
          <BankaiCode>&lt;header&gt;</BankaiCode> inside a <BankaiCode>&lt;header&gt;</BankaiCode> —
          a duplicate banner landmark. With <BankaiCode>BankaiLayout</BankaiCode>, drop your navbar
          straight into <BankaiCode>#header</BankaiCode>; use
          <BankaiCode>BankaiHeader</BankaiCode> only for a hand-rolled shell.
        </BankaiText>
      </section>

      <section class="doc-section">
        <BankaiText as="h2" size="xl" weight="bold">Sticky header</BankaiText>
        <BankaiText size="sm" tone="muted">
          The theme paints the page background onto the header's own box, so a
          <BankaiCode>position: sticky</BankaiCode> bar stays opaque over content scrolling beneath
          it — no extra background needed. Every theme rule is zero-specificity
          (<BankaiCode>:where()</BankaiCode>), so a plain declaration or utility class overrides the
          padding, border, or background without <BankaiCode>!important</BankaiCode>.
        </BankaiText>
        <pre class="code"><code>{{ stickyCss }}</code></pre>
      </section>

      <ComponentApi :meta="componentMeta.BankaiHeader" />
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
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
