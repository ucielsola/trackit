<script lang="ts">
	import Clients from '$lib/components/Clients.svelte';
	import CreateClient from '$lib/components/CreateClient.svelte';
	import { getClientsState } from '$lib/state/clientsState.svelte.js';
	import { UserPlus } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { form } = $props();
	let createClientModal: CreateClient;

	const clientState = getClientsState();
	const openCreateClientModal = () => createClientModal?.showModal();

	onMount(() => {
		clientState.loadClients();
	});
</script>

<div class="mx-auto mt-24 flex h-full w-full max-w-[60rem] flex-col gap-8 p-2">
	<div class="flex items-center justify-between">
		<h1 class="pt-1 text-2xl font-bold">Clients</h1>
		<button class="btn btn-primary" onclick={openCreateClientModal}>
			<UserPlus class="h-4 w-4" />
			Add client
		</button>
	</div>

	<Clients />

	<CreateClient {form} bind:this={createClientModal} />
</div>
