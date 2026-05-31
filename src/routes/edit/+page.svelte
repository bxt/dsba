<script lang="ts">
  import { goto } from "$app/navigation";
  import { editActiveWallet, getActiveWallet } from "$lib/persistence.svelte";
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

    editActiveWallet({ name, balance });
    goto(resolve("/"));
  }}
>
  <p>
    <label>
      <span>Name:</span>
      <input name="name" required value={getActiveWallet().name} />
    </label>
  </p>
  <p>
    <label>
      <span>Balance:</span>
      <input
        name="balance"
        type="number"
        step="0.01"
        required
        value={getActiveWallet().balance}
      />
    </label>&thinsp;€
  </p>
  <button type="submit">save</button>
</form>
