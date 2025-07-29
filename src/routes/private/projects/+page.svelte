<script lang="ts">
	import { getAppState } from '$lib/state/appState.svelte.js';
	import { onMount } from 'svelte';

	const appState = getAppState();

	onMount(() => {
		appState.pageTitle = 'TrackIt - Projects';
	});
</script>
