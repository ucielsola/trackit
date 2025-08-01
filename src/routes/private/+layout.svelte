<script>
	import { onMount } from 'svelte';

	import Drawer from '$lib/components/Drawer.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Toaster from '$lib/components/Toaster.svelte';
	import {
		getAppState,
		createProjectsState,
		createClientsState,
		getProjectsState,
		getClientsState
	} from '$lib/state';
	let { children } = $props();

	createProjectsState();
	createClientsState();

	const appState = getAppState();
	const projectsState = getProjectsState();
	const clientsState = getClientsState();

	onMount(() => {
		projectsState.loadProjects();
		clientsState.loadClients();
	});
</script>

<svelte:head>
	<title>{appState.pageTitle}</title>
</svelte:head>

<div class="flex h-dvh overflow-hidden">
	<Sidebar />

	<main class="flex-1 overflow-y-auto">
		{@render children()}
		<Toaster />
		<Drawer />
	</main>
</div>
