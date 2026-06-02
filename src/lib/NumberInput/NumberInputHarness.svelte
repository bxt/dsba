<script lang="ts">
  import NumberInput from "./NumberInput.svelte";

  let value = $state(100);
</script>

<label>a <NumberInput name="a" bind:value /></label>
<label>b <NumberInput name="b" bind:value /></label>
