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
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiAside</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        A standalone <BankaiCode>&lt;aside&gt;</BankaiCode> complementary region — a side rail
        beside the main content, typically a sidebar nav. The native element carries the
        <BankaiCode>complementary</BankaiCode> role; the theme paints the house side-rail look
        (padding and an inline-end divider). Reach for it when you build a shell <em>without</em>
        <BankaiCode>BankaiLayout</BankaiCode>.
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Usage</BankaiText>
        <CodeBlock language="html" :code="usage" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
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
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
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
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiAside" />
    </BankaiFlex>
  </BankaiPage>
</template>
