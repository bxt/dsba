<script lang="ts">
  import Amount from "$lib/Amount.svelte";
  import NumberInput from "$lib/NumberInput.svelte";
  import { getActiveWallet, addExpense } from "$lib/persistence.svelte";
  import { slide } from "svelte/transition";

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
  <Amount value={getActiveWallet().balance} class="flex-1 text-2xl" />
  <span class="flex-1 text-gray-500">current balance</span>
</div>

<form class="flex gap-2 py-3 pl-4">
  <label class="flex flex-1 items-center gap-1">
    <span class="text-gray-500">Amount:</span>
    <span class="flex flex-1 rounded-lg border px-2 text-2xl">
      <NumberInput
        class="w-0 flex-1 text-right"
        name="balance"
        required
        bind:value={amount}
      />
      <span class=" text-gray-500">&thinsp;€</span>
    </span>
  </label>
  <div class="flex flex-1 items-center gap-1">
    <button
      onclick={() => {
        if (isNaN(amount)) return;
        addExpense(-amount);
      }}
      class="rounded-lg border px-2 text-2xl"
    >
      Subtract
    </button>
    <button
      onclick={() => {
        if (isNaN(amount)) return;
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
      <Amount value={expense.amount} class="flex-1 text-2xl" />
      <span
        class="flex-1 text-gray-500"
        title={relativeTimeFormatLong.format(hoursAgo, "hour")}
      >
        {relativeTimeFormat.format(hoursAgo, "hour")}
      </span>
    </li>
  {/each}
</ul>
