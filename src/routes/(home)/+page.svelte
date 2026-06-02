<script lang="ts">
  import { getActiveWallet, addExpense } from "$lib/persistence.svelte";
  import { slide } from "svelte/transition";

  const currencyFormat = new Intl.NumberFormat("de", {
    style: "currency",
    currency: "EUR",
  });
  const relativeTimeFormatLong = new Intl.RelativeTimeFormat("de", {
    style: "long",
  });
  const relativeTimeFormat = new Intl.RelativeTimeFormat("de", {
    style: "narrow",
  });

  let amount = $state(0);
</script>

<div title="current balance">
  {currencyFormat.format(getActiveWallet().balance)}
</div>
<label>
  <span>Amount:</span>
  <input type="number" step="0.01" bind:value={amount} />
</label>&thinsp;€
<button
  onclick={() => {
    addExpense(-amount);
  }}>Subtract</button
>
<button
  onclick={() => {
    addExpense(amount);
  }}>Add</button
>
<ul>
  {#each getActiveWallet().expenses.toReversed() as expense (expense.id)}
    {@const hoursAgo = Math.round(
      (Date.parse(expense.date) - +new Date()) / 1000 / 60 / 60,
    )}
    <li transition:slide>
      <span>{currencyFormat.format(expense.amount)}</span>
      <span title={relativeTimeFormatLong.format(hoursAgo, "hour")}
        >{relativeTimeFormat.format(hoursAgo, "hour")}</span
      >
    </li>
  {/each}
</ul>
