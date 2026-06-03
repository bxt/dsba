<script lang="ts">
  import { getPersistence } from "$lib/persistence.svelte";

  function download(filename: string, data: unknown) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "text/json" });
    const link = document.createElement("a");

    link.download = filename;
    link.href = URL.createObjectURL(blob);

    link.click();
    link.remove();
  }
</script>

<button
  class="my-15 inline-block rounded-lg border px-2"
  onclick={() => {
    download(`dsba-data-${new Date().toISOString()}.json`, getPersistence());
  }}>export JSON</button
>
