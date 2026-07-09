---
---

Internal refactor only — no consumer-facing change. Extract the shared `resolveGap` spacing coercion out of `BankaiFlex`/`BankaiGrid` into `internal/spacing.ts` (allocated once, options-driven), hoist Grid's `resolveTracks`/`resolveAreas` to module scope, and codify the prop-resolver share-or-hoist rule in SPEC.md §4.11.
