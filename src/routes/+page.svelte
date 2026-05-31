<script lang="ts">
  import {
    addExpense,
    getActiveWallet,
    isPersistenceError,
    isPersistenceLoading,
  } from "$lib/persistence.svelte";
  import WalletView from "$lib/WalletView.svelte";
</script>

<main>
  {#if isPersistenceLoading()}
    <div>Loading...</div>
  {:else if isPersistenceError()}
    <div>Error!</div>
  {:else}
    <h2>{getActiveWallet().name}</h2>
    <WalletView wallet={getActiveWallet()} {addExpense} />
  {/if}
</main>
