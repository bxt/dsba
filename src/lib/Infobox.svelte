<script>
  import { slide } from "svelte/transition";
</script>

<aside
  transition:slide
  class="m-auto flex w-full max-w-lg flex-col gap-1 pbe-8"
>
  <p>
    DSBA (meaning Damn Simple Budget App) makes keeping track of your expenses
    simple: It's a digital version of a wallet. You just enter how much you put
    in and out and it keeps track of the balance.
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
