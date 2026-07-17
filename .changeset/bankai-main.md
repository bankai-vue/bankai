---
'@bankai-vue/core': minor
---

Add `BankaiMain` — a standalone `<main>` content region, for a shell built without `BankaiLayout`. It renders a native `<main class="bankai-main" data-part="root">`, so the (unique) `main` landmark is carried by the element itself, and merges consumer `class`/`style`/attributes onto the root; core ships no CSS. It takes no props — the `main` landmark must be unique per document, so there is no accessible-name prop. Don't place it inside a `BankaiLayout`, whose default slot already emits the sole `<main>` (landmark uniqueness).
