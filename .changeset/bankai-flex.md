---
'@bankai-vue/core': minor
---

Add `BankaiFlex` — a polymorphic (`as`, default `<div>`) flexbox layout utility with typed `direction`/`align`/`justify`/`gap`/`wrap`/`inline` props. It reflects layout as the `bankai-flex` class plus a `data-*` anatomy (`data-direction`/`data-align`/`data-justify`/`data-wrap`/`data-inline`) and carries `gap` on the `--bankai-flex-gap` custom property, leaving the styling to the theme; core ships no CSS. `gap` is a spacing-scale step (number, e.g. `:gap="4"`) or a verbatim CSS length (string, e.g. `gap="clamp(0.5rem, 2vw, 1.5rem)"`).
