<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import type { Snippet } from "svelte";
  import NumberInput from "$lib/NumberInput/NumberInput.svelte";
  import type { RecurringFunding } from "./persistence.svelte";
  import { createNow } from "./createNow.svelte";

  function dateToDatetimeLocal(date: string): string {
    return date.substring(0, 16);
  }

  function datetimeLocalToDate(datetimeLocal: string): string {
    return `${datetimeLocal}:00.000Z`;
  }

  let {
    action,
    name: initialName,
    balance = $bindable(),
    recurringFunding = $bindable(),
    children,
  }: {
    name?: string;
    balance: number;
    recurringFunding?: RecurringFunding[];
    action: (wallet: {
      name: string;
      balance: number;
      recurringFunding?: RecurringFunding[];
    }) => void;
    children?: Snippet;
  } = $props();

  const now = createNow();
  const nowFormatted = $derived(dateToDatetimeLocal(now.toISOString()));

  const tenMinutesInMs = 10 * 60 * 1000;

  function addRecurringFunding(): void {
    recurringFunding ??= [];
    recurringFunding.push({
      id: crypto.randomUUID(),
      amount: 0,
      interval: "daily",
      start: new Date(Date.now() + tenMinutesInMs).toISOString(),
    });
  }

  function deleteRecurringFunding(fundingId: string): void {
    if (recurringFunding === undefined) return;
    recurringFunding = recurringFunding.filter(({ id }) => id !== fundingId);
    if (recurringFunding.length === 0) {
      recurringFunding = undefined;
    }
  }
</script>

<form
  class="m-auto flex max-w-xs flex-col gap-4 pbs-4"
  onsubmit={(event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget, event.submitter);
    const name = data.get("name")?.toString();
    if (!name) throw new Error("name empty?");
    if (isNaN(balance)) throw new Error("balance empty?");

    action({ name, balance, recurringFunding });
    goto(resolve("/"));
  }}
>
  <p>
    <label>
      <span class="text-gray-500">Name:</span><br />
      <input
        value={initialName}
        name="name"
        required
        class="w-full rounded-lg border px-2 text-2xl"
      />
    </label>
  </p>
  <p>
    <label>
      <span class="text-gray-500">Balance:</span>
      <span
        class="peer flex rounded-lg border px-2 text-2xl has-aria-invalid:border-red-500"
      >
        <NumberInput
          class="w-0 flex-1 text-right"
          name="balance"
          required
          bind:value={balance}
        />
        <span class=" text-gray-500">&thinsp;€</span>
      </span>
      <span class="invisible text-red-700 peer-has-aria-invalid:visible">
        Please enter a valid amount
      </span>
    </label>
  </p>
  {#each recurringFunding as funding (funding.id)}
    <fieldset class="mbe-1 rounded-lg border px-3 pbs-2">
      <legend class="ps-1 text-center">
        Automatic funding
        <button
          type="button"
          onclick={() => deleteRecurringFunding(funding.id)}
          class="rounded-lg border px-2">remove</button
        >
      </legend>
      <p class="flex gap-2">
        <label>
          <span class="text-gray-500">Budget:</span>
          <span
            class="peer flex w-full rounded-lg border px-2 has-aria-invalid:border-red-500"
          >
            <NumberInput
              class="w-0 flex-1 text-right"
              name="balance"
              required
              bind:value={funding.amount}
            />
            <span class=" text-gray-500">&thinsp;€</span>
          </span>
          <span class="invisible text-red-700 peer-has-aria-invalid:visible">
            Enter an amount
          </span>
        </label>
        <label>
          <span class="text-gray-500">Interval:</span>
          <select
            class="w-full rounded-lg border px-2"
            bind:value={funding.interval}
          >
            <option>daily</option>
            <option>weekly</option>
            <option>monthly</option>
            <option>yearly</option>
          </select>
        </label>
      </p>
      <p>
        <label>
          <span class="text-gray-500">Starting at (UTC):</span>
          <input
            type="datetime-local"
            min={nowFormatted}
            bind:value={
              () => dateToDatetimeLocal(funding.start),
              (v) => (funding.start = datetimeLocalToDate(v))
            }
            class="block w-full rounded-lg border px-2"
          />
          <span class="invisible text-red-700 peer-has-aria-invalid:visible">
            Please enter a valid date and time
          </span>
        </label>
      </p>
    </fieldset>
  {/each}
  <p class="mbe-6 flex justify-center gap-2">
    <button
      type="button"
      onclick={addRecurringFunding}
      class="rounded-lg border px-2 text-xl">add recurring funding</button
    >
  </p>
  <p class="flex justify-center gap-2">
    <button
      type="submit"
      disabled={isNaN(balance)}
      class="rounded-lg border px-2 disabled:bg-gray-300">save</button
    >
    {@render children?.()}
    <a
      href={resolve("/")}
      class="inline-block rounded-lg border px-2 opacity-60">cancel</a
    >
  </p>
</form>
