<script lang="ts">
  import type { Wallet } from "./persistence.svelte";

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

  type Props = {
    wallet: Wallet;
    addExpense: (amount: number) => void;
  };

  let { wallet, addExpense }: Props = $props();

  let amount = $state(0);
</script>

<div title="current balance">
  {currencyFormat.format(wallet.balance)}
</div>
<label><span>Amount:</span><input type="number" bind:value={amount} /></label
>&thinsp;€
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
  {#each wallet.expenses as expense (expense.id)}
    {@const hoursAgo = Math.round(
      (Date.parse(expense.date) - +new Date()) / 1000 / 60 / 60,
    )}
    <li>
      <span>{currencyFormat.format(expense.amount)}</span>
      <span title={relativeTimeFormatLong.format(hoursAgo, "hour")}
        >{relativeTimeFormat.format(hoursAgo, "hour")}</span
      >
    </li>
  {/each}
</ul>
