<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import InfoBox from "$lib/InfoBox.svelte";
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

  const isOpen = $derived(!isOnboardingCompleted() || isManuallyOpened);
</script>

<svelte:head>
  <title>DSBA – damn simple budget app</title>
  <link rel="icon" href={favicon} />
</svelte:head>

<header class="flex justify-center">
  <div class="flex w-full max-w-lg justify-between p-2">
    <h1 class="rounded-lg border px-1 text-2xl" aria-label="DSBA">D$BA</h1>
    <div>
      <button
        onclick={toggle}
        aria-label="toggle info box"
        aria-current={isOpen}
        class="size-8 rounded-full border aria-current:bg-red-700">i</button
      >
      <a
        aria-label="settings"
        href={page.url.pathname === "/settings"
          ? resolve("/")
          : resolve("/settings")}
        aria-current={page.url.pathname === "/settings"}
        class="inline-block size-8 rounded-full border text-center aria-current:bg-red-700"
        >set</a
      >
    </div>
  </div>
</header>

{#if isOpen}
  <InfoBox />
{/if}

<main>
  {#if isPersistenceLoading()}
    <div>Loading...</div>
  {:else if isPersistenceError()}
    <div>Error!</div>
  {:else}
    <nav
      class="wallet-navigation m-auto -mbs-8 flex w-full max-w-lg ps-22 pe-22"
    >
      <div class="relative">
        <h2
          class="border-s border-bs px-2 py-1"
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
        class="wallet-toggle-button w-8 border px-2 text-center"
        aria-label="toggle list of wallets"
      />

      <a
        href={resolve("/add")}
        aria-current={page.url.pathname === "/add"}
        class="border border-s-0 px-2 py-1 aria-current:bg-red-700">add</a
      >
    </nav>

    <section class="m-auto w-full max-w-lg">
      {@render children()}
    </section>
  {/if}
</main>

<style>
  .wallet-toggle-button {
    appearance: none;
    cursor: pointer;
    font: inherit;
    color: inherit;

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

  .wallet-navigation:has(.wallet-toggle-button:checked) {
    .wallet-dropdown {
      display: block;
    }
  }
</style>
