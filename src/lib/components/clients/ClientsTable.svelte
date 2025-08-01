<script lang="ts">
	import { fade } from 'svelte/transition';

	import { Check, Info, Pencil, Save, Trash, X } from '@lucide/svelte';

	import { getClientsState } from '$lib/state';

	import { formatDateToLocalDMY } from '$lib/utils/formatDateToLocalDMY';

	import type { ClientWithStats } from '$lib/types';

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
				<th>Name</th>
				<th class:opacity-0={!!editClientId}>Created at</th>
				<th class:opacity-0={!!editClientId}>Projects #</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each clientState.clients as client}
				<tr transition:fade>
					{#if editClientId === client.id}
						{@render clientEditRow()}
					{:else if deleteClientId === client.id}
						{@render clientDeleteRow(client)}
					{:else}
						{@render clientRow(client)}
					{/if}
				</tr>
			{:else}
				<tr>
					<td colspan="5">
						<div class="flex items-center justify-center gap-2">
							{#if clientState.loading && !clientState.loaded}
								<span class="loading loading-spinner text-primary"></span>
								<span class="text-sm font-medium"> Loading clients... </span>
							{:else if clientState.loaded}
								<Info class="h-4 w-4" />
								<span class="text-sm font-medium"> No clients found </span>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#snippet projectCountBadge(count: number)}
	<div class="flex items-center pl-6">
		<div class="badge badge-outline badge-sm badge-secondary">{count}</div>
	</div>
{/snippet}

{#snippet clientRow(client: ClientWithStats)}
	<td class="w-6/12">{client.name}</td>
	<td class="w-2/12">
		{client.created_at ? formatDateToLocalDMY(new Date(client.created_at)) : '--'}
	</td>
	<td class="w-2/12"> {@render projectCountBadge(client.project_count)} </td>

	<td class="w-2/12">
		<div class="flex justify-end gap-1" class:opacity-0={!!deleteClientId || !!editClientId}>
			<button
				disabled={!!deleteClientId || !!editClientId}
				class="btn btn-square btn-outline btn-primary"
				onclick={() => onClickEdit(client.id)}><Pencil class="h-4 w-4" /></button
			>
			<button
				disabled={!!deleteClientId || !!editClientId}
				class="btn btn-square btn-outline btn-error"
				onclick={() => onClickDelete(client.id)}><Trash class="h-4 w-4" /></button
			>
		</div>
	</td>
{/snippet}

{#snippet clientDeleteRow(client: ClientWithStats)}
	<td class="w-6/12">{client.name}</td>
	<td class="w-2/12">
		{client.created_at ? formatDateToLocalDMY(new Date(client.created_at)) : '--'}
	</td>
	<td class="w-2/12">
		{@render projectCountBadge(client.project_count)}
	</td>

	<td class="w-2/12">
		<div class="flex items-center justify-end gap-1">
			<div class="badge text-sm font-bold whitespace-nowrap badge-warning">Are you sure?</div>

			<button class="btn btn-square btn-outline btn-success" onclick={onDelete}>
				<Check class="h-4 w-4" />
			</button>
			<button class="btn btn-square btn-outline btn-error" onclick={() => (deleteClientId = null)}>
				<X class="h-4 w-4" />
			</button>
		</div>
	</td>
{/snippet}

{#snippet clientEditRow()}
	<td colspan="6" class="w-12/12">
		<div class="flex items-center gap-2">
			<input
				type="text"
				placeholder="Type here"
				class="input w-full"
				bind:value={newName}
				bind:this={inputRef}
				onkeydown={(e) => e.key === 'Enter' && newName.trim() !== '' && onSaveChanges()}
			/>
		</div>
	</td>
	<td class="w-2/12">
		<div class="flex w-full justify-end gap-1">
			<button
				class="btn btn-square btn-outline btn-success"
				onclick={onSaveChanges}
				disabled={newName.trim() === ''}
			>
				<Save class="h-4 w-4" />
			</button>
			<button class="btn btn-square btn-outline btn-error" onclick={() => (editClientId = null)}>
				<X class="h-4 w-4" />
			</button>
		</div>
	</td>
{/snippet}
