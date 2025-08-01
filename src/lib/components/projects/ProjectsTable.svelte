<script lang="ts">
	import { fade } from 'svelte/transition';

	import { Check, Info, Pencil, Save, Trash, X } from '@lucide/svelte';

	import { getClientsState, getProjectsState } from '$lib/state';

	import { formatDateToLocalDMY } from '$lib/utils/formatDateToLocalDMY';

	import type { ProjectWithStats } from '$lib/types';
	import { formatUSD } from '$lib/utils/formatUsd';

	const projectState = getProjectsState();
	const clientState = getClientsState();

	let editProjectId = $state<string | null>(null);
	let deleteProjectId = $state<string | null>(null);
	let newName = $derived<string>(
		projectState.projects.find((p) => p.id === editProjectId)?.name || ''
	);

	let inputRef = $state<HTMLInputElement | null>(null);

	const onClickEdit = (id: string) => {
		editProjectId = id;
	};

	const onClickDelete = (id: string) => {
		deleteProjectId = id;
	};

	const onSaveChanges = () => {
		projectState.updateProject(editProjectId!, { name: newName });
		editProjectId = null;
	};

	const onDelete = () => {
		projectState.deleteProject(deleteProjectId!);
		deleteProjectId = null;
	};

	$inspect(projectState.projects);

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
				<th>Client</th>
				<th>Hourly rate</th>
				<th class:opacity-0={!!editProjectId}>Created at</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each projectState.projects as project}
				<tr transition:fade>
					{#if editProjectId === project.id}
						{@render projectEditRow()}
					{:else if deleteProjectId === project.id}
						{@render projectDeleteRow(project)}
					{:else}
						{@render projectRow(project)}
					{/if}
				</tr>
			{:else}
				<tr>
					<td colspan="5">
						<div class="flex items-center justify-center gap-2">
							{#if projectState.loading && !projectState.loaded}
								<span class="loading loading-spinner text-primary"></span>
								<span class="text-sm font-medium"> Loading projects... </span>
							{:else if projectState.loaded}
								<Info class="h-4 w-4" />
								<span class="text-sm font-medium"> No projects found </span>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#snippet projectRow(project: ProjectWithStats)}
	<td class="w-4/12">{project.name}</td>
	<td class="w-2/12">{clientState.getClientById(project.client_id!)?.name}</td>
	<td class="w-2/12">{formatUSD(project.hourly_rate)}</td>
	<td class="w-2/12">
		{project.created_at ? formatDateToLocalDMY(new Date(project.created_at)) : '--'}
	</td>

	<td class="w-2/12">
		<div class="flex justify-end gap-1" class:opacity-0={!!deleteProjectId || !!editProjectId}>
			<button
				disabled={!!deleteProjectId || !!editProjectId}
				class="btn btn-square btn-outline btn-primary"
				onclick={() => onClickEdit(project.id)}><Pencil class="h-4 w-4" /></button
			>
			<button
				disabled={!!deleteProjectId || !!editProjectId}
				class="btn btn-square btn-outline btn-error"
				onclick={() => onClickDelete(project.id)}><Trash class="h-4 w-4" /></button
			>
		</div>
	</td>
{/snippet}

{#snippet projectDeleteRow(project: ProjectWithStats)}
	<td class="w-4/12">{project.name}</td>
	<td class="w-2/12">{clientState.getClientById(project.client_id!)?.name}</td>
	<td class="w-2/12">{formatUSD(project.hourly_rate)}</td>
	<td class="w-2/12">
		{project.created_at ? formatDateToLocalDMY(new Date(project.created_at)) : '--'}
	</td>

	<td class="w-2/12">
		<div class="flex items-center justify-end gap-1">
			<div class="badge text-sm font-bold whitespace-nowrap badge-warning">Are you sure?</div>

			<button class="btn btn-square btn-outline btn-success" onclick={onDelete}>
				<Check class="h-4 w-4" />
			</button>
			<button class="btn btn-square btn-outline btn-error" onclick={() => (deleteProjectId = null)}>
				<X class="h-4 w-4" />
			</button>
		</div>
	</td>
{/snippet}

{#snippet projectEditRow()}
	<td colspan="5" class="w-12/12">
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
			<button class="btn btn-square btn-outline btn-error" onclick={() => (editProjectId = null)}>
				<X class="h-4 w-4" />
			</button>
		</div>
	</td>
{/snippet}
