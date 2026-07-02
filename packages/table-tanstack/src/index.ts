/**
 * Opt-in TanStack adapter for the bankai-vue DataTable (SPEC.md §4.10 / §5.3).
 *
 * The TanStack-backed `DataTable<T>` and the `TableModel<T>` contract land with
 * the step-3 de-risking spike; this entry exists now only so the package,
 * packaging contract, and hybrid typecheck pipeline are real.
 *
 * `@tanstack/vue-table` is an OPTIONAL peer dependency — never a hard dep of
 * core — and its exact version (stable 8.x vs 9.x beta) is chosen with the spike.
 */
export const adapterName = 'tanstack' as const;
