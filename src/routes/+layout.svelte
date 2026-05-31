<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import Infobox from "$lib/Infobox.svelte";

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

{@render children()}
