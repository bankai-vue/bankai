---
'@bankai-vue/core': minor
---

Add `BankaiAside` — a standalone `<aside>` complementary region (side rail), for a shell built without `BankaiLayout`. It renders a native `<aside class="bankai-aside" data-part="root">`, so the `complementary` landmark is carried by the element itself, and merges consumer `class`/`style`/attributes onto the root; core ships no CSS. An optional `label` prop sets `aria-label` so multiple `complementary` landmarks on a page stay distinguishable (omit it for a single, unambiguous aside); a consumer's own `aria-label`/`aria-labelledby` fallthrough takes precedence over it. Don't place it inside `BankaiLayout`'s `#sidebar` slot, which already emits an `<aside>` (landmark uniqueness).
