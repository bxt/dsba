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
    <h1 class="rounded-lg border text-2xl" aria-label="DSBA">D$BA</h1>
    <button
      onclick={toggle}
      aria-label="toggle infobox"
      class="size-8 rounded-full border">i</button
    >
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
    <nav
      class="wallet-navigation m-auto -mbs-8 flex w-full max-w-lg ps-20 pe-10"
    >
      <div class="relative">
        <h2
          class="border-s border-bs text-2xl"
          aria-current={page.url.pathname === "/"}
        >
          {getActiveWallet().name}
        </h2>
        <ul class="wallet-dropdown absolute w-max">
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
      <input
        type="checkbox"
        class="walltet-toggle-button size-8 border text-center"
        aria-label="toggle list of wallets"
      />

      <a
        href={resolve("/add")}
        aria-current={page.url.pathname === "/add"}
        class="flex h-8 items-center border border-s-0 px-2 aria-current:bg-red-700"
        >add</a
      >
      <span class="flex grow justify-end">
        <a
          href={resolve("/edit")}
          aria-current={page.url.pathname === "/edit"}
          class="flex h-8 items-center border border-be-0 px-2 aria-current:bg-red-700"
          >edit</a
        >
      </span>
    </nav>

    <section class="m-auto w-full max-w-lg">
      {@render children()}
    </section>
  {/if}
</main>

<style>
  .walltet-toggle-button {
    appearance: none;
    cursor: pointer;
    font: inherit;
    color: inherit;
    /* other styles */

    &::after {
      content: "v";
    }

    &:checked {
      background: red;
    }
  }

  .wallet-dropdown {
    display: none;
  }

  .wallet-navigation:has(.walltet-toggle-button:checked) {
    .wallet-dropdown {
      display: block;
    }
  }
</style>
