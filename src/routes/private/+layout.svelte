<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Toaster from '$lib/components/Toaster.svelte';
	import { getAppState } from '$lib/state';
	let { children } = $props();

	const appState = getAppState();
</script>

<svelte:head>
	<title>{appState.pageTitle}</title>
</svelte:head>

<div class="flex h-dvh overflow-hidden">
	<Sidebar />

	<main class="flex-1 overflow-y-auto">
		{@render children()}
		<Toaster />
	</main>
</div>
