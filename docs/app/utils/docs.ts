// Shared docs data + types. Auto-imported by Nuxt, but imported explicitly across the site so the
// linter/type-checker resolve it deterministically.
//
// This module is the single source of truth for what EXISTS (which guide/component pages, and their
// routes). The display TEXT (names, taglines) is localized, so it lives in the docs-site i18n message
// files (docs/i18n/locales/*.json) keyed by `key` — not here. Consumers render e.g.
// `$t(\`guide.${item.key}.name\`)` / `$t(\`components.${item.key}.tagline\`)`.

export interface NavItem {
  /** Stable identifier: the last route segment. Doubles as the i18n message key for this item. */
  key: string;
  /** Route path, e.g. `/components/button`. */
  to: string;
}

export interface ComponentNavItem extends NavItem {
  /**
   * PascalCase component identifier, e.g. `Button` — the page renders `Bankai{name}`. Not localized
   * (it's the component's proper name), so it stays here rather than in the i18n messages.
   */
  name: string;
}

/**
 * The guide (non-component) pages. Add an entry when a new guide page lands; the sidebar reads from
 * here so there is a single source of truth for the "Guide" section. Localized labels/taglines live
 * under `guide.<key>` in the i18n message files.
 */
export const guideNav: NavItem[] = [
  { key: 'getting-started', to: '/guide/getting-started' },
  { key: 'rendering', to: '/guide/rendering' },
  { key: 'i18n', to: '/guide/i18n' },
];

/**
 * The components built so far that have a docs page. Add an entry when a component's page lands
 * — this is part of the per-component landing checklist. The sidebar and the landing "Shipping today"
 * grid both read from here, so there is a single source of truth for what exists. Localized taglines
 * live under `components.<key>` in the i18n message files.
 */
export const componentNav: ComponentNavItem[] = [
  { key: 'app', name: 'App', to: '/components/app' },
  { key: 'button', name: 'Button', to: '/components/button' },
  { key: 'text', name: 'Text', to: '/components/text' },
  { key: 'code', name: 'Code', to: '/components/code' },
  { key: 'code-block', name: 'CodeBlock', to: '/components/code-block' },
  { key: 'heading', name: 'Heading', to: '/components/heading' },
  { key: 'flex', name: 'Flex', to: '/components/flex' },
  { key: 'grid', name: 'Grid', to: '/components/grid' },
  { key: 'layout', name: 'Layout', to: '/components/layout' },
  { key: 'header', name: 'Header', to: '/components/header' },
  { key: 'aside', name: 'Aside', to: '/components/aside' },
  { key: 'main', name: 'Main', to: '/components/main' },
  { key: 'footer', name: 'Footer', to: '/components/footer' },
  { key: 'container', name: 'Container', to: '/components/container' },
  { key: 'page', name: 'Page', to: '/components/page' },
  { key: 'link', name: 'Link', to: '/components/link' },
  { key: 'icon', name: 'Icon', to: '/components/icon' },
  { key: 'input', name: 'Input', to: '/components/input' },
];

/** One row of a component's props table (hand-authored today; to be generated from source later). */
export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}
