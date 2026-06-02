<script lang="ts">
  import { goto } from "$app/navigation";
  import { createNewAndActiveWallet } from "$lib/persistence.svelte";
  import { resolve } from "$app/paths";
  import NumberInput from "$lib/NumberInput.svelte";

  let balance = $state(0);
</script>

<form
  onsubmit={(event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget, event.submitter);
    const name = data.get("name")?.toString();
    if (!name) throw new Error("name empty?");
    if (isNaN(balance)) throw new Error("balance empty?");

    createNewAndActiveWallet({ name, balance });
    goto(resolve("/"));
  }}
>
  <p>
    <label>
      <span>Name:</span>
      <input name="name" required />
    </label>
  </p>
  <p>
    <label>
      <span>Balance:</span>
      <NumberInput name="balance" required bind:value={balance} />
    </label>&thinsp;€
  </p>
  <button type="submit">save</button>
  <a href={resolve("/")}>cancel</a>
</form>
