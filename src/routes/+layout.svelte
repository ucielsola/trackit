<script>
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { initializeApp } from '$lib/initializeApp';
	import { getAppState } from '$lib/state';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	initializeApp();
	const appState = getAppState();

	appState.setUser(data?.user ?? null);
	appState.setTheme(data.cookies.find((cookie) => cookie.name === 'color-theme')?.value ?? 'light');

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>TrackIt</title>
</svelte:head>

{@render children()}
