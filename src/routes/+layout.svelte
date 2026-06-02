<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import Infobox from "$lib/Infobox.svelte";
  import { page } from "$app/state";
  import {
    getActiveWallet,
    getWallets,
    isPersistenceError,
    isPersistenceLoading,
    isOnboardingCompleted,
    setOnboardingCompleted,
    setActiveWallet,
  } from "$lib/persistence.svelte";
  import { resolve } from "$app/paths";

  let { children } = $props();

  let isManuallyOpened = $state(false);

  function toggle() {
    if (!isOnboardingCompleted()) {
      setOnboardingCompleted();
    } else {
      isManuallyOpened = !isManuallyOpened;
    }
  }
</script>

<svelte:head>
  <title>DSBA – damn simple budget app</title>
  <link rel="icon" href={favicon} />
</svelte:head>

<header class="flex justify-center">
  <div class="flex w-full max-w-lg justify-between">
    <h1 class="text-2xl">DSBA</h1>
    <button onclick={toggle} aria-label="toggle infobox">i</button>
  </div>
</header>

{#if !isOnboardingCompleted() || isManuallyOpened}
  <Infobox />
{/if}

<main>
  {#if isPersistenceLoading()}
    <div>Loading...</div>
  {:else if isPersistenceError()}
    <div>Error!</div>
  {:else}
    <nav class="m-auto -mbs-8 flex w-full max-w-lg ps-20 pe-8">
      <div class="relative">
        <h2
          class="text-4xl aria-current:bg-red-700"
          aria-current={page.url.pathname === "/"}
        >
          {getActiveWallet().name}
        </h2>
        <ul class="absolute w-max">
          {#each getWallets() as wallet (wallet.id)}
            <li>
              <button
                onclick={() => setActiveWallet(wallet.id)}
                aria-current={wallet.id === getActiveWallet().id}
                >{wallet.name} ({wallet.balance})</button
              >
            </li>
          {/each}
        </ul>
      </div>
      <button aria-label="expand list of wallets">&darr;</button>

      <a
        href={resolve("/add")}
        aria-current={page.url.pathname === "/add"}
        class="aria-current:bg-red-700">add</a
      >
      <span class="flex grow justify-end">
        <a
          href={resolve("/edit")}
          aria-current={page.url.pathname === "/edit"}
          class="aria-current:bg-red-700">edit</a
        >
      </span>
    </nav>

    <section class="m-auto w-full max-w-lg">
      {@render children()}
    </section>
  {/if}
</main>
