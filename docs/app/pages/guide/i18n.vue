<script setup lang="ts">
import * as coreLocales from '@bankai-vue/core/locales';

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

// Locale coverage: how many message keys each shipped bundle defines vs. the complete English base.
// Computed from the real bundles (`@bankai-vue/core/locales`), so it stays honest as components add
// strings or new locales ship — a bundle missing newly-added keys drops below 100% here automatically.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function countCoverage(base: unknown, bundle: unknown): { done: number; total: number } {
  let done = 0;
  let total = 0;
  const walk = (baseNode: unknown, bundleNode: unknown): void => {
    if (!isRecord(baseNode)) {
      return;
    }
    const patch = isRecord(bundleNode) ? bundleNode : undefined;
    for (const [key, value] of Object.entries(baseNode)) {
      if (isRecord(value)) {
        walk(value, patch?.[key]);
      } else {
        total += 1;
        const translated = patch?.[key];
        // A present-but-empty/undefined leaf falls through to English, so it does not count as covered.
        if (typeof translated === 'string' && translated.length > 0) {
          done += 1;
        }
      }
    }
  };
  walk(base, bundle);
  return { done, total };
}

function languageName(code: string): string {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ?? code;
  } catch {
    // Intl.DisplayNames unavailable or the code is unrecognized — fall back to the raw code.
    return code;
  }
}

const localeRows = coreLocales.availableLocales.map((code) => {
  const { done, total } = countCoverage(coreLocales.en, Reflect.get(coreLocales, code));
  return {
    code,
    name: languageName(code),
    done,
    total,
    percent: total === 0 ? 100 : Math.round((done / total) * 100),
  };
});
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
        <BankaiText as="h2" size="xl" weight="bold">Locale coverage</BankaiText>
        <BankaiText as="p" tone="muted">
          English is the complete base — 100% by definition. Each shipped bundle covers a share of
          the message keys; whatever it omits falls through to English. As new components add
          default strings, a bundle's coverage drops until the new keys are translated.
        </BankaiText>
        <div class="coverage-wrap">
          <table class="coverage-table">
            <thead>
              <tr>
                <th scope="col">Locale</th>
                <th scope="col">Coverage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in localeRows" :key="row.code">
                <td>
                  <BankaiText as="span" weight="semibold">{{ row.name }}</BankaiText>
                  <BankaiCode>{{ row.code }}</BankaiCode>
                </td>
                <td>
                  <div class="coverage-cell">
                    <div class="coverage-bar" aria-hidden="true">
                      <div class="coverage-fill" :style="{ inlineSize: `${row.percent}%` }" />
                    </div>
                    <BankaiText as="span" size="sm" tone="muted">
                      {{ row.percent }}% · {{ row.done }}/{{ row.total }} strings
                    </BankaiText>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <BankaiFlex class="contribute-banner" direction="column" gap="3">
          <BankaiText as="p" weight="semibold">Missing your language?</BankaiText>
          <BankaiText as="p" size="sm" tone="muted">
            Locale bundles are small partial dictionaries — completing a bundle below 100%, or
            adding a language bankai-vue doesn't ship yet, is a great first contribution. Each is a
            plain object of message keys with English as the fallback, so you translate only what
            you want.
          </BankaiText>
          <BankaiLink
            href="https://github.com/bankai-vue/bankai/tree/main/packages/core/src/i18n/locales"
            target="_blank"
            class="doc-link"
          >
            Browse the locale bundles on GitHub →
          </BankaiLink>
        </BankaiFlex>
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

.coverage-wrap {
  overflow-x: auto;
}

.coverage-table {
  width: 100%;
  border-collapse: collapse;
}

.coverage-table th,
.coverage-table td {
  padding: 0.5rem 0.75rem;
  text-align: start;
  vertical-align: middle;
  border-bottom: 1px solid var(--bankai-color-border, currentColor);
}

.coverage-table th {
  font-weight: 600;
  white-space: nowrap;
}

.coverage-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.coverage-bar {
  inline-size: 8rem;
  block-size: 0.5rem;
  flex: none;
  overflow: hidden;
  border-radius: 999px;
  background: var(--bankai-color-border, currentColor);
}

.coverage-fill {
  block-size: 100%;
  border-radius: inherit;
  background: var(--bankai-color-primary, currentColor);
}

.contribute-banner {
  padding: 1rem 1.25rem;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: var(--bankai-radius, 0.5rem);
  background: var(--bankai-color-surface, transparent);
}
</style>
