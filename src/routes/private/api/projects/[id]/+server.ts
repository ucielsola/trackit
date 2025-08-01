import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, params, locals }) => {
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
		.from('projects')
		.update({ name })
		.eq('id', params.id)
		.eq('user_id', session.user.id)
		.select()
		.single();

	if (error || !data) {
		console.error('Error updating project:', error);
		return json({ error: 'Error updating project' }, { status: 500 });
	}

	return json({ project: data }, { status: 200 });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { error } = await supabase
		.from('projects')
		.delete()
		.eq('id', params.id)
		.eq('user_id', session.user.id);

	if (error) {
		console.error('Error deleting project:', error);
		return json({ error: 'Error deleting project' }, { status: 500 });
	}

	return json({ success: true }, { status: 200 });
};
