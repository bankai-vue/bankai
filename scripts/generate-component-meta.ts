// Generates `docs/app/utils/component-meta.generated.ts` from @bankai-vue/core's source SFCs using
// vue-component-meta (SPEC.md §4.15 — the docs dogfood the library and stay in sync with it). The docs
// props/slots/events tables read the generated manifest instead of hand-authored data, so a component's
// JSDoc, defaults, and prop list are the single source of truth.
//
// Run `pnpm docs:meta` to regenerate; `pnpm docs:meta:check` (in preflight/CI) fails if the committed
// file is stale — so a new or renamed prop can't silently go undocumented.
//
// The `type` column is the one curated field: vue-component-meta prints most of our styling props as a
// bare alias (`BankaiFlexGap`), leaks the `LiteralUnion` helper, or — for BankaiLink's conditional `to` —
// emits garbage (`string | it | et`). `TYPE_OVERRIDES` supplies the real accepted values for those; every
// other prop falls through to the auto type. Everything besides `type` is generated.
//
// `theming` lists each component's CSS custom-property token surface, read straight from the house theme
// (`@bankai-vue/theme-bankai`): the `--bankai-<component>-*` declarations in that CSS file's `:where(:root)`
// block, with their default values. Keyed per theme (`bankai` today) so the docs table can switch when a
// theme switcher lands. The token *purpose* prose is localized and lives in the docs i18n messages (keyed by
// token name), not here — it is theme-independent, mirroring how prop descriptions are handled.
import { existsSync, globSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createChecker } from 'vue-component-meta';

const root = fileURLToPath(new URL('..', import.meta.url));
const OUT_REL = 'docs/app/utils/component-meta.generated.ts';
const OUT = `${root}${OUT_REL}`;

// Curated Type-column strings, keyed `Component.prop`. Seeded from the reviewed hand-authored tables.
const TYPE_OVERRIDES: Record<string, string> = {
  'BankaiButton.variant': "'solid' | 'outline' | 'ghost' | (string)",
  'BankaiButton.size': "'sm' | 'md' | 'lg' | (string)",
  'BankaiContainer.as': 'HTML tag name',
  'BankaiFlex.as': 'HTML tag name',
  'BankaiFlex.direction': "'row' | 'row-reverse' | 'column' | 'column-reverse'",
  'BankaiFlex.align': "'start' | 'end' | 'center' | 'baseline' | 'stretch' | (string)",
  'BankaiFlex.justify': "'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | (string)",
  'BankaiFlex.gap': "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string",
  'BankaiFlex.wrap': "'nowrap' | 'wrap' | 'wrap-reverse'",
  'BankaiGrid.as': 'HTML tag name',
  'BankaiGrid.columns': 'number | string',
  'BankaiGrid.rows': 'number | string',
  'BankaiGrid.areas': 'string | string[]',
  'BankaiGrid.gap': "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string",
  'BankaiGrid.flow': "'row' | 'column' | 'dense' | 'row-dense' | 'column-dense'",
  'BankaiGrid.align': "'start' | 'end' | 'center' | 'baseline' | 'stretch' | (string)",
  'BankaiGrid.justify': "'start' | 'end' | 'center' | 'stretch' | (string)",
  'BankaiHeading.level': '1 | 2 | 3 | 4 | 5 | 6',
  'BankaiInput.type': "'text' | 'email' | 'search' | 'tel' | 'url' | (string)",
  'BankaiInput.size': "'sm' | 'md' | 'lg' | (string)",
  'BankaiInputNumber.size': "'sm' | 'md' | 'lg' | (string)",
  'BankaiInputNumber.buttons': "boolean | 'stacked' | 'split' | (string)",
  'BankaiInputNumber.inputmode': "'numeric' | 'decimal' | (string)",
  'BankaiIcon.as': 'BankaiIconElement | string',
  'BankaiIcon.size': "'xs' | 'sm' | 'md' | 'lg' | 'xl' | string",
  'BankaiText.as': 'BankaiTextElement | string',
  'BankaiText.size': "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | string",
  'BankaiText.weight': "'thin' … 'black' | number | string",
  'BankaiText.tone': "'default' | 'muted' | 'subtle' | string",
  'BankaiLink.to': 'RouteLocationRaw | string | object',
};

// Flatten JSDoc for a one-cell table string: unwrap `{@link X}` → `X`, drop code backticks, collapse
// whitespace. Keeps the prose that lives on each prop/slot/event in the source.
function clean(text: string | undefined): string {
  return (text ?? '')
    .replaceAll(/\{@link\s+([^}|]+?)(?:\s*\|[^}]*)?\}/gu, '$1')
    .replaceAll('`', '')
    .replaceAll(/\s+/gu, ' ')
    .trim();
}

// Tidy an auto type string for display: drop the redundant trailing `| undefined` (every prop here is
// optional) and prefer single quotes on string literals, matching the curated overrides' house style.
function cleanType(type: string): string {
  return type.replace(/\s*\|\s*undefined\s*$/u, '').replaceAll('"', "'");
}

// Render a name as the kebab-case form a consumer writes in a template. Props and events are declared
// camelCase in the SFC but bound kebab-case in templates — `modelValue` → `model-value`, the event
// `update:modelValue` → `update:model-value` (Vue's recommended style; it auto-converts). The Props and
// Emits tables document the template attribute/listener, so they show the kebab form. Only component
// props/events go through this — exposes are a JS API (accessed via a template ref, no case transform, so
// they stay camelCase) and the runtime config object documented elsewhere keeps its JS keys.
function kebabName(name: string): string {
  return name.replaceAll(/([a-z0-9])([A-Z])/gu, '$1-$2').toLowerCase();
}

