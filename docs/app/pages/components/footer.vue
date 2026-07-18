<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiFooter · bankai-vue' });

// BankaiFooter renders a native <footer> contentinfo region and the theme paints the house foot look
// (the mirror of the header). Its content — when it IS vs. IS NOT the contentinfo landmark, and why not
// to nest it in BankaiLayout's #footer — is prose, not a props table.

// Rendered as text (not live) so the page does not emit a second <footer> contentinfo inside the docs
// shell — landmark uniqueness is exactly the concern BankaiFooter documents.
const usage = `<!-- a shell built WITHOUT BankaiLayout -->
<BankaiMain>…</BankaiMain>
<BankaiFooter>
  <small>© 2026 bankai-vue</small>
</BankaiFooter>`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiFooter</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        A standalone <BankaiCode>&lt;footer&gt;</BankaiCode> contentinfo region — the foot of the
        page (copyright, secondary links, site meta). The native element carries the
        <BankaiCode>contentinfo</BankaiCode> role; the theme paints the house foot look, the mirror
        of <BankaiCode>BankaiHeader</BankaiCode> (padding and a top border). Reach for it when you
        build a shell <em>without</em> <BankaiCode>BankaiLayout</BankaiCode>.
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Usage</BankaiText>
        <BankaiCodeBlock language="vue" :code="usage" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Landmark uniqueness</BankaiText>
        <BankaiText size="sm" tone="muted">
          A native <BankaiCode>&lt;footer&gt;</BankaiCode> is the
          <BankaiCode>contentinfo</BankaiCode> landmark only when it is <em>not</em> nested inside
          <BankaiCode>&lt;article&gt;</BankaiCode>, <BankaiCode>&lt;aside&gt;</BankaiCode>,
          <BankaiCode>&lt;main&gt;</BankaiCode>, <BankaiCode>&lt;nav&gt;</BankaiCode>, or
          <BankaiCode>&lt;section&gt;</BankaiCode> — so use <BankaiCode>BankaiFooter</BankaiCode> at
          the top level of your document, not deep inside content.
        </BankaiText>
        <BankaiText size="sm" tone="muted">
          Do <strong>not</strong> place it inside <BankaiCode>BankaiLayout</BankaiCode>'s
          <BankaiCode>#footer</BankaiCode> slot: <BankaiCode>BankaiLayout</BankaiCode> already emits
          a <BankaiCode>&lt;footer&gt;</BankaiCode> for that slot, so a nested
          <BankaiCode>BankaiFooter</BankaiCode> would produce a
          <BankaiCode>&lt;footer&gt;</BankaiCode> inside a <BankaiCode>&lt;footer&gt;</BankaiCode> —
          a duplicate contentinfo landmark. With <BankaiCode>BankaiLayout</BankaiCode>, drop your
          footer content straight into <BankaiCode>#footer</BankaiCode>; use
          <BankaiCode>BankaiFooter</BankaiCode> only for a hand-rolled shell. Every theme rule is
          zero-specificity (<BankaiCode>:where()</BankaiCode>), so a plain declaration or utility
          class overrides the padding, border, or background without
          <BankaiCode>!important</BankaiCode>.
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiFooter" />
    </BankaiFlex>
  </BankaiPage>
</template>
