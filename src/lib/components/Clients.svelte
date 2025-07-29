<script lang="ts">
	import { getClientsState } from '$lib/state';
	import { formatDateToLocalDMY } from '$lib/utils/formatDateToLocalDMY';
	import { Check, Info, Pencil, Save, Trash, X } from '@lucide/svelte';
	import { fade } from 'svelte/transition';

	const clientState = getClientsState();
	let editClientId = $state<string | null>(null);
	let deleteClientId = $state<string | null>(null);
	let newName = $derived<string>(
		clientState.clients.find((c) => c.id === editClientId)?.name || ''
	);

	let inputRef = $state<HTMLInputElement | null>(null);

	const onClickEdit = (id: string) => {
		editClientId = id;
	};

	const onClickDelete = (id: string) => {
		deleteClientId = id;
	};

	const onSaveChanges = () => {
		clientState.updateClient(editClientId!, { name: newName });
		editClientId = null;
	};

	const onDelete = () => {
		clientState.deleteClient(deleteClientId!);
		deleteClientId = null;
	};

	$effect(() => {
		if (inputRef) {
			inputRef.focus();
			inputRef.select();
		}
	});
</script>

<div class="w-full overflow-x-auto rounded-xl border border-base-content/10">
	<table class="table-pin-rows table table-zebra table-sm">
		<thead class="rounded-t">
			<tr class="rounded-t">
				<th class="rounded-tl">Name</th>
				<th class="rounded-tr">Created at</th>
				<th class="w-24"></th>
			</tr>
		</thead>
		<tbody>
			{#each clientState.clients as client}
				<tr transition:fade>
					{#if editClientId === client.id}
						<td colspan="3">
							<div class="flex items-center gap-2">
								<input
									type="text"
									placeholder="Type here"
									class="input w-full"
									bind:value={newName}
									bind:this={inputRef}
									onkeydown={(e) => e.key === 'Enter' && newName.trim() !== '' && onSaveChanges()}
								/>
								<div class="flex gap-1">
									<button
										class="btn btn-square btn-outline btn-primary"
										onclick={onSaveChanges}
										disabled={newName.trim() === ''}
									>
										<Save class="h-4 w-4" />
									</button>
									<button
										class="btn btn-square btn-outline btn-primary"
										onclick={() => (editClientId = null)}
									>
										<X class="h-4 w-4" />
									</button>
								</div>
							</div>
						</td>
					{:else if deleteClientId === client.id}
						<td>{client.name}</td>
						<td>{client.created_at ? formatDateToLocalDMY(new Date(client.created_at)) : '--'}</td>
						<td class="w-24">
							<div class="flex items-center gap-1">
								<span class="text-sm whitespace-nowrap"> Are you sure? </span>
								<button class="btn btn-square btn-outline btn-primary" onclick={onDelete}
									><Check class="h-4 w-4" /></button
								>
								<button
									class="btn btn-square btn-outline btn-primary"
									onclick={() => (deleteClientId = null)}><X class="h-4 w-4" /></button
								>
							</div>
						</td>
					{:else}
						<td>{client.name}</td>
						<td>{client.created_at ? formatDateToLocalDMY(new Date(client.created_at)) : '--'}</td>
						<td class="w-24">
							<div class="flex gap-1" class:opacity-0={!!deleteClientId || !!editClientId}>
								<button
									disabled={!!deleteClientId || !!editClientId}
									class="btn btn-square btn-outline btn-primary"
									onclick={() => onClickEdit(client.id)}><Pencil class="h-4 w-4" /></button
								>
								<button
									disabled={!!deleteClientId || !!editClientId}
									class="btn btn-square btn-outline btn-primary"
									onclick={() => onClickDelete(client.id)}><Trash class="h-4 w-4" /></button
								>
							</div>
						</td>
					{/if}
				</tr>
			{:else}
				<tr>
					<td colspan="3">
						<div class="flex items-center justify-center gap-2">
							<Info class="h-4 w-4" />
							<span class="text-sm font-medium"> No clients found </span>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
