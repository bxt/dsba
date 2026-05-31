<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import Infobox from "$lib/Infobox.svelte";
  import {
    getActiveWallet,
    isPersistenceError,
    isPersistenceLoading,
  } from "$lib/persistence.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <title>DSBA – damn simple budget app</title>
  <link rel="icon" href={favicon} />
</svelte:head>

<header>
  <h1>DSBA</h1>
  <Infobox />
</header>

<main>
  {#if isPersistenceLoading()}
    <div>Loading...</div>
  {:else if isPersistenceError()}
    <div>Error!</div>
  {:else}
    <h2>{getActiveWallet().name}</h2>

    {@render children()}
  {/if}
</main>
