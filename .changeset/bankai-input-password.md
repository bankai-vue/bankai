---
'@bankai-vue/core': minor
---

Add `BankaiInputPassword` — the reveal-toggle sibling of `BankaiInput`. It renders its own native `<input>` (reusing `BankaiInput`'s look through the shared `bankai-input` class) whose `type` flips between `password` (masked) and `text` (revealed). The value is a string default `v-model` (unset stays `undefined`, never coerced to `''`); the reveal state is a named `v-model:revealed` that drives the `type` whether or not the built-in button renders — so a consumer can drive the reveal from their own control. It exposes the underlying element plus `focus`/`blur`/`select` through a template ref.

By default it wraps the field in a `<div class="bankai-input-password">` with a trailing reveal button — a **real, focusable, tab-order control** (not a decorative `aria-hidden` helper) whose accessible name and visible label swap between the localized `inputPassword.show` and `inputPassword.hide` messages, overridable per instance via `showLabel`/`hideLabel`, and whose content is replaceable through the `#toggle` slot (it receives the current `revealed` state). Set `:toggle="false"` for a bare `<input>` with no wrapper or button. Adds the `inputPassword` namespace to `BankaiMessages` (English base `Show password` / `Hide password`, plus the shipped `de` bundle). Core ships **no** CSS; consumers style through the `bankai-input` class, the `bankai-input-password` wrapper, and the `data-part` hooks (`root`/`field`/`toggle`).

This landing also extracts the shared input-family wiring (`id`, the native-`<input>` ref, and `focus`/`blur`/`select`) into an internal `useBankaiInput` composable now adopted by `BankaiInput`, `BankaiInputNumber`, and `BankaiInputPassword` — an internal refactor with no change to any public API.
