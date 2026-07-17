<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiPage · bankai-vue' });

// BankaiPage is the per-route content host. It takes no props and paints nothing but a min-block-size
// fill — the interesting content is WHY (not a landmark, "no black magic", why it lands thin).

const usage = `<!-- every route file starts with BankaiPage -->
<template>
  <BankaiPage>
    <BankaiContainer>… route content …</BankaiContainer>
  </BankaiPage>
</template>`;
</script>

<template>
  <article class="doc">
    <BankaiText as="h1" size="2xl" weight="black">BankaiPage</BankaiText>
    <BankaiText as="p" size="lg" tone="muted">
      The per-route content host — the box at the top of every route file. It sits inside the
      document's <BankaiCode>&lt;main&gt;</BankaiCode> and hosts a route's content; it is
      <em>not</em> a landmark of its own.
    </BankaiText>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Usage</BankaiText>
      <pre class="code"><code>{{ usage }}</code></pre>
      <BankaiText size="sm" tone="muted">
        The nesting is App › Layout › <strong>Page</strong> › Container:
        <BankaiCode>BankaiLayout</BankaiCode> (or a standalone <BankaiCode>BankaiMain</BankaiCode>)
        emits the <BankaiCode>&lt;main&gt;</BankaiCode>, <BankaiCode>BankaiPage</BankaiCode> hosts
        the route inside it, and <BankaiCode>BankaiContainer</BankaiCode> sets the content width.
      </BankaiText>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Fills the content region</BankaiText>
      <BankaiText size="sm" tone="muted">
        Its one house default is a <BankaiCode>min-block-size</BankaiCode> fill so a short route
        still occupies the full content region and pushes a footer to the bottom. The fill is
        <BankaiCode>100%</BankaiCode> of the containing block, <strong>not</strong> a
        <BankaiCode>100dvh</BankaiCode> viewport unit — a viewport height would break embedded or
        side-by-side panes where the box is a fraction of the window (it fills whatever space the
        parent gives it). Every theme rule is zero-specificity (<BankaiCode>:where()</BankaiCode>),
        so a plain declaration or utility class overrides it without
        <BankaiCode>!important</BankaiCode>.
      </BankaiText>
      <div class="page-demo">
        <BankaiPage class="page-box">
          <BankaiText size="sm">A short route still fills the height above.</BankaiText>
        </BankaiPage>
      </div>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Not a landmark, no black magic</BankaiText>
      <BankaiText size="sm" tone="muted">
        <BankaiCode>BankaiPage</BankaiCode> renders a plain <BankaiCode>&lt;div&gt;</BankaiCode> —
        it is deliberately not a landmark and never renders its own
        <BankaiCode>&lt;main&gt;</BankaiCode> (Layout's default slot already emits the sole one). It
        also does <strong>no</strong> implicit child-rewriting: there is no auto heading-level
        context, so a <BankaiCode>BankaiHeading</BankaiCode>'s tag is always explicit via its
        <BankaiCode>level</BankaiCode>. It lands thin today; per-route scroll and route-transition
        concerns arrive once there is routing to dogfood.
      </BankaiText>
    </section>

    <ComponentApi :meta="componentMeta.BankaiPage" />
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

.code {
  margin: 0;
  padding: 1.25rem;
  overflow-x: auto;
  border-radius: 0.75rem;
  background: color-mix(in oklch, currentcolor 6%, transparent);
  font-size: var(--bankai-text-size-sm, 0.875rem);
  line-height: 1.6;
}

/* Bound the live demo with a definite block size so the min-block-size fill is observable. */
.page-demo {
  block-size: 10rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  outline: 1px dashed color-mix(in oklch, currentcolor 30%, transparent);
}

.page-box {
  padding: 0.75rem;
  border-radius: 0.375rem;
  outline: 2px solid color-mix(in oklch, currentcolor 20%, transparent);
}
</style>
