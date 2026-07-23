import type { ComputedRef, Ref } from 'vue';
import { useTemplateRef } from 'vue';
import { useBankaiId } from '../composables/useBankaiId';

/**
 * The shared return of {@link useBankaiInput}: the resolved `id`, the native-`<input>` template ref, and
 * the `focus`/`blur`/`select` methods each input-family control re-exposes through its instance API.
 */
export interface UseBankaiInput {
  /** The resolved `id` (a consumer `id` wins; otherwise a generated one, or `undefined` when disabled). */
  id: ComputedRef<string | undefined>;
  /** The native `<input>` element ref, bound to the SFC's `ref="input"`; `null` before mount / after unmount. */
  inputRef: Readonly<Ref<HTMLInputElement | null>>;
  /** Focus the input (delegates to the native `HTMLInputElement.focus`). */
  focus: (options?: FocusOptions) => void;
  /** Remove focus from the input (delegates to the native `HTMLInputElement.blur`). */
  blur: () => void;
  /** Select all editable text in the input (delegates to the native `HTMLInputElement.select`). */
  select: () => void;
}

/**
 * Shared wiring for the input family (`BankaiInput`, `BankaiInputNumber`, `BankaiInputPassword`): the
 * resolved `id` ({@link useBankaiId}), the native-`<input>` template ref, and the `focus`/`blur`/`select`
 * methods each control delegates to the element. Extracted once a third control (`BankaiInputPassword`)
 * needed the same bits — the seam called out in `BankaiInputNumber` — per the SPEC.md §4.17 share-or-hoist
 * rule. It is an INTERNAL seam, not a public composable: its API is not part of the documented surface, so
 * it lives in `internal/` and is not re-exported from the package barrel.
 *
 * The template ref is looked up by the literal name `input`, so the consuming SFC must put `ref="input"` on
 * its native `<input>` (all three family controls do). The `el` getter each control exposes is intentionally
 * left to the SFC (a spread would snapshot `inputRef.value` once instead of forwarding it live). Call during
 * `setup`.
 *
 * @param prefix - Prefix for the generated id, typically the component's kebab-case name.
 */
export function useBankaiInput(prefix: string): UseBankaiInput {
  const id = useBankaiId(prefix);
  const inputRef = useTemplateRef<HTMLInputElement>('input');

  function focus(options?: FocusOptions): void {
    inputRef.value?.focus(options);
  }

  function blur(): void {
    inputRef.value?.blur();
  }

  function select(): void {
    inputRef.value?.select();
  }

  return { id, inputRef, focus, blur, select };
}
