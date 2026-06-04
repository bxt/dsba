<script lang="ts">
  import { resolve } from "$app/paths";
  import Amount from "$lib/Amount.svelte";
  import NumberInput from "$lib/NumberInput/NumberInput.svelte";
  import { getActiveWallet, addExpense } from "$lib/persistence.svelte";
  import RelativeTime from "$lib/RelativeTime/RelativeTime.svelte";
  import { SvelteDate } from "svelte/reactivity";
  import { slide } from "svelte/transition";

  let amount = $state(0);

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
    class="absolute -top-2 -right-2 border bg-white px-2">edit</a
  >
</div>

<form class="flex gap-2 py-3 pl-4">
  <label class="flex flex-1 items-center gap-1">
    <span class="text-gray-500">Amount:</span>
    <span
      class="flex flex-1 rounded-lg border px-2 text-2xl has-aria-invalid:border-red-500"
    >
      <NumberInput class="w-0 flex-1 text-right" required bind:value={amount} />
      <span class=" text-gray-500">&thinsp;€</span>
    </span>
  </label>
  <div class="flex flex-1 items-center gap-1">
    <button
      onclick={() => {
        addExpense(-amount);
      }}
      disabled={isNaN(amount)}
      class="rounded-lg border px-2 text-2xl disabled:bg-gray-300"
    >
      Subtract
    </button>
    <button
      onclick={() => {
        addExpense(amount);
      }}
      disabled={isNaN(amount)}
      class="rounded-lg border px-2 disabled:bg-gray-300"
    >
      Add
    </button>
  </div>
</form>
<ul class="flex flex-col gap-1">
  {#each Object.entries(expenseDays) as [expenseDay, expenses] (expenseDay)}
    <li transition:slide>
      {#if expenseDay !== new SvelteDate().toISOString().substring(0, 10)}
        <div
          class="text-gray-500 text-center border-b border-gray-300 mbe-3 -mbs-3"
        >
          <span class=" bg-white -mb-2 relative top-3 px-3">
            {#if expenseDay === new Date(+new Date() - 24 * 60 * 60 * 1000)
                .toISOString()
                .substring(0, 10)}
              yesterday
            {:else}
              {expenseDay}
            {/if}</span
          >
        </div>
      {/if}
      <ul class="flex flex-col gap-1">
        {#each expenses as expense (expense.id)}
          <li transition:slide class="flex items-baseline gap-2">
            <Amount value={expense.amount} class="flex-1 text-2xl" />
            <RelativeTime date={expense.date} class="flex-1 text-gray-500" />
          </li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>
