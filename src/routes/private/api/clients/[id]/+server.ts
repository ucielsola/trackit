import type { ClientWithStats, Project, Entry } from '$lib/types';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, url, locals }) => {
	const supabase = locals.supabase;

	try {
		const session = locals.session;
		if (!session?.user?.id) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = params;
		const includeStats = url.searchParams.get('include_stats') === 'true';

		const { data, error } = await supabase
			.from('clients')
			.select(
				`
				id,
				name,
				created_at,
				user_id,
				projects(
					id,
					name,
					hourly_rate,
					${includeStats ? 'entries(duration_minutes, status)' : 'id'}
				)
			`
			)
			.eq('id', id)
			.eq('user_id', session.user.id)
			.single();

		if (error) {
			if (error.code === 'PGRST116') {
				return json({ error: 'Client not found' }, { status: 404 });
			}
			console.error('Error fetching client:', error);
			return json({ error: 'Error fetching client' }, { status: 500 });
		}

		let totalHours = 0;
		let totalRevenue = 0;

		if (includeStats && data.projects) {
			data.projects.forEach((project: Project & { entries?: Entry[] }) => {
				const billableEntries = project.entries?.filter(
					(entry) => entry.status === 'billable' || entry.status === 'paid'
				) ?? [];

				const hours = billableEntries.reduce((sum, e) => sum + e.duration_minutes / 60, 0);
				totalHours += hours;
				totalRevenue += hours * (project.hourly_rate || 0);
			});
		}

		const client: ClientWithStats = {
			id: data.id,
			name: data.name,
			created_at: data.created_at,
			user_id: data.user_id,
			project_count: data.projects?.length ?? 0,
			...(includeStats && {
				total_hours: Math.round(totalHours * 100) / 100,
				total_revenue: Math.round(totalRevenue * 100) / 100
			})
		};

		return json({ client });
	} catch (err) {
		console.error('Unexpected error fetching client:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;

	try {
		const session = locals.session;
		if (!session?.user?.id) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = params;
		const body = await request.json();
		const { name } = body;

		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			return json({ error: 'Name is required' }, { status: 400 });
		}

		const { data: existingClient, error: checkError } = await supabase
			.from('clients')
			.select('id')
			.eq('id', id)
			.eq('user_id', session.user.id)
			.single();

		if (checkError || !existingClient) {
			return json({ error: 'Client not found' }, { status: 404 });
		}

		const { data, error } = await supabase
			.from('clients')
			.update({ name: name.trim() })
			.eq('id', id)
			.eq('user_id', session.user.id)
			.select('id, name, created_at, user_id, projects(count)')
			.single();

		if (error) {
			console.error('Error updating client:', error);
			return json({ error: 'Error updating client' }, { status: 500 });
		}

		const count = (data.projects as { count: number }[] | null)?.[0]?.count ?? 0;

		const client: ClientWithStats = {
			id: data.id,
			name: data.name,
			created_at: data.created_at,
			user_id: data.user_id,
			project_count: count
		};

		return json({ client });
	} catch (err) {
		console.error('Unexpected error updating client:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;

	try {
		const session = locals.session;
		if (!session?.user?.id) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = params;

		const { data: projectsCheck, error: projectsError } = await supabase
			.from('projects')
			.select('id')
			.eq('client_id', id)
			.limit(1);

		if (projectsError) {
			console.error('Error checking projects:', projectsError);
			return json({ error: 'Error checking projects' }, { status: 500 });
		}

		if (projectsCheck?.length) {
			return json(
				{ error: 'Cannot delete a client with associated projects' },
				{ status: 400 }
			);
		}

		const { error } = await supabase
			.from('clients')
			.delete()
			.eq('id', id)
			.eq('user_id', session.user.id);

		if (error) {
			console.error('Error deleting client:', error);
			return json({ error: 'Error deleting client' }, { status: 500 });
		}

		return json({ message: 'Client deleted successfully' });
	} catch (err) {
		console.error('Unexpected error deleting client:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
