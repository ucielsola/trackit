<script lang="ts">
	import { getAppState } from '$lib/state';

	import CreateProject from '$lib/components/projects/CreateProject.svelte';
	import CreateClient from '$lib/components/clients/CreateClient.svelte';

	import type { Component as ComponentType } from 'svelte';
	import { DrawerIds } from '$lib/types';

	const components: Partial<Record<DrawerIds, ComponentType>> = {
		[DrawerIds.CreateProject]: CreateProject,
		[DrawerIds.CreateClient]: CreateClient
	};

	const appState = getAppState();

	let component = $derived<ComponentType | null>(
		appState.drawerId ? (components[appState.drawerId] ?? null) : null
	);

	let isOpen = $derived(component !== null);

	function handleDrawerClose() {
		appState.drawerId = null;
	}
</script>

<div class="drawer drawer-end h-full">
	<input
		id="trackit-drawer"
		type="checkbox"
		class="drawer-toggle"
		bind:checked={isOpen}
		onchange={() => {
			if (!isOpen) handleDrawerClose();
		}}
	/>

	<div class="drawer-side">
		<label for="trackit-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="menu min-h-full w-fit bg-base-200 p-4 text-base-content">
			{#if component}
				{@const Component = component}
				<Component />
			{/if}
		</div>
	</div>
</div>
