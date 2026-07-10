<script setup lang="ts">
import { BankaiCode, BankaiText } from '@bankai-vue/core';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiCode · bankai-vue' });

// The two theme knobs, documented so a consumer knows what to override (both are `:where(:root)` custom
// properties / tokens, so a single plain declaration retunes them — no selector, no `!important`).
interface TokenRow {
  token: string;
  purpose: string;
}

const tokens: TokenRow[] = [
  {
    token: '--bankai-code-bg',
    purpose: 'The inline chip background (house default: the surface role).',
  },
  {
    token: '--bankai-code-radius',
    purpose: 'The corner radius (house default: --bankai-radius).',
  },
  {
    token: '--bankai-code-font-size',
    purpose: 'The chip font-size, em-relative so it scales with the surrounding text.',
  },
  {
    token: '--bankai-code-padding-block',
    purpose: 'Vertical padding, em-relative.',
  },
  {
    token: '--bankai-code-padding-inline',
    purpose: 'Horizontal padding, em-relative.',
  },
  {
    token: '--bankai-font-mono',
    purpose: 'The monospace font stack, shared with the future BankaiCodeBlock.',
  },
];
</script>

<template>
  <article class="doc">
    <BankaiText as="h1" size="2xl" weight="black">BankaiCode</BankaiText>
    <BankaiText as="p" size="lg" tone="muted">
      A minimal inline code primitive: a native <BankaiCode>&lt;code&gt;</BankaiCode> with a
      monospace font and a subtle chip background. Reach for it for an identifier, token, path, or
      short snippet inside a sentence — the block, fenced variant is a separate
      <BankaiCode>BankaiCodeBlock</BankaiCode> (on the roadmap).
    </BankaiText>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Example</BankaiText>
      <div class="demo">
        <BankaiText as="p">
          Install <BankaiCode>pnpm add @bankai-vue/core</BankaiCode> and import
          <BankaiCode>BankaiCode</BankaiCode> from it.
        </BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          The size is <BankaiCode>em</BankaiCode>-relative, so a snippet like
          <BankaiCode>--bankai-code-bg</BankaiCode> stays proportional even in this smaller line.
        </BankaiText>
      </div>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Native semantics, no props</BankaiText>
      <BankaiText as="p" size="sm" tone="muted">
        It renders a real <BankaiCode>&lt;code&gt;</BankaiCode>, so the phrasing semantics live on
        the element itself (SPEC §4.9) — assistive tech and the browser treat it as code for free.
        Today it takes no props; it is a pure, themeable wrapper. A polymorphic
        <BankaiCode>as</BankaiCode> (to reach the sibling monospace elements
        <BankaiCode>&lt;kbd&gt;</BankaiCode>, <BankaiCode>&lt;samp&gt;</BankaiCode>,
        <BankaiCode>&lt;var&gt;</BankaiCode>) may arrive later if dogfooding calls for it — a
        non-breaking addition.
      </BankaiText>
    </section>

    <section class="doc-section">
      <BankaiText as="h2" size="xl" weight="bold">Theming</BankaiText>
      <BankaiText as="p" size="sm" tone="muted">
        Every theme rule is zero-specificity (<BankaiCode>:where()</BankaiCode>), so a single
        declaration or a utility class overrides the look without
        <BankaiCode>!important</BankaiCode>. Retune the chip by overriding a token — globally on
        <BankaiCode>:root</BankaiCode>, or locally on any ancestor.
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
