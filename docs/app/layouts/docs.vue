<script setup lang="ts">
// Docs shell: <BankaiLayout> emits the header / sidebar / main / footer landmark regions, so this
// layout no longer hand-rolls <aside>/<main>. SiteHeader/SiteFooter slot into #header/#footer; the
// component nav slots into #sidebar (BankaiLayout wraps it in the <aside> complementary landmark);
// page content fills the sole <main>. The theme's `.bankai-layout` grid is a full-bleed shell, so the
// overrides below only retune the sidebar track / gutters (SPEC.md §4.4, §4.6). Interim → the sidebar
// nav becomes <BankaiSidebar> once it lands (ROADMAP Phase 1). NuxtLink marks the active route with
// aria-current for free.
import { nextTick, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { componentNav, guideNav } from '../utils/docs';

// Section headings on every docs page become linkable permalinks: each <h2>–<h6> inside the page
// gets a slug id and its text is wrapped in an anchor to `#id`, so a click sets the URL hash and a
// refresh scrolls straight to it. Done as a client-side enhancement in the layout (not per-page) so
// it covers every current and future page without touching the mixed <BankaiText as="h2"> /
// <BankaiHeading> markup pages use. Runs after mount (post-hydration → safe to mutate the DOM) and on
// each client navigation.
const route = useRoute();

/** Kebab-case slug from a heading's visible text, e.g. "Level is required — and…" → "level-is-required-and". */
function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // Drop punctuation (em dashes, slashes, …).
      .replaceAll(/[^\w\s-]/gu, '')
      // Collapse whitespace / underscores into a single hyphen.
      .replaceAll(/[\s_-]+/gu, '-')
      .replaceAll(/^-+|-+$/gu, '')
  );
}

/** Give one heading its permalink: wrap its text in an anchor to `#id` (or append a bare "#" when the
 *  heading already contains a link, so we never nest <a>s). */
function attachAnchor(heading: HTMLHeadingElement, id: string): void {
  heading.id = id;
  heading.dataset.anchored = 'true';
  const link = document.createElement('a');
  link.className = 'doc-heading-anchor';
  link.href = `#${id}`;

  if (heading.querySelector('a')) {
    link.classList.add('doc-heading-anchor--bare');
    link.textContent = '#';
    link.setAttribute('aria-label', `Permalink to ${heading.textContent ?? ''}`);
    heading.append(' ', link);
    return;
  }

  // Wrap the whole heading so the text itself is the clickable permalink.
  while (heading.firstChild) {
    link.append(heading.firstChild);
  }
  heading.append(link);
}

/** Assign ids and permalink anchors to every section heading on the page (idempotent per heading). */
function anchorHeadings(): void {
  const main = document.querySelector('.docs-main');
  if (!main) {
    return;
  }

  const used = new Set<string>();
  for (const heading of main.querySelectorAll<HTMLHeadingElement>('h2, h3, h4, h5, h6')) {
    // Skip headings inside a live-example box — those are illustrative, not navigable sections.
    if (heading.closest('.demo')) {
      continue;
    }

    if (heading.dataset.anchored) {
      used.add(heading.id);
      continue;
    }

    const base = heading.id || slugify(heading.textContent ?? '');
    if (!base) {
      continue;
    }

    // De-dupe within the page so repeated headings still get a unique, stable target.
    let id = base;
    for (let n = 2; used.has(id); n++) {
      id = `${base}-${n}`;
    }
    used.add(id);
    attachAnchor(heading, id);
  }
}

/** Scroll to the current URL hash once the ids exist (the SSR HTML has none, so the browser's own
 *  initial hash-scroll on refresh finds nothing — we do it here after enhancing). */
function scrollToHash(): void {
  const id = window.location.hash.slice(1);
  if (!id) {
    return;
  }
  document.querySelector(`#${CSS.escape(decodeURIComponent(id))}`)?.scrollIntoView();
}

onMounted(async () => {
  await nextTick();
  anchorHeadings();
  scrollToHash();
});

