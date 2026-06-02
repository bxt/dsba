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
  }: { value: number; class?: string } & Omit<HTMLInputAttributes, "type"> =
    $props();

  const initialValue = centsToString(value);
</script>

<input
  value={initialValue}
  oninput={(event) => {
    const element = event.currentTarget;
    const valueRaw = element.value;
    const oldCaretPosition = element.selectionStart ?? value.length;

    const { value: cleanedValue, caretPosition: newCaretPosition } =
      sanitizeValue({ value: valueRaw, caretPosition: oldCaretPosition });

    if (cleanedValue !== value) {
      element.value = cleanedValue;
      element.setSelectionRange(newCaretPosition, newCaretPosition);
    }
    value = stringToCents(cleanedValue);
  }}
  class={`text-right ${propsClass}`}
  inputmode="decimal"
/>
