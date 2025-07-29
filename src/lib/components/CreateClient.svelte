<script lang="ts">
	import { getClientsState } from '$lib/state';

	let modal: HTMLDialogElement;
	let creating = $state(false);
	let name = $state('');
	let error = $state<string | null>(null);
	let success = $state(false);

	const clientState = getClientsState();

	export const showModal = () => {
		resetForm();
		modal.showModal();
	};

	const hideModal = () => modal.close();

	const resetForm = () => {
		name = '';
		error = null;
		success = false;
		creating = false;
	};

	const onSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		creating = true;
		error = null;

		await clientState.createClient(name.trim());

		creating = false;
		hideModal();
	};
</script>

<dialog bind:this={modal} id="create_client_modal" class="modal">
	<div class="modal-box {creating ? 'animate-pulse cursor-progress' : ''}">
		<h3 class="text-lg font-bold">Create client</h3>
		<form onsubmit={onSubmit} class="flex flex-col gap-2">
			<div class="flex flex-col gap-2">
				<input
					disabled={creating}
					bind:value={name}
					type="text"
					class="input w-full"
					placeholder="Client name"
				/>

				<div class="h-2">
					{#if error}
						<p class="text-xs text-red-500">{error}</p>
					{:else if success}
						<p class="text-xs text-green-600">Client created successfully!</p>
					{/if}
				</div>
			</div>

			<div class="mt-2 flex justify-end gap-2">
				<button
					type="button"
					onclick={hideModal}
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

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
