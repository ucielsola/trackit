import { getContext, setContext } from 'svelte';
import type { Project } from '$lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';

class ProjectsState {
	#supabase: SupabaseClient;
	#projects: Project[] = [];

	constructor(supabase: SupabaseClient) {
		this.#supabase = supabase;
	}

	get projects() {
		return this.#projects;
	}

	async fetchProjects() {
		const { data, error } = await this.#supabase
			.from('projects')
			.select('*')
			.order('created_at', { ascending: false });

		if (!error && data) {
			this.#projects = data as Project[];
		}
	}
}

const KEY = Symbol('projectsState');

export const createProjectsState = (supabase: SupabaseClient) => {
	const state = new ProjectsState(supabase);
	setContext(KEY, state);
	return state;
};

export const getProjectsState = (): ProjectsState => {
	return getContext(KEY);
};