<script lang="ts">
	import ProjectsTable from '$lib/components/projects/ProjectsTable.svelte';
	import CreateProject from '$lib/components/projects/CreateProject.svelte';
	import { getAppState } from '$lib/state/appState.svelte.js';
	import { getProjectsState } from '$lib/state/projectsState.svelte.js';
	import { UserPlus } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { DrawerIds } from '$lib/types';

	const projectState = getProjectsState();
	const appState = getAppState();

	const openCreateProjectModal = () => (appState.drawerId = DrawerIds.CreateProject);

	onMount(() => {
		projectState.loadProjects();
		appState.pageTitle = 'TrackIt - Projects';
	});
</script>

<div class="mx-auto mt-24 flex h-full w-full max-w-[60rem] flex-col gap-8 p-2">
	<div class="flex items-center justify-between">
		<h1 class="pt-1 text-2xl font-bold">Projects</h1>
		<button class="btn btn-primary" onclick={openCreateProjectModal}>
			<UserPlus class="h-4 w-4" />
			Add project
		</button>
	</div>

	<ProjectsTable />
</div>
