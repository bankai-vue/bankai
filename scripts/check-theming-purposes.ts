// Guards the docs Theming tables: every CSS token in the generated component manifest must have a
// localized *purpose* string in every docs locale, and no locale may carry a stale purpose key for a
// token that no longer exists. The token names + defaults are generated (see
// generate-component-meta.ts + its `docs:meta:check`), but the purpose prose is hand-authored per token
// under `theming.tokens.<--bankai-...>` in docs/i18n/locales/*.json — nothing regenerates it, so without
// this check a new token would silently render its raw i18n key instead of a description.
//
// Wired into `preflight` right after `docs:meta:check`, so the manifest it reads is already verified fresh.
import { componentMeta } from '../docs/app/utils/component-meta.generated.ts';
import de from '../docs/i18n/locales/de.json' with { type: 'json' };
import en from '../docs/i18n/locales/en.json' with { type: 'json' };

// Every token name across every theme bucket (`bankai` today; future themes flow in automatically).
const tokens = new Set<string>();
for (const meta of Object.values(componentMeta)) {
  for (const theme of Object.values(meta.theming)) {
    for (const token of theme) {
      tokens.add(token.name);
    }
  }
}

// The docs locales whose `theming.tokens` map must cover exactly that token set.
const locales = { en, de };

let ok = true;
for (const [locale, messages] of Object.entries(locales)) {
  const keys = new Set(Object.keys(messages.theming.tokens));

  const missing = [...tokens].filter((name) => !keys.has(name)).toSorted();
  const stale = [...keys].filter((name) => !tokens.has(name)).toSorted();

  if (missing.length > 0) {
    ok = false;
    console.error(
      `✗ ${locale}.json theming.tokens is missing a purpose for:\n  ${missing.join('\n  ')}`,
    );
  }

  if (stale.length > 0) {
    ok = false;
    console.error(
      `✗ ${locale}.json theming.tokens has a stale purpose (no such token) for:\n  ${stale.join('\n  ')}`,
    );
  }
}

if (!ok) {
  console.error(
    '\nEvery generated theme token needs a purpose in each docs locale. Add or remove the keys above.',
  );
  process.exit(1);
}

console.log(
  `✓ theming.tokens purposes cover all ${tokens.size} tokens in ${Object.keys(locales).join(', ')}.`,
);
