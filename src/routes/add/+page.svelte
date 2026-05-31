<script lang="ts">
  import { goto } from "$app/navigation";
  import { createNewAndActiveWallet } from "$lib/persistence.svelte";
  import { resolve } from "$app/paths";
</script>

<form
  onsubmit={(event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget, event.submitter);
    const name = data.get("name")?.toString();
    if (!name) throw new Error("name empty?");
    const balanceRaw = data.get("balance");
    if (!balanceRaw) throw new Error("name empty?");
    const balance = parseFloat(balanceRaw.toString());

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
      <input name="balance" type="number" step="0.01" value={0} required />
    </label>&thinsp;€
  </p>
  <button type="submit">save</button>
  <a href={resolve("/")}>cancel</a>
</form>
