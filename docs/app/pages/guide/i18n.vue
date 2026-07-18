<script setup lang="ts">
import * as coreLocales from '@bankai-vue/core/locales';

const { t } = useI18n();

definePageMeta({ layout: 'docs' });
// Function form so the title re-evaluates when the locale switches. NOTE: the coverage table below
// measures bankai's COMPONENT-i18n (`@bankai-vue/core/locales`) — a separate system from this
// docs-site i18n. Its logic is deliberately left untouched; only this page's title/prose is localized.
useHead(() => ({ title: t('pages.i18n.title') }));

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
      <BankaiText as="h1" size="2xl" weight="black">{{ t('guide.i18n.name') }}</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        <i18n-t keypath="i18nPage.lede" tag="span" scope="global">
          <template #copy
            ><em>{{ t('i18nPage.ledeCopy') }}</em></template
          >
        </i18n-t>
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('i18nPage.registerHeading') }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="i18nPage.registerBody1" tag="span" scope="global">
            <template #messages><BankaiCode>i18n.messages</BankaiCode></template>
            <template #locale><BankaiCode>i18n.locale</BankaiCode></template>
            <template #de><BankaiCode>de</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="ts" :code="registerVite" />
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="i18nPage.registerBody2" tag="span" scope="global">
            <template #locale><BankaiCode>i18n.locale</BankaiCode></template>
            <template #messages><BankaiCode>messages</BankaiCode></template>
            <template #messages2><BankaiCode>messages</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="ts" :code="registerNuxt" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('i18nPage.coverageHeading') }}</BankaiText>
        <BankaiText as="p" tone="muted">{{ t('i18nPage.coverageBody') }}</BankaiText>
        <div class="coverage-wrap">
          <table class="coverage-table">
            <thead>
              <tr>
                <th scope="col">{{ t('i18nPage.coverageColLocale') }}</th>
                <th scope="col">{{ t('i18nPage.coverageColCoverage') }}</th>
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
                      {{ row.percent }}% · {{ row.done }}/{{ row.total }}
                      {{ t('i18nPage.coverageStrings') }}
                    </BankaiText>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <BankaiFlex class="contribute-banner" direction="column" gap="3">
          <BankaiText as="p" weight="semibold">{{ t('i18nPage.contributeHeading') }}</BankaiText>
          <BankaiText as="p" size="sm" tone="muted">{{ t('i18nPage.contributeBody') }}</BankaiText>
          <BankaiLink
            href="https://github.com/bankai-vue/bankai/tree/main/packages/core/src/i18n/locales"
            target="_blank"
            class="doc-link"
          >
            {{ t('i18nPage.contributeLink') }}
          </BankaiLink>
        </BankaiFlex>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('i18nPage.overrideHeading') }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="i18nPage.overrideBody" tag="span" scope="global">
            <template #partial
              ><em>{{ t('i18nPage.overridePartial') }}</em></template
            >
            <template #messages><BankaiCode>messages</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="ts" :code="partial" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('i18nPage.regionalHeading') }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="i18nPage.regionalBody" tag="span" scope="global">
            <template #deAt><BankaiCode>de-AT</BankaiCode></template>
            <template #de><BankaiCode>de</BankaiCode></template>
            <template #deAt2><BankaiCode>de-AT</BankaiCode></template>
            <template #fallbackLocale><BankaiCode>fallbackLocale</BankaiCode></template>
            <template #fallbackLocale2><BankaiCode>fallbackLocale</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="ts" :code="fallback" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{
          t('i18nPage.precedenceHeading')
        }}</BankaiText>
        <BankaiText as="p" tone="muted">{{ t('i18nPage.precedenceIntro') }}</BankaiText>
        <ol class="doc-list">
          <li>
            <i18n-t keypath="i18nPage.precedenceItem1" tag="span" scope="global">
              <template #prop
                ><strong>{{ t('i18nPage.precedenceItem1Prop') }}</strong></template
              >
              <template #example
                ><BankaiCode>&lt;BankaiCodeBlock copy-label="…"&gt;</BankaiCode></template
              >
            </i18n-t>
          </li>
          <li>
            <i18n-t keypath="i18nPage.precedenceItem2" tag="span" scope="global">
              <template #bundle
                ><strong>{{ t('i18nPage.precedenceItem2Bundle') }}</strong></template
              >
            </i18n-t>
          </li>
          <li>
            <i18n-t keypath="i18nPage.precedenceItem3" tag="span" scope="global">
              <template #english
                ><strong>{{ t('i18nPage.precedenceItem3English') }}</strong></template
              >
            </i18n-t>
          </li>
        </ol>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('i18nPage.runtimeHeading') }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="i18nPage.runtimeBody" tag="span" scope="global">
            <template #locale><BankaiCode>i18n.locale</BankaiCode></template>
          </i18n-t>
        </BankaiText>
        <CodeBlock language="vue" :code="runtime" />
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">{{ t('ui.seeAlso') }}</BankaiText>
        <BankaiText as="p" tone="muted">
          <i18n-t keypath="i18nPage.seeAlsoBody" tag="span" scope="global">
            <template #link>
              <BankaiLink to="/components/code-block" class="doc-link">BankaiCodeBlock</BankaiLink>
            </template>
            <template #copyLabel><BankaiCode>copyLabel</BankaiCode></template>
            <template #copiedLabel><BankaiCode>copiedLabel</BankaiCode></template>
          </i18n-t>
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
