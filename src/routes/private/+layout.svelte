<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
	let { children } = $props();
</script>

<div class="flex h-dvh overflow-hidden">
	<Sidebar />

	<main class="flex-1 overflow-y-auto p-6">
		{@render children()}
	</main>
</div>