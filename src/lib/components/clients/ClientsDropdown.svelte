<script lang="ts">
	import { getClientsState } from '$lib/state';
	import { User } from '@lucide/svelte';

	let {
		name = 'client_id',
		value = $bindable<string>('')
	}: {
		name?: string;
		value?: string;
	} = $props();

	const clientsState = getClientsState();

	$effect(() => {
		if (!clientsState.loaded) clientsState.loadClients();
	});
</script>

<label class="select">
	<span class="label flex items-center gap-1">
		<User class="w-4" />
		Client
	</span>
	<select bind:value {name}>
		{#each clientsState.clients as client}
			<option value={client.id}>{client.name}</option>
		{/each}
	</select>
</label>
