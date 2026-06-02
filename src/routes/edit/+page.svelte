<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    deleteActiveWallet,
    editActiveWallet,
    getActiveWallet,
    isWalletDeletable,
  } from "$lib/persistence.svelte";
  import { resolve } from "$app/paths";
  import NumberInput from "$lib/NumberInput/NumberInput.svelte";

  let balance = $state(getActiveWallet().balance);
</script>

<form
  onsubmit={(event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget, event.submitter);
    const name = data.get("name")?.toString();
    if (!name) throw new Error("name empty?");
    if (isNaN(balance)) throw new Error("balance empty?");

    editActiveWallet({ name, balance });
    goto(resolve("/"));
  }}
>
  <p>
    <label>
      <span>Name:</span>
      <input name="name" required value={getActiveWallet().name} />
    </label>
  </p>
  <p>
    <label>
      <span>Balance:</span>
      <NumberInput name="balance" required bind:value={balance} />
    </label>&thinsp;€ ({balance})
  </p>
  <button type="submit">save</button>
  {#if isWalletDeletable()}
    <button
      onclick={() => {
        deleteActiveWallet();
        goto(resolve("/"));
      }}>delete</button
    >
  {/if}
</form>
