<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    deleteActiveWallet,
    editActiveWallet,
    getActiveWallet,
    isWalletDeletable,
  } from "$lib/persistence.svelte";
  import { resolve } from "$app/paths";
  import WalletForm from "$lib/WalletForm.svelte";
</script>

<WalletForm
  action={editActiveWallet}
  balance={getActiveWallet().balance}
  name={getActiveWallet().name}
>
  {#if isWalletDeletable()}
    <button
      class="inline-block rounded-lg border bg-red-300 px-2"
      onclick={() => {
        deleteActiveWallet();
        goto(resolve("/"));
      }}>delete</button
    >
  {/if}
</WalletForm>
