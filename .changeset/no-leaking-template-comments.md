---
'@bankai-vue/core': patch
---

Stop HTML comments from rendering into the DOM. `BankaiButton`, `BankaiInput`, `BankaiLink`, and `BankaiCodeBlock` had authoring comments inside their `<template>` blocks, which Vue compiles into comment vnodes that leak as `<!-- … -->` nodes in the rendered output (even in production builds). Each comment now sits in top-level SFC space, just before `<template>`, so the documentation is preserved without emitting any DOM.
