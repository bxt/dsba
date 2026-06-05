<script lang="ts">
  import { resolve } from "$app/paths";
  import Amount from "$lib/Amount.svelte";
  import NumberInput from "$lib/NumberInput/NumberInput.svelte";
  import { getActiveWallet, addExpense } from "$lib/persistence.svelte";
  import RelativeTime from "$lib/RelativeTime/RelativeTime.svelte";
  import { slide } from "svelte/transition";

  let amount = $state(NaN);

  let expenseDays = $derived(
    Object.groupBy(getActiveWallet().expenses.toReversed(), ({ date }) =>
      date.substring(0, 10),
    ),
  );
</script>

<div
  class="relative m-auto mt-10 flex w-2/3 items-baseline gap-2 border border-gray-300 py-5"
>
  <Amount value={getActiveWallet().balance} class="flex-1 text-2xl" />
  <span class="flex-1 text-gray-500">current balance</span>
  <a
    href={resolve("/edit")}
    class="absolute -top-2 -right-2 border bg-white px-2 font-serif">edit</a
  >
</div>

<form class="flex gap-2 py-3 pl-4">
  <label class="flex flex-1 items-center gap-1">
    <span class="text-gray-500 font-serif">Amount:</span>
    <span class="flex flex-1 rounded-lg border px-2 text-2xl">
      <NumberInput
        class="w-0 flex-1 text-right"
        required
        bind:value={amount}
        placeholder="0.00"
      />
      <span class=" text-gray-500">&thinsp;€</span>
    </span>
  </label>
  <div class="flex flex-1 items-center gap-1">
    <button
      onclick={() => {
        addExpense(-amount);
        amount = NaN;
      }}
      disabled={isNaN(amount)}
      class="rounded-lg border px-2 text-2xl disabled:bg-gray-300 font-serif"
    >
      Subtract
    </button>
    <button
      onclick={() => {
        addExpense(amount);
        amount = NaN;
      }}
      disabled={isNaN(amount)}
      class="rounded-lg border px-2 disabled:bg-gray-300 font-serif"
    >
      Add
    </button>
  </div>
</form>
<ul class="flex flex-col gap-1">
  {#each Object.entries(expenseDays) as [expenseDay, expenses] (expenseDay)}
    <li transition:slide>
      <ul class="flex flex-col gap-1 border-b border-gray-300">
        {#each expenses as expense (expense.id)}
          <li transition:slide class="flex items-baseline gap-2">
            <span class="flex-1 text-right">
              {#if expense.recurringFundingId}
                <span aria-label="recurring">♻️</span>
              {/if}
              <Amount value={expense.amount} class="text-2xl" />
            </span>
            <RelativeTime date={expense.date} class="flex-1 text-gray-500" />
          </li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>
