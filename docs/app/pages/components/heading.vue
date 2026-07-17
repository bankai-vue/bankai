<script setup lang="ts">
import { componentMeta } from '../../utils/component-meta.generated';

definePageMeta({ layout: 'docs' });
useHead({ title: 'BankaiHeading · bankai-vue' });

const levels = [1, 2, 3, 4, 5, 6] as const;
</script>

<template>
  <BankaiPage>
    <BankaiFlex as="article" direction="column" gap="12">
      <BankaiHeading :level="1">BankaiHeading</BankaiHeading>
      <BankaiText as="p" size="lg" tone="muted">
        A native <BankaiCode>&lt;h1&gt;</BankaiCode>–<BankaiCode>&lt;h6&gt;</BankaiCode> chosen by a
        required <BankaiCode>level</BankaiCode>. The element itself carries the document-outline
        semantics that assistive tech navigates by, so the level is always an explicit, deliberate
        choice — never a default.
      </BankaiText>

      <section class="doc-section">
        <BankaiHeading :level="2">The type scale</BankaiHeading>
        <BankaiText as="p" size="sm" tone="muted">
          Each level maps to a size step the theme paints (keyed on
          <BankaiCode>data-bankai-level</BankaiCode>). Headings ship
          <BankaiCode>margin: 0</BankaiCode> — spacing is the layout's job (<BankaiCode
            >BankaiFlex</BankaiCode
          >
          / <BankaiCode>BankaiStack</BankaiCode> <BankaiCode>gap</BankaiCode>).
        </BankaiText>
        <div class="demo">
          <BankaiHeading v-for="level in levels" :key="level" :level="level">
            Heading level {{ level }}
          </BankaiHeading>
        </div>
      </section>

      <section class="doc-section">
        <BankaiHeading :level="2">Level is required — and it means the outline</BankaiHeading>
        <BankaiText as="p" size="sm" tone="muted">
          There is no universally-safe default heading level, and a wrong one silently breaks the
          document outline screen-reader users navigate by — so <BankaiCode>level</BankaiCode> has
          no default and must be stated. Pick it by the heading's place in the page hierarchy (don't
          skip levels), not by how big you want it to look.
        </BankaiText>
        <BankaiText as="p" size="sm" tone="muted">
          Decoupling the visual size from the semantic level (an
          <BankaiCode>&lt;h2&gt;</BankaiCode> styled like an <BankaiCode>&lt;h1&gt;</BankaiCode>,
          the proper fix for wanting a size without skipping a level) is planned as a future
          <BankaiCode>size</BankaiCode> prop; today the visual size tracks the level.
        </BankaiText>
      </section>

      <ComponentApi :meta="componentMeta.BankaiHeading" />

      <section class="doc-section">
        <BankaiHeading :level="2">Theming the scale</BankaiHeading>
        <BankaiText as="p" size="sm" tone="muted">
          Every step is a <BankaiCode>--bankai-heading-*</BankaiCode> custom property (declared on
          <BankaiCode>:root</BankaiCode>), so you retune one size, its line height, the shared
          weight, or the color by overriding a single property — no selector, no
          <BankaiCode>!important</BankaiCode>. For example, override
          <BankaiCode>--bankai-heading-size-1</BankaiCode> to resize the level-1 step alone.
        </BankaiText>
      </section>
    </BankaiFlex>
  </BankaiPage>
</template>

<style scoped>
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
</style>
