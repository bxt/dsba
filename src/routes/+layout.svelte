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
  import Amount from "$lib/Amount.svelte";

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
    <h1 class="rounded-lg border px-1 text-2xl font-serif" aria-label="DSBA">
      D$BA
    </h1>
    <div>
      <button
        onclick={toggle}
        aria-label="toggle info box"
        aria-current={isOpen}
        class="size-8 rounded-full border aria-current:bg-red-700">i</button
      >
      <a
        aria-label="settings"
        href={page.url.pathname === resolve("/settings")
          ? resolve("/")
          : resolve("/settings")}
        aria-current={page.url.pathname === resolve("/settings")}
        class="inline-block size-8 rounded-full border text-center aria-current:bg-red-700 font-serif"
        >set</a
      >
    </div>
  </div>
</header>

{#if isOpen}
  <InfoBox />
{/if}

<main class="mb-8">
  {#if isPersistenceLoading()}
    <div>Loading...</div>
  {:else if isPersistenceError()}
    <div>Error!</div>
  {:else}
    <nav
      class="wallet-navigation m-auto -mbs-8 flex w-full max-w-lg flex-wrap gap-1 ps-22 pe-22"
    >
      {#each getWallets() as wallet (wallet.id)}
        {@const isCurrent = wallet.id === getActiveWallet().id}
        <button
          class="flex-auto border px-2 py-1 aria-current:bg-gray-300"
          onclick={() => setActiveWallet(wallet.id)}
          role={isCurrent ? "heading" : "undefined"}
          aria-current={isCurrent}
          >{wallet.name}
          {#if !isCurrent}<Amount value={wallet.balance} />{/if}</button
        >
      {/each}
      <a
        href={resolve("/add")}
        aria-current={page.url.pathname === resolve("/add")}
        class="border px-2 py-1 aria-current:bg-red-700 font-serif uppercase"
        >add</a
      >
    </nav>

    <section class="m-auto w-full max-w-lg">
      {@render children()}
    </section>
  {/if}
</main>
