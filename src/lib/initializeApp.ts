import { createBrowserClient } from '@supabase/ssr';
import { createAppState, createClientsState, createProjectsState } from '$lib/state';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { SupabaseClient } from '@supabase/supabase-js';

export const initializeApp = () => {
	const initializers: ((supabase: SupabaseClient) => void)[] = [
		createAppState,
		createClientsState,
		createProjectsState
	];
	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	initializers.forEach((initializer) => initializer(supabase));
};
