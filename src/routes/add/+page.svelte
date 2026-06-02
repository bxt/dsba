<script lang="ts">
  import { createNewAndActiveWallet } from "$lib/persistence.svelte";
  import WalletForm from "$lib/WalletForm.svelte";
</script>

<WalletForm action={createNewAndActiveWallet} balance={0} />
