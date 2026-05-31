<script lang="ts">
  import { slide } from "svelte/transition";
  import {
    isOnboardingCompleted,
    setOnboardingCompleted,
  } from "./persistence.svelte";

  let isManuallyOpened = $state(false);

  function toggle() {
    if (!isOnboardingCompleted()) {
      setOnboardingCompleted();
    } else {
      isManuallyOpened = !isManuallyOpened;
    }
  }
</script>

<button onclick={toggle}>toggle infobox</button>

{#if !isOnboardingCompleted() || isManuallyOpened}
  <aside transition:slide class="flex flex-col gap-1">
    <p>
      DSBA (meaning Damn Simple Budget App) makes keeping track of your expenses
      simple: It's just a digital version of a wallet. You just enter how much
      you put in and out and it keeps track of the balance.
    </p>
    <p>All data is saved on your device only.</p>
    <p>
      It is open-source and you can find <a
        href="https://github.com/bxt/dsba"
        target="_blank"
        rel="noopener noreferrer">the code on GitHub</a
      >.
    </p>
    <p>
      If you find any problems, please
      <a
        href="https://github.com/bxt/dsba/issues"
        target="_blank"
        rel="noopener noreferrer">report an issue on GitHub</a
      >.
    </p>
    <p>This app was created by Bernhard Häussner.</p>
  </aside>
{/if}

<style>
  button {
    font-size: 2em;
  }
</style>
