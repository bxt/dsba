<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import {
    centsToString,
    sanitizeValue,
    stringToCents,
  } from "./NumberInputLogic";

  let {
    value = $bindable<number>(),
    class: propsClass = "",
    required,
    placeholder,
  }: { value: number; class?: string } & Omit<
    HTMLInputAttributes,
    "type"
  > = $props();

  let initialValue = $state(centsToString(value));

  $effect(() => {
    const valuePresent = stringToCents(initialValue);
    if (value !== valuePresent && !(isNaN(value) && isNaN(valuePresent))) {
      initialValue = centsToString(value);
    }
  });
</script>

<input
  value={initialValue}
  oninput={(event) => {
    const element = event.currentTarget;
    const valueRaw = element.value;
    const oldCaretPosition = element.selectionStart ?? value.length;

    const { value: cleanedValue, caretPosition: newCaretPosition } =
      sanitizeValue({ value: valueRaw, caretPosition: oldCaretPosition });

    if (cleanedValue !== valueRaw) {
      element.value = cleanedValue;
      element.setSelectionRange(newCaretPosition, newCaretPosition);
    }

    initialValue = cleanedValue;
    value = stringToCents(cleanedValue);
  }}
  {required}
  {placeholder}
  aria-invalid={initialValue === "" ? required : isNaN(value)}
  class={`text-right ${propsClass}`}
  inputmode="decimal"
/>
