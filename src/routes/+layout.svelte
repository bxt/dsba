<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import Infobox from "$lib/Infobox.svelte";
  import {
    getActiveWallet,
    getWallets,
    isPersistenceError,
    isPersistenceLoading,
    setActiveWallet,
  } from "$lib/persistence.svelte";
  import { resolve } from "$app/paths";

  let { children } = $props();
</script>

<svelte:head>
  <title>DSBA – damn simple budget app</title>
  <link rel="icon" href={favicon} />
</svelte:head>

<header>
  <h1 class="text-2xl">DSBA</h1>
  <Infobox />
</header>

<main>
  {#if isPersistenceLoading()}
    <div>Loading...</div>
  {:else if isPersistenceError()}
    <div>Error!</div>
  {:else}
    <h2 class="text-4xl">{getActiveWallet().name}</h2>

    <ul>
      {#each getWallets() as wallet (wallet.id)}
        <li>
          <button onclick={() => setActiveWallet(wallet.id)}
            >{wallet.name} ({wallet.balance})</button
          >
        </li>
      {/each}
    </ul>

    <a href={resolve("/add")}>add</a>
    <a href={resolve("/edit")}>edit</a>

    {@render children()}
  {/if}
</main>
