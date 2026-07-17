---
'@bankai-vue/core': minor
---

Add `BankaiHeading` — a native heading primitive. It renders the `<h1>`–`<h6>` element selected by a **required** `level` prop (`1`–`6`), reflected on the root as `data-bankai-level`. The element itself carries the document-outline semantics assistive tech navigates by, and `level` has no default on purpose: there is no universally-safe heading level, and a wrong one silently breaks the outline, so the level is always an explicit choice. The root exposes a `.bankai-heading` class plus `data-part="root"`, and consumer `class`/`style`/attributes (e.g. an `id` for `aria-labelledby`) merge onto it while the owned `data-part`/`data-bankai-level` can't be clobbered by fallthrough. Core ships no CSS. Decoupling the visual size from the semantic level (an `<h2>` styled like an `<h1>`) is deferred to a future non-breaking `size` prop; today the visual size tracks the level.