// Extract a component's CSS token surface from its house-theme stylesheet: the `--bankai-*` custom-property
// declarations in the `:where(:root)` block(s), paired with their default value. Only *declarations* match
// (a `--name:` in property position), so `var(--x)` references — including the shared-scale tokens a default
// resolves to — are never picked up. Values may span lines (`[^;]` matches newlines); collapse whitespace.
// The `:where(:root)` blocks hold no nested braces, so `[^}]*` captures a block body safely.
//
// Comments are stripped first: they document tokens with example declarations (`--bankai-link-decoration:
// none`) that carry no `;`, which would otherwise let the value regex run past the comment into the next
// real declaration.
function extractThemeTokens(rawCss: string): Array<{ name: string; value: string }> {
  const css = rawCss.replaceAll(/\/\*[\s\S]*?\*\//gu, '');
  const tokens: Array<{ name: string; value: string }> = [];
  const seen = new Set<string>();
  const blocks = css.matchAll(/:where\(:root\)\s*\{([^}]*)\}/gu);
  for (const block of blocks) {
    const decls = block[1]!.matchAll(/(--bankai-[\w-]+)\s*:\s*([^;]+);/gu);
    for (const [, name, value] of decls) {
      if (seen.has(name!)) {
        continue;
      }

      seen.add(name!);
      tokens.push({ name: name!, value: value!.replaceAll(/\s+/gu, ' ').trim() });
    }
  }

  return tokens;
}

interface MetaProp {
  name: string;
  type: string;
  default?: string;
  required: boolean;
  description: string;
}
interface ThemeToken {
  name: string;
  value: string;
}
interface ComponentMeta {
  props: MetaProp[];
  slots: Array<{ name: string; description: string }>;
  events: Array<{ name: string; type: string; description: string }>;
  exposed: Array<{ name: string; type: string; description: string }>;
  theming: { bankai: ThemeToken[] };
}

const checker = createChecker(`${root}packages/core/tsconfig.json`, {
  printer: { newLine: 1 },
});

const files = globSync('packages/core/src/components/*/Bankai*.vue', { cwd: root }).toSorted();
const data: Record<string, ComponentMeta> = {};

for (const rel of files) {
  const name = rel.split('/').at(-1)!.replace('.vue', '');
  const meta = checker.getComponentMeta(`${root}${rel}`);

  // The component's directory name (e.g. `code-block`) is also its house-theme CSS file's basename.
  const cssPath = `${root}packages/theme-bankai/components/${rel.split('/').at(-2)}.css`;
  const themeTokens = existsSync(cssPath) ? extractThemeTokens(readFileSync(cssPath, 'utf8')) : [];

  const props: MetaProp[] = meta.props
    .filter((p) => !p.global)
    .map((p) => {
      const prop: MetaProp = {
        name: kebabName(p.name),
        type: TYPE_OVERRIDES[`${name}.${p.name}`] ?? cleanType(p.type),
        required: p.required,
        description: clean(p.description),
      };
      if (p.default != null) {
        // Normalize double-quoted string defaults (`"solid"`) to single quotes for the house style.
        prop.default = p.default.replace(/^"(.*)"$/u, "'$1'");
      }

      return prop;
    });

  data[name] = {
    props,
    slots: meta.slots.map((s) => ({ name: s.name, description: clean(s.description) })),
    events: meta.events.map((e) => ({
      name: kebabName(e.name),
      type: e.type,
      description: clean(e.description),
    })),
    // Only components that call `defineExpose` surface a public instance API; today none do, so this is
    // empty for every component — the docs render an explicit "nothing exposed" state from it.
    exposed: meta.exposed.map((x) => ({
      name: x.name,
      type: cleanType(x.type),
      description: clean(x.description),
    })),
    theming: { bankai: themeTokens },
  };
}

const header = `// AUTO-GENERATED by scripts/generate-component-meta.ts — do not edit by hand.
// Regenerate with \`pnpm docs:meta\`. Props/slots/events, defaults, and descriptions come from
// @bankai-vue/core's source SFCs; the \`type\` column merges auto types with curated overrides.
// This file is excluded from oxfmt so the \`--check\` staleness comparison stays byte-exact.
/* eslint-disable */`;

const types = `export interface MetaProp {
  name: string;
  type: string;
  default?: string;
  required: boolean;
  description: string;
}

export interface MetaSlot {
  name: string;
  description: string;
}

export interface MetaEvent {
  name: string;
  type: string;
  description: string;
}

export interface MetaExpose {
  name: string;
  type: string;
  description: string;
}

export interface MetaThemeToken {
  name: string;
  value: string;
}

export interface ComponentMeta {
  props: MetaProp[];
  slots: MetaSlot[];
  events: MetaEvent[];
  exposed: MetaExpose[];
  /**
   * CSS custom-property token surface per theme (the \`--bankai-<component>-*\` declarations with their
   * default value). Keyed by theme so the docs table can switch with the active theme; \`bankai\` (the house
   * theme) is populated today. Token *purpose* prose is localized in the docs i18n messages, keyed by token
   * name — it is theme-independent.
   */
  theming: { bankai: MetaThemeToken[] };
}`;

const content = `${header}\n\n${types}\n\nexport const componentMeta = ${JSON.stringify(
  data,
  null,
  2,
)} satisfies Record<string, ComponentMeta>;\n`;

if (process.argv.includes('--check')) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (current !== content) {
    console.error(`✗ ${OUT_REL} is stale. Run \`pnpm docs:meta\` and commit the result.`);
    process.exit(1);
  }
  console.log(`✓ ${OUT_REL} is up to date.`);
} else {
  writeFileSync(OUT, content);
  console.log(`✓ Wrote ${Object.keys(data).length} components → ${OUT_REL}`);
}
