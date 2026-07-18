<script setup lang="ts">
// Docs wrapper over `BankaiCodeBlock` that adds Shiki syntax highlighting (see utils/highlight). The core
// component highlights nothing (SPEC.md §4.6); this layers highlighting on through its default slot — the
// sanctioned BYO-highlighter seam. `:code` stays the raw string, so the copy button still writes the
// exact source, never the highlighter's token markup.
import { highlightToTokens } from '../utils/highlight';

const { code, language } = defineProps<{ code: string; language: string }>();

// Highlight server-side (see utils/highlight for why): at prerender the token HTML is baked into the page
// payload, and a prod client route change reuses that payload — so Shiki never runs in the shipped client.
// Dev has no payload extraction, so the handler re-runs on client navigation; `import.meta.dev` lets it
// highlight there too (it is statically false in the prod build, so Shiki still tree-shakes out of the
// shipped bundle). Keyed on language + code so identical snippets are highlighted once and deduped.
const { data: tokens } = await useAsyncData(`codeblock:${language}:${code}`, () =>
  import.meta.server || import.meta.dev ? highlightToTokens(code, language) : Promise.resolve(null),
);
</script>

<template>
  <BankaiCodeBlock class="doc-code-block" :code="code" :language="language">
    <!-- Pre-highlighted markup through the default slot; `:code` remains the exact clipboard source.
      Falls back to the raw string if highlighting is unavailable (defensive — on the prerendered site
      `tokens` is always present). -->
    <span v-if="tokens" v-html="tokens" />
    <template v-else>{{ code }}</template>
  </BankaiCodeBlock>
</template>

<style scoped>
/* `v-html` tokens are not rewritten by scoped-style hashing, so reach them with `:deep()`. Each Shiki
   token carries `--shiki-light` / `--shiki-dark`; `light-dark()` resolves the pair against the active
   `color-scheme` — exactly like the house theme's own tokens (SPEC.md §4.18) — so the color-scheme toggle
   recolors code with no JS. Spans without the custom properties (the slot wrapper) keep the inherited
   panel color, since `var()` with no fallback invalidates the declaration. */
.doc-code-block :deep([data-part='code']) span {
  color: light-dark(var(--shiki-light), var(--shiki-dark));
}
</style>
