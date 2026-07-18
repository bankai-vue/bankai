// Shared keyboard behaviour for a WAI-ARIA radiogroup with a roving tabindex (SPEC §4.16): the arrow
// keys cycle the selection and move focus to the newly-selected radio, and only the selected radio is
// tabbable (the caller wires `:tabindex`). Extracted from the header's interim ColorSchemeToggle /
// LocaleSwitcher (→ future BankaiThemeToggle / BankaiNavbar) so the a11y logic lives in one place.
//
// Contract: the radios are rendered as <button>s in DOM order matching `values()`, inside a container
// carrying `ref="group"`. The container is a Bankai component, so we reach the element via `$el`.
// `values`/`active` are getters (not plain values) so a reactive source — a `computed`/ref list or a
// live `locale` — is re-read on every keypress.
import type { ComponentPublicInstance, Ref } from 'vue';
import { ref } from 'vue';

export interface RovingRadiogroup {
  /** Bind to the radiogroup container via `ref="group"`. */
  group: Ref<ComponentPublicInstance | null>;
  /** Bind to the container via `@keydown="onKeydown"`. */
  onKeydown: (event: KeyboardEvent) => void;
}

export function useRovingRadiogroup<T extends string>(
  values: () => ReadonlyArray<T>,
  active: () => T,
  select: (next: T) => void,
): RovingRadiogroup {
  const group = ref<ComponentPublicInstance | null>(null);

  // Move focus to the radio at `index` (buttons are in the same order as `values()`). `$el` is typed
  // `any`, so funnel it through `unknown` and narrow with `instanceof` — no unsafe assignment/assertion
  // (and `$el` is null during SSR, where this never runs anyway).
  function focusOption(index: number): void {
    const root: unknown = group.value?.$el;
    if (root instanceof HTMLElement) {
      root.querySelectorAll<HTMLButtonElement>('button')[index]?.focus();
    }
  }

  // Arrow keys cycle the selection (WAI-ARIA radiogroup pattern); preventDefault stops page scroll.
  function onKeydown(event: KeyboardEvent): void {
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    if (!forward && !backward) {
      return;
    }
    event.preventDefault();
    const list = values();
    const current = list.indexOf(active());
    const nextIndex = (current + (forward ? 1 : -1) + list.length) % list.length;
    const next = list[nextIndex];
    if (next === undefined) {
      return;
    }
    select(next);
    focusOption(nextIndex);
  }

  return { group, onKeydown };
}
