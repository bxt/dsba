export function centsToString(input: number): string {
  return (input / 100).toFixed(2).replace(".00", "");
}

export function stringToCents(input: string): number {
  return Math.round(parseFloat(input.replaceAll(/,/g, ".")) * 100);
}

export function splitAt(input: string, at: number): [string, string] {
  return [input.substring(0, at), input.substring(at)];
}

export type InputState = { value: string; caretPosition: number };

export function sanitizeValue({
  value,
  caretPosition,
}: InputState): InputState {
  const isPositive =
    value.includes("+") || (value.match(/-/g)?.length || 0) % 2 === 0;

  const regexKeepLastSeparator = /[^0-9,.]|([.,](?=.*[.,]))/g;
  const regexDropSeparators = /[^0-9]/g;
  const regexSeparator = /[,.]/;

  const [beforeCaret, afterCaret] = splitAt(value, caretPosition);
  const beforeCaretInitialLength = beforeCaret.length;
  const beforeCaretCleaned = beforeCaret.replaceAll(regexKeepLastSeparator, "");
  const hadSeparatorBeforeCaret = regexSeparator.test(beforeCaret);
  const afterCaretCleaned = afterCaret.replaceAll(
    hadSeparatorBeforeCaret ? regexDropSeparators : regexKeepLastSeparator,
    "",
  );

  value = `${beforeCaretCleaned}${afterCaretCleaned}`;
  caretPosition -= beforeCaretInitialLength - beforeCaretCleaned.length;

  if (!isPositive) {
    value = `-${value}`;
    caretPosition++;
  }

  return { value, caretPosition };
}
