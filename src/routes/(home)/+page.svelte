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
  class="m-auto mt-10 flex w-2/3 items-baseline gap-2 border border-gray-300 py-5"
>
  <span
    title="current balance"
    class={`flex-1 text-right text-2xl ${getActiveWallet().balance < 0 ? "text-red-700" : ""}`}
  >
    {currencyFormat.format(getActiveWallet().balance)}
  </span>
  <span class="flex-1 text-gray-500">current balance</span>
</div>

<form class="flex gap-2 py-3 pl-4">
  <label class="flex flex-1 items-center gap-1">
    <span class="text-gray-500">Amount:</span>
    <span class="flex flex-1 rounded-lg border px-2 text-2xl">
      <input
        bind:value={amount}
        inputmode="decimal"
        class="w-0 flex-1 text-right"
      />
      <span class=" text-gray-500">&thinsp;€</span>
    </span>
  </label>
  <div class="flex flex-1 items-center gap-1">
    <button
      onclick={() => {
        addExpense(-amount);
      }}
      class="rounded-lg border px-2 text-2xl"
    >
      Subtract
    </button>
    <button
      onclick={() => {
        addExpense(amount);
      }}
      class="rounded-lg border px-2"
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
