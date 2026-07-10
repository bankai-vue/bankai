// Shared docs data + types. Auto-imported by Nuxt, but imported explicitly across the site so the
// linter/type-checker resolve it deterministically.

export interface NavItem {
  /** Short display name, e.g. `Button` (the page renders `Bankai{name}` where a full name reads better). */
  name: string;
  /** Route path, e.g. `/components/button`. */
  to: string;
  /** One-line summary for cards and the sidebar. */
  tagline: string;
}

/**
 * The components built so far that have a docs page. Add an entry when a component's page lands
 * — this is part of the per-component landing checklist. The sidebar and the landing "Shipping today"
 * grid both read from here, so there is a single source of truth for what exists.
 */
export const componentNav: NavItem[] = [
  { name: 'Button', to: '/components/button', tagline: 'Native <button> with variant/size/type.' },
  {
    name: 'Text',
    to: '/components/text',
    tagline: 'Polymorphic text primitive + inline semantics.',
  },
  { name: 'Flex', to: '/components/flex', tagline: 'Flexbox layout helper.' },
  { name: 'Grid', to: '/components/grid', tagline: 'CSS-grid layout helper.' },
];

/** One row of a component's props table (hand-authored today; to be generated from source later). */
export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}