// Re-enhance after a client-side route change swaps in a new page's headings.
watch(
  () => route.path,
  async () => {
    await nextTick();
    anchorHeadings();
  },
);
</script>

<template>
  <BankaiLayout class="docs-layout">
    <template #header>
      <SiteHeader />
    </template>

    <template #sidebar>
      <nav class="docs-sidebar" aria-label="Documentation">
        <BankaiText as="p" size="sm" weight="semibold" tone="muted" class="docs-sidebar-title">
          Guide
        </BankaiText>
        <ul class="docs-nav">
          <li v-for="item in guideNav" :key="item.to">
            <NuxtLink :to="item.to" class="docs-nav-link">{{ item.name }}</NuxtLink>
          </li>
        </ul>
        <BankaiText as="p" size="sm" weight="semibold" tone="muted" class="docs-sidebar-title">
          Components
        </BankaiText>
        <ul class="docs-nav">
          <li v-for="item in componentNav" :key="item.to">
            <NuxtLink :to="item.to" class="docs-nav-link">{{ item.name }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </template>

    <div class="docs-main">
      <slot />
    </div>

    <template #footer>
      <SiteFooter />
    </template>
  </BankaiLayout>
</template>

<style scoped>
/* Retune the shell grid: a fixed sidebar track + a column gutter. row-gap stays 0 so the full-bleed
   header/footer sit flush against their borders. `.docs-layout` is the BankaiLayout root, which
   inherits this component's scope, so a plain class override wins over the theme's `:where()` rule. */
.docs-layout {
  grid-template-columns: 12rem 1fr;
  column-gap: 2.5rem;
}

.docs-sidebar {
  position: sticky;
  top: 2rem;
  padding: 2rem 0 2rem 1.5rem;
}

.docs-sidebar-title {
  margin-bottom: 0.5rem;
}

/* Space each group heading after the first away from the previous group's list. */
.docs-nav + .docs-sidebar-title {
  margin-top: 1.25rem;
}

.docs-nav {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.docs-nav-link {
  display: block;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: inherit;
}

.docs-nav-link:hover {
  background: color-mix(in oklch, currentcolor 8%, transparent);
}

.docs-nav-link.router-link-exact-active {
  background: color-mix(in oklch, currentcolor 12%, transparent);
  font-weight: 600;
}

.docs-main {
  padding: 2rem 1.5rem 2rem 0;
  min-inline-size: 0;
}

/* Permalink anchors injected by anchorHeadings(). :deep() because the headings live in slotted page
   content, not this layout's own template. The anchor inherits the heading's look and reveals a
   trailing "#" on hover/focus; scroll-margin keeps a scrolled-to heading clear of the top edge. */
.docs-main :deep(:is(h2, h3, h4, h5, h6)) {
  scroll-margin-top: 1.5rem;
}

.docs-main :deep(.doc-heading-anchor) {
  color: inherit;
  text-decoration: none;
}

.docs-main :deep(.doc-heading-anchor:not(.doc-heading-anchor--bare))::after {
  content: '#';
  margin-inline-start: 0.35em;
  color: var(--bankai-color-accent, currentColor);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.docs-main :deep(.doc-heading-anchor:not(.doc-heading-anchor--bare)):hover::after,
.docs-main :deep(.doc-heading-anchor:not(.doc-heading-anchor--bare)):focus-visible::after {
  opacity: 0.6;
}

/* The standalone "#" (used only when a heading already contains its own link) sits at reduced weight. */
.docs-main :deep(.doc-heading-anchor--bare) {
  color: var(--bankai-color-accent, currentColor);
  opacity: 0.5;
}

/* Stack the sidebar above content on narrow viewports: collapse the shell to a single column and
   restack the grid areas, and drop the sidebar's sticky positioning. */
@media (max-width: 48rem) {
  .docs-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      'header'
      'sidebar'
      'main'
      'footer';
  }

  .docs-sidebar {
    position: static;
    padding: 1.5rem 1.5rem 0;
  }

  .docs-main {
    padding: 1.5rem;
  }
}
</style>
