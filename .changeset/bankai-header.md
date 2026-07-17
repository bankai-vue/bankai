---
'@bankai-vue/core': minor
---

Add `BankaiHeader` — a standalone `<header>` banner region, the content layer of the App › Layout › Page › Container structure for a shell built without `BankaiLayout`. It renders a native `<header class="bankai-header" data-part="root">`, so the `banner` landmark is carried by the element itself, and merges consumer `class`/`style`/attributes onto the root; core ships no CSS. It has no configuration props — it typically holds a navbar. A native `<header>` is the `banner` landmark only at the top level (not nested inside `<article>`/`<aside>`/`<main>`/`<nav>`/`<section>`), so don't place it inside `BankaiLayout`'s `#header` slot, which already emits a `<header>` (landmark uniqueness).
