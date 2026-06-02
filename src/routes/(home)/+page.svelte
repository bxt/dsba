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

<div
  title="current balance"
  class={`mt-20 w-1/2 pe-1 text-right text-2xl ${getActiveWallet().balance < 0 ? "text-red-700" : ""}`}
>
  {currencyFormat.format(getActiveWallet().balance)}
</div>
<form class="flex gap-2 py-3">
  <label class="flex flex-1 items-center gap-1">
    <span class="text-gray-500">Amount:</span>
    <input
      type="number"
      step="0.01"
      bind:value={amount}
      class="w-0 flex-1 rounded-lg border text-right text-2xl"
    />
    <span class="text-2xl text-gray-500">&thinsp;€</span>
  </label>
  <div class="flex flex-1 items-center gap-1">
    <button
      onclick={() => {
        addExpense(-amount);
      }}
      class="rounded-lg border text-2xl"
    >
      Subtract
    </button>
    <button
      onclick={() => {
        addExpense(amount);
      }}
      class="rounded-lg border"
    >
      Add
    </button>
  </div>
</form>
<ul class="flex flex-col gap-1">
  {#each getActiveWallet().expenses.toReversed() as expense (expense.id)}
    {@const hoursAgo = Math.round(
      (Date.parse(expense.date) - +new Date()) / 1000 / 60 / 60,
    )}
    <li transition:slide class="flex items-baseline gap-2">
      <span
        class={`flex-1 text-right text-2xl ${expense.amount < 0 ? "text-red-700" : ""}`}
      >
        {currencyFormat.format(expense.amount)}
      </span>
      <span
        class="flex-1 text-gray-500"
        title={relativeTimeFormatLong.format(hoursAgo, "hour")}
      >
        {relativeTimeFormat.format(hoursAgo, "hour")}
      </span>
    </li>
  {/each}
</ul>
