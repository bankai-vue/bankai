<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiContainer · bankai-vue' });

// The two theme knobs, documented so a consumer knows what to override (both are `:where(:root)` custom
// properties, so a single plain declaration retunes them — no selector, no `!important`).
interface TokenRow {
  token: string;
  purpose: string;
}

const tokens: TokenRow[] = [
  {
    token: '--bankai-container-max-width',
    purpose: 'The centered content cap (house default 80rem). Ignored when fluid.',
  },
  {
    token: '--bankai-container-gutter',
    purpose: 'Inline padding so content never kisses the edge when the box is edge-to-edge.',
  },
];

// The max-width is shrunk on the demo wrappers (a plain declaration beats the theme's zero-specificity
// token) so the centered container's side bars are visible in a narrow doc column.
</script>

<template>
  <article class="doc">
    <BankaiText as="h1" size="2xl" weight="black">BankaiContainer</BankaiText>
    <BankaiText as="p" size="lg" tone="muted">
      A width utility: centered at a themeable max-width by default, edge-to-edge with
      <BankaiCode>fluid</BankaiCode>. Reusable anywhere — a Card, a section, a hero — not once per
      route. The width layer of App › Layout › Page › Container (SPEC §5.6); it is not a landmark
      and never renders its own <BankaiCode>&lt;main&gt;</BankaiCode>.
    </BankaiText>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Example</BankaiText>
      <div class="demo">
        <BankaiText size="sm" tone="muted">default — centered at max-width</BankaiText>
        <div class="bounds">
          <BankaiContainer class="box">centered</BankaiContainer>
        </div>

        <BankaiText size="sm" tone="muted">fluid — fills the available width</BankaiText>
        <div class="bounds">
          <BankaiContainer fluid class="box">fluid</BankaiContainer>
        </div>
      </div>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold"
        >Responsive by available space, not the viewport</BankaiText
      >
      <BankaiText size="sm" tone="muted">
        The centered width is intrinsic: <BankaiCode>max-inline-size</BankaiCode> resolves against
        the containing block, and <BankaiCode>margin-inline: auto</BankaiCode> centers within it. So
        a container caps at its max-width when there is room (bars on the sides) and
        <strong>collapses to edge-to-edge on its own</strong> when its parent is narrower — with no
        media queries. This is deliberate (SPEC §4.19): it stays correct inside an embedded or
        split-screen pane, where the viewport is wide but the container's box is only a fraction of
        it — the case a viewport breakpoint gets wrong. <BankaiCode>fluid</BankaiCode> is for the
        opposite intent: fill the width <em>even when</em> there is room for bars (full-bleed
        heroes, dashboards). A full-bleed hero over a centered body is just two containers at
        different widths.
      </BankaiText>
    </section>

    <ComponentApi :meta="componentMeta.BankaiContainer" />

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Theming the width</BankaiText>
      <BankaiText size="sm" tone="muted">
        The cap and gutter are custom properties, so you retune the width by overriding one property
        (no selector needed) — globally on <BankaiCode>:root</BankaiCode>, or locally on any
        ancestor.
      </BankaiText>
      <div class="tokens-wrap">
        <table class="tokens">
          <thead>
            <tr>
              <th>Token</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tokens" :key="row.token">
              <td>
                <BankaiCode>{{ row.token }}</BankaiCode>
              </td>
              <td>{{ row.purpose }}</td>
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

.demo {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
}

/* Marks the available width the container lays out within, and shrinks the cap so the centered box
   shows its bars in the narrow doc column. */
.bounds {
  --bankai-container-max-width: 18rem;
  outline: 1px dashed var(--bankai-color-border, currentColor);
}

.box {
  padding-block: 0.75rem;
  text-align: center;
  border-radius: 0.5rem;
  background: color-mix(in oklch, currentcolor 10%, transparent);
}

.tokens-wrap {
  overflow-x: auto;
}

.tokens {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--bankai-text-size-sm, 0.875rem);
}

.tokens th,
.tokens td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--bankai-color-border, currentColor);
}

.tokens th {
  font-weight: 600;
  white-space: nowrap;
}

.tokens code {
  white-space: nowrap;
}
</style>
