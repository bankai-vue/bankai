// Docs-only syntax highlighting via Shiki. This is deliberately a docs concern, not a core one:
// `BankaiCodeBlock` highlights nothing by design (SPEC.md §4.6) and exposes its default slot as the
// bring-your-own-highlighter seam — this util produces the markup that goes through it.
//
// Runs at PRERENDER only. The caller (`CodeBlock.vue`) invokes it inside a `useAsyncData` handler
// guarded by `import.meta.server`, so the highlighted HTML is baked into the static page and Shiki never
// executes on — nor ships to — the client. The dynamic `import('shiki')` keeps the (large) highlighter
// bundle out of the client graph entirely.
//
// Dual-theme output emits `--shiki-light` / `--shiki-dark` per token, resolved in CSS with `light-dark()`
// — the very mechanism the house theme uses for dark mode (SPEC.md §4.18). So the docs' color-scheme
// toggle recolors code with no JS, no flash, and no `.dark` class.

/**
 * Highlight `code` as `lang` and return just the token `<span>`s (Shiki's `inline` structure — no
 * `<pre>`/`<code>` wrapper, since `BankaiCodeBlock` renders its own). Each token carries both theme
 * colors as custom properties for `light-dark()` to resolve; no inline `color` is set.
 */
export async function highlightToTokens(code: string, lang: string): Promise<string> {
  const { codeToHtml } = await import('shiki');
  return codeToHtml(code, {
    lang,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
    structure: 'inline',
  });
}
