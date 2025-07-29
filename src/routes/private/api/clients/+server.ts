import type { ClientWithStats, Project, Entry } from '$lib/types';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const user_id = session.user.id;
	const includeStats = url.searchParams.get('include_stats') === 'true';
	const sortBy = url.searchParams.get('sort_by') || 'name';
	const order = url.searchParams.get('order') === 'desc' ? 'desc' : 'asc';

	if (sortBy === 'project_count') {
		const { data: clientsData, error } = await supabase
			.from('clients')
			.select(
				`
        id,
        name,
        created_at,
        user_id,
        projects(id, hourly_rate, entries(duration_minutes, status))
      `
			)
			.eq('user_id', user_id);

		if (error || !clientsData) {
			console.error('Error fetching clients:', error);
			return json({ error: 'Error fetching clients' }, { status: 500 });
		}

		const clientsWithStats: ClientWithStats[] = clientsData.map((client) => {
			const projects = client.projects as (Project & {
				entries: Entry[];
			})[];

			const projectCount = projects?.length || 0;
			let totalHours = 0;
			let totalRevenue = 0;

			if (includeStats && projects) {
				projects.forEach((project) => {
					const projectHours =
						project.entries
							?.filter((e) => ['billable', 'paid'].includes(e.status ?? ''))
							.reduce((sum, e) => sum + e.duration_minutes / 60, 0) || 0;

					totalHours += projectHours;
					totalRevenue += projectHours * (project.hourly_rate ?? 0);
				});
			}

			return {
				id: client.id,
				name: client.name,
				created_at: client.created_at,
				user_id: client.user_id,
				project_count: projectCount,
				...(includeStats && {
					total_hours: Math.round(totalHours * 100) / 100,
					total_revenue: Math.round(totalRevenue * 100) / 100
				})
			};
		});

		clientsWithStats.sort((a, b) =>
			order === 'desc' ? b.project_count - a.project_count : a.project_count - b.project_count
		);

		return json({ clients: clientsWithStats, total: clientsWithStats.length });
	}

	const { data, error } = await supabase
		.from('clients')
		.select(`id, name, created_at, user_id, projects(count)`) // supabase devuelve array
		.eq('user_id', user_id)
		.order(sortBy, { ascending: order === 'asc' });

	if (error || !data) {
		console.error('Error fetching clients:', error);
		return json({ error: 'Error fetching clients' }, { status: 500 });
	}

	const clients: ClientWithStats[] = data.map((client) => {
		const projects = client.projects as { count: number }[] | null;
		const count = projects?.[0]?.count ?? 0;
		
		return {
			id: client.id,
			name: client.name,
			created_at: client.created_at,
			user_id: client.user_id,
			project_count: count
		};
	});

	return json({ clients, total: clients.length });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const name = (body.name ?? '').trim();

	if (!name) {
		return json({ error: 'Name is required' }, { status: 400 });
	}

	const { data, error } = await supabase
		.from('clients')
		.insert({ name, user_id: session.user.id })
		.select()
		.single();

	if (error || !data) {
		console.error('Error creating client:', error);
		return json({ error: 'Error creating client' }, { status: 500 });
	}

	const clientWithCount: ClientWithStats = {
		...data,
		project_count: 0
	};

	return json({ client: clientWithCount }, { status: 201 });
};
