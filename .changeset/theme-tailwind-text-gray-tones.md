---
'@bankai-vue/theme-tailwind': minor
---

Retune `BankaiText`'s neutral tones onto Tailwind's `gray` ramp (was `slate`), matching the colors Tailwind's own marketing/content sections use — the counterpart to the button already pinning to Tailwind's indigo. `default` → gray-900 / white (heading-strength, pure white in dark), `muted` → gray-600 / gray-300 (body copy), `subtle` → gray-400 / gray-500 (de-emphasized meta).

Tones now drive dark mode off `color-scheme` via `light-dark()` (exposed through a `--bankai-text-color`/`-muted`/`-subtle` token surface, at parity with the house theme), instead of Tailwind's `dark:` variant. `dark:` keys off the OS `prefers-color-scheme` media query, so a page that flips `color-scheme` on its own (an in-app light/dark toggle, like the button already does) left the tone text stranded on the wrong branch — e.g. washed-out light text on a light surface. All three tones alias the foundation `--bankai-color-fg*` family (tokens.css), so text tone has a single source of truth and follows a consumer retuning the fg palette — matching how the house theme wires `BankaiText`.

Retune the foundation `--bankai-color-fg-muted` from `gray-500 / gray-400` to `gray-600 / gray-300` — a touch stronger for body-copy legibility, matching the tone Tailwind's own content sections read on. It stays between `fg` (gray-900) and `fg-subtle` (gray-400) in both schemes and had no consumer other than `BankaiText`'s `muted` tone.
