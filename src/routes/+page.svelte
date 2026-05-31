<script lang="ts">
	import {
		addExpense,
		getActiveWallet,
		isPersistenceError,
		isPersistenceLoading
	} from '$lib/persistence.svelte';

	const currencyFormat = new Intl.NumberFormat('de', { style: 'currency', currency: 'EUR' });
	const relativeTimeFormatLong = new Intl.RelativeTimeFormat('de', { style: 'long' });
	const relativeTimeFormat = new Intl.RelativeTimeFormat('de', { style: 'narrow' });

	let amount = $state(0);
</script>

<main>
	{#if isPersistenceLoading()}
		<div>Loading...</div>
	{:else if isPersistenceError()}
		<div>Error!</div>
	{:else}
		<h2>{getActiveWallet().name}</h2>
		<div title="current balance">{currencyFormat.format(getActiveWallet().balance)}</div>
		<label><span>Amount:</span><input type="number" bind:value={amount} /></label>&thinsp;€
		<button
			onclick={() => {
				addExpense(-amount);
			}}>Subtract</button
		>
		<button
			onclick={() => {
				addExpense(amount);
			}}>Add</button
		>
		<ul>
			{#each getActiveWallet().expenses as expense (expense.id)}
				{@const hoursAgo = Math.round((Date.parse(expense.date) - +new Date()) / 1000 / 60 / 60)}
				<li>
					<span>{currencyFormat.format(expense.amount)}</span>
					<span title={relativeTimeFormatLong.format(hoursAgo, 'hour')}
						>{relativeTimeFormat.format(hoursAgo, 'hour')}</span
					>
				</li>
			{/each}
		</ul>
	{/if}
</main>
