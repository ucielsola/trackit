<script lang="ts">
	import { onMount } from 'svelte';
	import { FolderOpenDot } from '@lucide/svelte';
	import { getProjectsState, getAppState } from '$lib/state';
	import ClientsDropdown from '$lib/components/clients/ClientsDropdown.svelte';

	const appState = getAppState();

	let creating = $state(false);
	let error = $state<string | null>(null);
	let success = $state(false);
	let name = $state('');
	let client = $state('');
	let hourlyRate = $state('');
	let nameInput: HTMLInputElement;

	const projectState = getProjectsState();

	const onSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		creating = true;
		error = null;

		await projectState.createProject(
			name?.trim() || '',
			client?.trim() || '',
			Number(hourlyRate) || 0 
		);

		creating = false;
		closeDrawer();
	};

	const closeDrawer = () => {
		appState.drawerId = null;
	};

	onMount(() => {
		setTimeout(() => {
			nameInput?.focus();
		}, 500);
	});
</script>

<div class="flex w-96 flex-1 flex-col gap-6">
	<h3 class="flex items-center gap-2 text-xl font-bold">
		<FolderOpenDot class="w-6" />
		Create project
	</h3>
	<form class="flex flex-1 flex-col gap-2" onsubmit={onSubmit}>
		<div class="flex flex-col gap-2">
			<label class="input">
				<span class="label">Name</span>
				<input
					name="name"
					disabled={creating}
					type="text"
					class="input w-full"
					placeholder="Project name"
					bind:value={name}
					bind:this={nameInput}
				/>
			</label>

			<ClientsDropdown name="client" bind:value={client} />

			<label class="input">
				<span class="label">Hourly rate</span>
				<input
					name="hourly_rate"
					disabled={creating}
					type="number"
					min="0"
					step="any"
					class="input w-full"
					placeholder="Hourly rate"
					bind:value={hourlyRate}
					inputmode="decimal"
				/>
			</label>

			<div class="h-2">
				{#if error}
					<p class="text-xs text-red-500">{error}</p>
				{:else if success}
					<p class="text-xs text-green-600">Project created successfully!</p>
				{/if}
			</div>
		</div>

		<div class="mt-auto flex justify-end gap-2">
			<button
				type="button"
				onclick={closeDrawer}
				class="btn btn-outline btn-error"
				disabled={creating || success}
			>
				Cancel
			</button>
			<button type="submit" class="btn btn-primary" disabled={creating || success}>
				Create project
			</button>
		</div>
	</form>
</div>
