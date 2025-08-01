import type { ProjectWithStats } from '$lib/types';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const user_id = session.user.id;
	const sortBy = url.searchParams.get('sort_by') || 'name';
	const order = url.searchParams.get('order') === 'desc' ? 'desc' : 'asc';

	const { data, error } = await supabase
		.from('projects')
		.select(`id, name, created_at, user_id, client_id, hourly_rate`)
		.eq('user_id', user_id)
		.order(sortBy, { ascending: order === 'asc' });

	if (error || !data) {
		console.error('Error fetching projects:', error);
		return json({ error: 'Error fetching projects' }, { status: 500 });
	}

	const projects: ProjectWithStats[] = data.map((project) => {
		return {
			id: project.id,
			name: project.name,
			created_at: project.created_at,
			user_id: project.user_id,
			client_id: project.client_id,
			hourly_rate: project.hourly_rate
		};
	});

	return json({ projects, total: projects.length });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const name = (body.name ?? '').trim();
	const client_id = body.client_id;
	const hourly_rate = body.hourly_rate;

	if (!name) {
		return json({ error: 'Name is required' }, { status: 400 });
	}

	const { data, error } = await supabase
		.from('projects')
		.insert({ name, user_id: session.user.id, client_id, hourly_rate })
		.select()
		.single();

	if (error || !data) {
		console.error('Error creating project:', error);
		return json({ error: 'Error creating project' }, { status: 500 });
	}

	const projectWithStats: ProjectWithStats = {
		...data
	};

	return json({ project: projectWithStats }, { status: 201 });
};
