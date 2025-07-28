import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { 'color-theme': theme } = await request.json();

	cookies.set('color-theme', theme, {
		path: '/',
		sameSite: 'strict',
		secure: true,
		maxAge: 60 * 60 * 24 * 30
	});

	return json({ success: true });
};
