<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiApp · bankai-vue' });

// BankaiApp is the infra singleton at the root of the App structure. It lands thin — the interesting
// content is WHAT it does today (the embedded-mode surface), WHY it is a singleton, and WHAT is deferred.

const usage = `<!-- the outermost wrapper of an application -->
<template>
  <BankaiApp>
    <BankaiLayout>… header / main / footer …</BankaiLayout>
  </BankaiApp>
</template>`;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiText as="h1" size="2xl" weight="black">BankaiApp</BankaiText>
      <BankaiText as="p" size="lg" tone="muted">
        The infra singleton at the root of an application — the outermost layer of App › Layout ›
        Page › Container. It renders a plain <BankaiCode>&lt;div&gt;</BankaiCode> and is
        <em>not</em> a landmark.
      </BankaiText>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Usage</BankaiText>
        <BankaiCodeBlock language="vue" :code="usage" />
        <BankaiText size="sm" tone="muted">
          Wrap your application once at the root. It is a <strong>singleton</strong>: its services
          are provided by injection, so nesting an App inside another App would silently shadow the
          outer one — <BankaiCode>ancestor/descendant nesting is discouraged</BankaiCode>. Placing
          Apps <strong>side by side</strong> is legitimate (embedded micro-frontends, split-screen).
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Embedded-mode surface</BankaiText>
        <BankaiText size="sm" tone="muted">
          Its one job today is a <strong>self-contained surface</strong>: the theme carries
          <BankaiCode>color-scheme</BankaiCode> and the foundation
          <BankaiCode>--bankai-color-bg</BankaiCode>/<BankaiCode>-fg</BankaiCode> tokens on the
          App's <em>own</em> box. So a bankai island dropped into a foreign page paints the house
          light/dark surface for its subtree <strong>without</strong> the global
          <BankaiCode>html</BankaiCode> page paint (which an embedded consumer can sever). The box
          below sits on a non-house background to show its own painted surface:
        </BankaiText>
        <div class="app-demo">
          <BankaiApp class="app-box">
            <BankaiText size="sm">Self-contained bankai island</BankaiText>
          </BankaiApp>
        </div>
        <BankaiText size="sm" tone="muted">
          Every theme rule is zero-specificity (<BankaiCode>:where()</BankaiCode>), so a plain
          declaration or utility class overrides it without <BankaiCode>!important</BankaiCode>.
        </BankaiText>
      </BankaiFlex>

      <BankaiFlex as="section" direction="column" gap="8">
        <BankaiText as="h2" size="xl" weight="bold">Lands thin</BankaiText>
        <BankaiText size="sm" tone="muted">
          <BankaiCode>BankaiApp</BankaiCode> takes no props today. Its richer infra role — a single
          overlay/portal mount target, a toast host and an app-config context — arrives with the
          overlay foundation, when the overlay root it would provide first has consumers. Until then
          it ships only the surface, rather than a speculative empty API.
        </BankaiText>
      </BankaiFlex>

      <ComponentApi :meta="componentMeta.BankaiApp" />
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
/* A non-house "foreign host" surface so the embedded App's own painted surface is visible against it. */
.app-demo {
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: oklch(70% 0.03 250);
}

.app-box {
  padding: 1rem;
  border-radius: 0.375rem;
}
</style>
