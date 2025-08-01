import { getContext, setContext } from 'svelte';
import type { ProjectWithStats } from '$lib/types';

class ProjectsState {
	#projects = $state<ProjectWithStats[]>([]);
	#loaded = $state<boolean>(false);
	#loading = $state<boolean>(false);
	#error = $state<string | null>(null);
	#success = $state<string | null>(null);
	#showCreateDrawer = $state<boolean>(false);

	constructor() {}

	get projects() {
		return this.#projects;
	}

	get loaded() {
		return this.#loaded;
	}

	get loading() {
		return this.#loading;
	}

	get error() {
		return this.#error;
	}

	set error(value: string | null) {
		this.#error = value;
	}

	get success() {
		return this.#success;
	}

	set success(value: string | null) {
		this.#success = value;
	}

	get showCreateDrawer() {
		return this.#showCreateDrawer;
	}

	set showCreateDrawer(value: boolean) {
		this.#showCreateDrawer = value;
	}

	async loadProjects() {
		this.#loading = true;
		this.#error = null;

		try {
			const response = await fetch('/private/api/projects');

			if (!response.ok) {
				throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
			}

			const { projects }: { projects: ProjectWithStats[]; total: number } = await response.json();

			this.#projects = projects.sort((a, b) => a.name.localeCompare(b.name));
			this.#loaded = true;
		} catch (error) {
			console.error('Error loading projects:', error);
			this.#error = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			this.#loading = false;
		}
	}

	async createProject(name: string, client: string, hourly_rate: number) {
		this.#loading = true;
		this.#error = null;

		try {
			const response = await fetch('/private/api/projects', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name, client_id: client, hourly_rate })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `Failed to create project: ${response.status} ${response.statusText}`
				);
			}

			const { project } = await response.json();
			this.#projects = [...this.#projects, project].sort((a, b) => a.name.localeCompare(b.name));
			this.#success = 'Project created successfully';
		} catch (error) {
			console.error('Error creating project:', error);
			this.#error = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			this.#loading = false;
		}
	}

	async updateProject(id: string, updates: Partial<ProjectWithStats>) {
		this.#error = null;

		const projectIndex = this.#projects.findIndex((p) => p.id === id);
		if (projectIndex === -1) {
			this.#error = 'Project not found';
			return;
		}

		const originalProject = { ...this.#projects[projectIndex] };

		this.#projects[projectIndex] = { ...this.#projects[projectIndex], ...updates };

		if (updates.name) {
			this.#projects.sort((a, b) => a.name.localeCompare(b.name));
		}

		try {
			const sanitizedUpdates = Object.fromEntries(
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				Object.entries(updates).filter(([_, v]) => v !== undefined)
			);

			const response = await fetch(`/private/api/projects/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(sanitizedUpdates)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `Failed to update project: ${response.status} ${response.statusText}`
				);
			}

			this.#success = 'Project updated successfully';
		} catch (error) {
			console.error('Error updating project:', error);
			this.#error = error instanceof Error ? error.message : 'Unknown error';

			const currentIndex = this.#projects.findIndex((p) => p.id === id);
			if (currentIndex !== -1) {
				this.#projects[currentIndex] = originalProject;
				this.#projects.sort((a, b) => a.name.localeCompare(b.name));
			}
		}
	}

	async deleteProject(id: string) {
		this.#loading = true;
		this.#error = null;

		try {
			const response = await fetch(`/private/api/projects/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `Failed to delete project: ${response.status} ${response.statusText}`
				);
			}

			this.#success = 'Project deleted successfully';
			this.#projects = this.#projects.filter((p) => p.id !== id);
		} catch (error) {
			console.error('Error deleting project:', error);
			this.#error = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			this.#loading = false;
		}
	}
}

const KEY = Symbol('projectsState');

export const createProjectsState = () => {
	const state = new ProjectsState();
	setContext(KEY, state);
	return state;
};

export const getProjectsState = (): ProjectsState => {
	return getContext(KEY);
};
