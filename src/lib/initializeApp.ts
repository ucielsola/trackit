import { createBrowserClient } from '@supabase/ssr';
import { createProjectsState } from './state/projectsState.svelte';
import { createAppState } from '$lib/state';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { SupabaseClient } from '@supabase/supabase-js';

export const initializeApp = () => {
	const initializers: ((supabase: SupabaseClient) => void)[] = [
		createProjectsState,
		createAppState
	];
	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	initializers.forEach((initializer) => initializer(supabase));
};
