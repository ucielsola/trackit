<script lang="ts">
	import { onMount } from 'svelte';

	import { UserPlus } from '@lucide/svelte';

	import ClientsTable from '$lib/components/clients/ClientsTable.svelte';
	import { getAppState } from '$lib/state';

	import { DrawerIds } from '$lib/types';

	const appState = getAppState();

	const openCreateClientModal = () => {
		appState.drawerId = DrawerIds.CreateClient;
	};

	onMount(() => {
		appState.pageTitle = 'TrackIt - Clients';
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

	<ClientsTable />
</div>
