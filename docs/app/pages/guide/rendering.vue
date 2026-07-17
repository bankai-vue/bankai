<script setup lang="ts">
definePageMeta({ layout: 'docs' });
useHead({ title: 'SSR, SPA & routing · bankai-vue' });

// Samples with `<Bankai*>` tags live here as strings so the template renders them verbatim rather than
// parsing them as HTML. Tag-free samples (tsconfig / config) are inline <pre> blocks below.
const linkUsage = `<template>
  <!-- Internal: renders NuxtLink / RouterLink if a router is installed, else a plain <a href="/about">. -->
  <BankaiLink to="/about">About</BankaiLink>

  <!-- External: always a native <a>, marked data-bankai-external, with rel="noopener noreferrer". -->
  <BankaiLink href="https://example.com" target="_blank">Docs</BankaiLink>
</template>`;

const tsconfigTypes = `// tsconfig.json — type BankaiLink's \`to\` as vue-router's RouteLocationRaw
{
  "compilerOptions": {
    "types": ["@bankai-vue/core/vue-router"]
  }
}`;

const linkOriginVite = `import { createBankai } from '@bankai-vue/core';

app.use(
  createBankai({
    // Your canonical site origin — makes the external-host check accurate and
    // identical on server and client (hydration-safe) under SSR/SSG.
    linkOrigin: 'https://example.com',
  }),
);`;

const linkOriginNuxt = `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@bankai-vue/nuxt'],
  css: ['@bankai-vue/theme-bankai'],

  bankai: {
    config: { linkOrigin: 'https://example.com' },
  },
});`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">SSR, SPA &amp; routing</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        bankai-vue components behave the same in a client-only Vue app (SPA) and under Nuxt server
        rendering (SSR) or static generation (SSG). This page covers what makes that work — the
        hydration model, how <BankaiCode>BankaiLink</BankaiCode> finds your router, and the one
        config value you should set when you server-render.
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Environments</BankaiText>
        <ul class="doc-list">
          <li>
            <strong>SPA (Vite).</strong> Install the plugin with
            <BankaiCode>createBankai()</BankaiCode> and import components where you use them.
            Everything runs on the client.
          </li>
          <li>
            <strong>Nuxt SSR / SSG.</strong> The
            <BankaiLink to="/guide/getting-started" class="doc-link">Nuxt module</BankaiLink>
            auto-registers every component and installs the config <em>per app</em> via a generated
            plugin — so under SSR each request gets its own reactive config, with no cross-request
            leakage.
          </li>
        </ul>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Hydration model</BankaiText>
        <BankaiText as="p" tone="muted">
          Components are SSR-safe by design: they generate hydration-stable ids (Vue's
          <BankaiCode>useId</BankaiCode>) and read no <BankaiCode>window</BankaiCode> or
          <BankaiCode>document</BankaiCode> during setup, so the server HTML and the client's first
          render always agree.
        </BankaiText>
        <BankaiText as="p" tone="muted">
          Any state that can only be known on the client is deliberately withheld until
          <em>after</em> hydration, then updates reactively. The clearest example is
          <BankaiCode>BankaiLink</BankaiCode>'s <BankaiCode>data-bankai-external</BankaiCode> flag:
          on the server and the first client render it is computed from
          <BankaiCode>linkOrigin</BankaiCode> (or an origin-less fallback); the accurate
          <BankaiCode>window.location</BankaiCode>-based host check only kicks in once the component
          has mounted. That is why the flag never causes a hydration mismatch.
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Router detection</BankaiText>
        <BankaiText as="p" tone="muted">
          <BankaiCode>BankaiLink</BankaiCode> renders the right element for internal
          (<BankaiCode>to</BankaiCode>) navigation with no wiring, resolved in this order:
        </BankaiText>
        <ol class="doc-list">
          <li>
            an explicit <BankaiCode>linkComponent</BankaiCode> override in
            <BankaiCode>BankaiConfig</BankaiCode>, if you set one;
          </li>
          <li>
            a globally-registered <BankaiCode>NuxtLink</BankaiCode> (preferred under Nuxt — it adds
            prefetch, base-URL, and external-URL handling);
          </li>
          <li>
            a globally-registered <BankaiCode>RouterLink</BankaiCode> (a plain vue-router app);
          </li>
          <li>otherwise a native <BankaiCode>&lt;a&gt;</BankaiCode> — no router installed.</li>
        </ol>
        <BankaiText as="p" tone="muted">
          Detection reads the app's global component registry, which is exactly where
          <BankaiCode>vue-router</BankaiCode> and Nuxt register these — so core never imports a
          router and stays dependency-free. A <BankaiCode>string</BankaiCode>
          <BankaiCode>to</BankaiCode> with no router degrades to a plain
          <BankaiCode>&lt;a href&gt;</BankaiCode>.
        </BankaiText>
        <pre class="code-block"><code>{{ linkUsage }}</code></pre>
        <BankaiText as="h3" size="lg" weight="semibold">vue-router types (opt-in)</BankaiText>
        <BankaiText as="p" tone="muted">
          By default <BankaiCode>to</BankaiCode> is a router-agnostic type. If you use vue-router,
          add the types entry to your <BankaiCode>tsconfig.json</BankaiCode> to type it as
          vue-router's <BankaiCode>RouteLocationRaw</BankaiCode>. It is an opt-in augmentation, so a
          router-free app stays dependency-free.
        </BankaiText>
        <pre class="code-block"><code>{{ tsconfigTypes }}</code></pre>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold"
          >Set <BankaiCode>linkOrigin</BankaiCode> when you server-render</BankaiText
        >
        <BankaiText as="p" tone="muted">
          To decide a link is external, <BankaiCode>BankaiLink</BankaiCode> compares its
          <BankaiCode>href</BankaiCode> host against a reference origin. On the server there is no
          <BankaiCode>window</BankaiCode> — and under SSG there is no request at all — so the
          current origin is not knowable at render time.
        </BankaiText>
        <BankaiText as="p" tone="muted">
          Set <BankaiCode>linkOrigin</BankaiCode> to your canonical site origin so the check is
          accurate and identical on server and client. A client-only SPA can leave it unset — it
          falls back to <BankaiCode>window.location</BankaiCode> after hydration; with no origin
          available at all, any absolute <BankaiCode>http(s)</BankaiCode> URL is treated as
          external.
        </BankaiText>
        <pre class="code-block"><code>{{ linkOriginVite }}</code></pre>
        <pre class="code-block"><code>{{ linkOriginNuxt }}</code></pre>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">See also</BankaiText>
        <BankaiText as="p" tone="muted">
          <BankaiLink to="/guide/getting-started" class="doc-link">Getting started</BankaiLink>
          for install and configuration, and
          <BankaiLink to="/components/link" class="doc-link">BankaiLink</BankaiLink>
          for its full props and reflected state.
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

/* Interim block-code look → future <BankaiCodeBlock>. Scrolls horizontally so a long line never
   forces the page body to scroll sideways. */
.code-block {
  margin: 0;
  padding: 1rem 1.25rem;
  overflow-x: auto;
  border: 1px solid var(--bankai-color-border, currentColor);
  border-radius: 0.75rem;
  background: color-mix(in oklch, currentcolor 4%, transparent);
  font-size: var(--bankai-text-size-sm, 0.875rem);
  line-height: 1.6;
}

.code-block code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  white-space: pre;
}
</style>
