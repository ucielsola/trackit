<script lang="ts">
	import { uuidv7 } from 'uuidv7';
	import { getClientsState, getProjectsState } from '$lib/state';

	type Toast = {
		id: string;
		message: string;
		type: 'info' | 'success' | 'error';
	};

	const clientsState = getClientsState();
	const projectsState = getProjectsState();

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

		if (projectsState.error) {
			createToast(projectsState.error, 'error');
			projectsState.error = null;
		}

		if (projectsState.success) {
			createToast(projectsState.success, 'success');
			projectsState.success = null;
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
