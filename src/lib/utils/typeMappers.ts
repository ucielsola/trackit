import type { Client, NewClient, Project, NewProject } from '$lib/types';

export const mapProjectFromForm = (data: {
	name: string;   
	clientId?: string;
	hourlyRate?: number;
	userId: string;
}): NewProject => ({
	name: data.name,
	client_id: data.clientId ?? null,
	hourly_rate: data.hourlyRate ?? 0,
	user_id: data.userId
});

export const mapProjectToForm = (project: Project) => ({
	id: project.id,
	name: project.name,
	clientId: project.client_id ?? undefined,
	hourlyRate: project.hourly_rate,
	userId: project.user_id
});

export const mapClientFromForm = (data: { name: string; userId: string }): NewClient => ({
	name: data.name,
	user_id: data.userId
});

export const mapClientToForm = (client: Client) => ({
	id: client.id,
	name: client.name,
	userId: client.user_id
});
