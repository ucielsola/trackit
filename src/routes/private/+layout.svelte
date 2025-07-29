<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Toaster from '$lib/components/Toaster.svelte';
	let { children } = $props();
</script>

<div class="flex h-dvh overflow-hidden">
	<Sidebar />

	<main class="flex-1 overflow-y-auto">
		{@render children()}
		<Toaster />
	</main>
</div>
