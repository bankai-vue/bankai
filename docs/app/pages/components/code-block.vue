<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiCodeBlock · bankai-vue' });

// Live demo snippets.
const installExample = `pnpm add @bankai-vue/core @bankai-vue/theme-bankai`;

const usageExample = `<template>
  <BankaiCodeBlock language="ts" :code="snippet" />
</template>`;

// The theme tokens, documented so a consumer knows what to override (each is a `:where(:root)` custom
// property, so a single plain declaration overrides one — no selector, no `!important`).
interface TokenRow {
  token: string;
  purpose: string;
}

const tokens: TokenRow[] = [
  {
    token: '--bankai-code-block-bg',
    purpose: 'The panel background (house default: the surface role).',
  },
  {
    token: '--bankai-code-block-font-family',
    purpose: 'The panel font family (house default: --bankai-font-mono).',
  },
  {
    token: '--bankai-code-block-font-size',
    purpose: 'The code font-size (house default: --bankai-text-size-sm).',
  },
  {
    token: '--bankai-code-block-line-height',
    purpose: 'The code line-height.',
  },
  {
    token: '--bankai-code-block-radius',
    purpose: 'The corner radius (house default: --bankai-radius).',
  },
  {
    token: '--bankai-code-block-padding-block',
    purpose: 'Vertical padding of the scrolling panel.',
  },
  {
    token: '--bankai-code-block-padding-inline',
    purpose: 'Horizontal padding of the scrolling panel.',
  },
  {
    token: '--bankai-code-block-copy-offset',
    purpose: 'Inset of the copy button from the top inline-end corner.',
  },
];
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiCodeBlock</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        A block code primitive: a native <BankaiCode>&lt;pre&gt;&lt;code&gt;</BankaiCode> with a
        copy-to-clipboard button. For an identifier or short snippet inside a sentence, reach for
        the inline <BankaiCode>BankaiCode</BankaiCode> instead.
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Example</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          Pass the snippet as the <BankaiCode>code</BankaiCode> prop — it is both what renders and
          the exact string the copy button writes. Click <BankaiCode>Copy</BankaiCode> to try it.
        </BankaiText>
        <BankaiCodeBlock language="bash" :code="installExample" />
        <BankaiCodeBlock language="vue" :code="usageExample" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Bring your own highlighter</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          Core highlights nothing — it stays design- and tooling-agnostic. The
          <BankaiCode>language</BankaiCode> prop only reflects as a
          <BankaiCode>language-&lt;lang&gt;</BankaiCode> class on the
          <BankaiCode>&lt;code&gt;</BankaiCode>, the de-facto hook a highlighter (Shiki, Prism,
          highlight.js) or your own CSS keys off. To render already-highlighted markup, pass it
          through the default slot; the <BankaiCode>code</BankaiCode> prop stays the exact string
          the copy button writes, so the copied text is never the highlighter's wrapper markup.
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Accessible copy</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          The copy button is a composed <BankaiCode>BankaiButton</BankaiCode> whose accessible name
          tracks its visible label; a successful copy is announced (and re-announced on a repeat
          copy) through a visually hidden <BankaiCode>role="status"</BankaiCode> live region.
          Override the <BankaiCode>copyLabel</BankaiCode> /
          <BankaiCode>copiedLabel</BankaiCode> props to set both the button text and the
          announcement for one block, use the <BankaiCode>copy</BankaiCode> slot (which receives the
          <BankaiCode>copied</BankaiCode> state) to swap in an icon, or set
          <BankaiCode>:copyable="false"</BankaiCode> to drop the button entirely. The copied state's
          duration is tunable per-block via <BankaiCode>copiedDuration</BankaiCode> (ms) and
          globally via <BankaiCode>BankaiConfig.codeBlockCopiedDuration</BankaiCode> (default
          <BankaiCode>2000</BankaiCode>).
        </BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          To localize the labels <em>app-wide</em> rather than per block, set a locale in the i18n
          config instead of the props — see the
          <BankaiLink to="/guide/i18n" class="doc-link">internationalization guide</BankaiLink>. A
          per-block prop always wins over the configured locale.
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiCodeBlock" />

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Theming</BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          Every theme rule is zero-specificity (<BankaiCode>:where()</BankaiCode>), so a single
          declaration or a utility class overrides the look without
          <BankaiCode>!important</BankaiCode>. Retune the panel by overriding a token — globally on
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
      </BankaiFlex>
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
.doc-link {
  color: inherit;
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
