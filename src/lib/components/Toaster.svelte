<script lang="ts">
	import { uuidv7 } from 'uuidv7';
	import { getClientsState } from '$lib/state';

	type Toast = {
		id: string;
		message: string;
		type: 'info' | 'success' | 'error';
	};

	const clientsState = getClientsState();

	let toastQueue = $state<Toast[]>([]);

	const createToast = (message: string, type: Toast['type']) => {
		if (!toastQueue.find((t) => t.message === message)) {
			const id = uuidv7();
			toastQueue.push({ id, message, type });

			setTimeout(() => {
				toastQueue = toastQueue.filter((t) => t.id !== id);
			}, 2000);
		}
	};

	$effect(() => {
		if (clientsState.error) {
			createToast(clientsState.error, 'error');
			clientsState.error = null;
		}

		if (clientsState.success) {
			createToast(clientsState.success, 'success');
			clientsState.success = null;
		}
	});
</script>

<div class="toast-center toast">
	{#each toastQueue as toast (toast.id)}
		{@const typeClass =
			toast.type === 'error'
				? 'alert-error'
				: toast.type === 'success'
					? 'alert-success'
					: 'alert-info'}
		<div class="alert {typeClass}">
			<span>{toast.message}</span>
		</div>
	{/each}
</div>
