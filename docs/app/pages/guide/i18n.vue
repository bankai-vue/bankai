<script setup lang="ts">
definePageMeta({ layout: 'docs' });
useHead({ title: 'Internationalization · bankai-vue' });

// Samples live here as strings so BankaiCodeBlock renders them verbatim.
const registerVite = `import { createBankai } from '@bankai-vue/core';
import { de } from '@bankai-vue/core/locales';

app.use(
  createBankai({
    i18n: {
      locale: 'de',
      // Only the bundles you register ship — unregistered locales are tree-shaken away.
      messages: { de },
    },
  }),
);`;

const registerNuxt = `// nuxt.config.ts — under Nuxt, just set the locale: the module auto-injects the
// matching built-in bundle (here 'de'), so no import or messages registration is needed.
export default defineNuxtConfig({
  modules: ['@bankai-vue/nuxt'],
  css: ['@bankai-vue/theme-bankai'],

  bankai: {
    config: { i18n: { locale: 'de' } },
  },
});`;

const partial = `import { createBankai } from '@bankai-vue/core';

app.use(
  createBankai({
    i18n: {
      locale: 'de',
      messages: {
        // A bundle may be partial — omitted keys fall through to English, never to an
        // empty string. So you can hand-write just the strings you want to change.
        de: { codeBlock: { copy: 'Kopieren' } },
      },
    },
  }),
);`;

const fallback = `createBankai({
  i18n: {
    locale: 'de-AT',      // regional: inherits every 'de' string automatically
    fallbackLocale: 'de', // tried before English for a locale with no bundle
    messages: { de },
  },
});`;

// The sample's closing script tag is built from `closeScript` so this SFC's own script block isn't
// ended early by a literal closing tag in the source (and there is no escape for the linter to flag).
const closeScript = `<${''}/script>`;
const runtime = `<script setup lang="ts">
import { useBankaiConfig } from '@bankai-vue/core';

const config = useBankaiConfig();

// Reactive: flipping the locale re-renders every component's default strings.
function toggle() {
  config.i18n.locale = config.i18n.locale === 'de' ? 'en' : 'de';
}
${closeScript}`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">Internationalization</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        Components ship English default strings — a copy button's <em>Copy</em>, and more as
        components grow. bankai-vue localizes them through one small config surface, so you set a
        locale once and every component's defaults follow. Per-instance props still override a
        single element.
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Register a locale</BankaiText>
        <BankaiText as="p" tone="muted">
          Locale bundles are opt-in, tree-shakeable exports. Import the ones you use, register them
          under <BankaiCode>i18n.messages</BankaiCode>, and set
          <BankaiCode>i18n.locale</BankaiCode>. A German (<BankaiCode>de</BankaiCode>) bundle ships
          today; English is the built-in base and needs no import.
        </BankaiText>
        <CodeBlock language="ts" :code="registerVite" />
        <BankaiText as="p" tone="muted">
          Under Nuxt it is even less: set <BankaiCode>i18n.locale</BankaiCode> and the module
          auto-injects the matching built-in bundle into its generated plugin — no import, no
          <BankaiCode>messages</BankaiCode> — as a static, tree-shaken, SSR-safe import. Register a
          bundle in <BankaiCode>messages</BankaiCode> only to override it or add a locale core
          doesn't ship. The config is installed per app, so it stays per-request under SSR.
        </BankaiText>
        <CodeBlock language="ts" :code="registerNuxt" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Override just some strings</BankaiText>
        <BankaiText as="p" tone="muted">
          A bundle can be <em>partial</em>. Any key you leave out falls through to the complete
          English base, so you can register a shipped bundle, hand-write a bundle for a locale that
          has none yet, or tweak a single string — all through the same
          <BankaiCode>messages</BankaiCode> registry.
        </BankaiText>
        <CodeBlock language="ts" :code="partial" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Regional variants &amp; fallback</BankaiText>
        <BankaiText as="p" tone="muted">
          A regional locale inherits its base language automatically:
          <BankaiCode>de-AT</BankaiCode> resolves every <BankaiCode>de</BankaiCode> string, and only
          the keys you give <BankaiCode>de-AT</BankaiCode> override it. Set
          <BankaiCode>fallbackLocale</BankaiCode> for a cross-family fallback (tried before the
          English base). The full chain is: active locale and its regional parents →
          <BankaiCode>fallbackLocale</BankaiCode> and its parents → English.
        </BankaiText>
        <CodeBlock language="ts" :code="fallback" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Precedence</BankaiText>
        <BankaiText as="p" tone="muted"> Each default string resolves in this order: </BankaiText>
        <ol class="doc-list">
          <li>
            a <strong>per-instance prop</strong> (e.g.
            <BankaiCode>&lt;BankaiCodeBlock copy-label="…"&gt;</BankaiCode>) — wins for that
            element;
          </li>
          <li>the <strong>active locale bundle</strong> resolved from the config;</li>
          <li>the built-in <strong>English default</strong>.</li>
        </ol>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Switching at runtime</BankaiText>
        <BankaiText as="p" tone="muted">
          The config is reactive, so assigning a new <BankaiCode>i18n.locale</BankaiCode> re-renders
          every component's labels — no reload, no re-mount.
        </BankaiText>
        <CodeBlock language="vue" :code="runtime" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">See also</BankaiText>
        <BankaiText as="p" tone="muted">
          <BankaiLink to="/components/code-block" class="doc-link">BankaiCodeBlock</BankaiLink>
          — the first component with localizable strings, and its
          <BankaiCode>copyLabel</BankaiCode> / <BankaiCode>copiedLabel</BankaiCode> props.
        </BankaiText>
      </BankaiFlex>
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
.doc-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding-left: 1.25rem;
}

.doc-link {
  color: inherit;
}
</style>
