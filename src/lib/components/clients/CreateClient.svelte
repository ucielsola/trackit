<script lang="ts">
	import { getClientsState, getAppState } from '$lib/state';
	import { UserPlus } from '@lucide/svelte';

	let creating = $state(false);
	let error = $state<string | null>(null);
	let success = $state(false);
	let name = $state('');
	let nameInput: HTMLInputElement;

	const appState = getAppState();
	const clientState = getClientsState();

	const onSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		creating = true;
		error = null;

		await clientState.createClient(name?.trim() || '');

		creating = false;
		closeDrawer();
	};

	const closeDrawer = () => {
		appState.drawerId = null;
	};

	import { onMount } from 'svelte';

	onMount(() => {
		setTimeout(() => {
			nameInput?.focus();
		}, 100);
	});
</script>

<div class="flex w-96 flex-1 flex-col gap-6">
	<h3 class="flex items-center gap-2 text-xl font-bold">
		<UserPlus class="w-6" />
		Create client
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
					placeholder="Client name"
					bind:value={name}
					bind:this={nameInput}
				/>
			</label>
			<div class="h-2">
				{#if error}
					<p class="text-xs text-red-500">{error}</p>
				{:else if success}
					<p class="text-xs text-green-600">Client created successfully!</p>
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
				Create client
			</button>
		</div>
	</form>
</div>
