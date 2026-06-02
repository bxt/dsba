<script lang="ts">
  const currencyFormat = new Intl.NumberFormat("de", {
    style: "currency",
    currency: "EUR",
  });

  const { value, class: clx = "" }: { value: number; class?: string } =
    $props();
</script>

<span class={`${clx} text-right ${value < 0 ? "text-red-700" : ""}`}>
  {currencyFormat.format(value)}
</span>
