<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  let {
    value = $bindable<number>(),
    class: propsClass = "",
  }: { value: number; class?: string } & Omit<HTMLInputAttributes, "type"> =
    $props();

  const initialValue = value;
</script>

<input
  value={initialValue}
  oninput={(event) => {
    const element = event.currentTarget;
    const newValueRaw = element.value;
    let cleanedValue = newValueRaw;
    let caretPosition = element.selectionStart ?? newValueRaw.length;

    const splitAt = (input: string, at: number): [string, string] => [
      input.substring(0, at),
      input.substring(at),
    ];

    const isPositive =
      cleanedValue.includes("+") ||
      (cleanedValue.match(/-/g)?.length || 0) % 2 === 0;

    const regexKeepLastSeparator = /[^0-9,.]|([.,](?=.*[.,]))/g;
    const regexDropSeparators = /[^0-9]/g;
    const regexSeparator = /[,.]/;

    const [beforeCaret, afterCaret] = splitAt(cleanedValue, caretPosition);
    const beforeCaretInitialLength = beforeCaret.length;
    const beforeCaretCleaned = beforeCaret.replaceAll(
      regexKeepLastSeparator,
      "",
    );
    const hadSeparatorBeforeCaret = regexSeparator.test(beforeCaret);
    const afterCaretCleaned = afterCaret.replaceAll(
      hadSeparatorBeforeCaret ? regexDropSeparators : regexKeepLastSeparator,
      "",
    );

    cleanedValue = `${beforeCaretCleaned}${afterCaretCleaned}`;
    caretPosition -= beforeCaretInitialLength - beforeCaretCleaned.length;

    if (!isPositive) {
      cleanedValue = `-${cleanedValue}`;
      caretPosition++;
    }

    if (cleanedValue !== newValueRaw) {
      element.value = cleanedValue;
      element.setSelectionRange(caretPosition, caretPosition);
    }
    const newValue = Math.round(
      parseFloat(cleanedValue.replaceAll(/,/g, ".")) * 100,
    );
    value = newValue;
  }}
  class={`text-right ${propsClass}`}
  inputmode="decimal"
/>
