---
'@bankai-vue/core': minor
---

Add `BankaiPage` — the per-route content host, the per-route layer of the App › Layout › Page › Container structure. It renders a plain `.bankai-page` `<div data-part="root">` that sits inside the document's `<main>` (emitted by `BankaiLayout`'s default slot or a standalone `BankaiMain`) and hosts a route's content; it merges consumer `class`/`style`/attributes onto the root and ships no CSS. It is deliberately **not** a landmark and never renders its own `<main>` (landmark uniqueness), and it does **no** implicit child-rewriting — there is no auto heading-level context, so `BankaiHeading` levels stay explicit via `:level` ("no black magic", SPEC §5.6). It takes no props and lands thin by design: per-route scroll and route-transition concerns are deferred until there is routing to dogfood.
