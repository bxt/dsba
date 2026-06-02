<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import type { Snippet } from "svelte";
  import NumberInput from "$lib/NumberInput/NumberInput.svelte";

  let {
    action,
    children,
    balance = $bindable(),
    name: initialName,
  }: {
    name?: string;
    balance: number;
    action: (wallet: { name: string; balance: number }) => void;
    children?: Snippet;
  } = $props();
</script>

<form
  class="flex flex-col gap-4 pbs-4"
  onsubmit={(event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget, event.submitter);
    const name = data.get("name")?.toString();
    if (!name) throw new Error("name empty?");
    if (isNaN(balance)) throw new Error("balance empty?");

    action({ name, balance });
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
        class="w-2/3 rounded-lg border px-2 text-2xl"
      />
    </label>
  </p>
  <p>
    <label>
      <span class="text-gray-500">Balance:</span>
      <span
        class="peer flex w-2/3 rounded-lg border px-2 text-2xl has-aria-invalid:border-red-500"
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
  <p class="flex gap-2">
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
