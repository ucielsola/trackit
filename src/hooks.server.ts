import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { themes } from '$lib/data/themes';

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

export const colorThemeHandle: Handle = async ({ event, resolve }) => {
	const cookieTheme = event.cookies.get('color-theme') ?? '';
	const prefersDark = event.request.headers.get('sec-ch-prefers-color-theme') === 'dark';

	const isValidTheme = (t: string | null): t is string => !!t && themes.includes(t);
	const chosenColorTheme = isValidTheme(cookieTheme) ? cookieTheme : prefersDark ? 'dark' : 'light';

	event.locals.colorTheme = chosenColorTheme;

	if (!isValidTheme(cookieTheme)) {
		event.cookies.set('color-theme', chosenColorTheme, {
			path: '/',
			sameSite: 'strict',
			secure: true,
			maxAge: 60 * 60 * 24 * 30
		});
	}

	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace(/(<html[^>]*?)data-theme="[^"]*"/, `$1data-theme="${chosenColorTheme}"`)
				.replace(/<html((?!data-theme)[^>]*)>/, `<html$1 data-theme="${chosenColorTheme}">`)
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	const path = event.url.pathname.replace(/\/+$/, '') || '/';
	const isRoot = path === '/';
	const isAuth = path === '/auth';
	const isPrivate = path.startsWith('/private');
	const isApi = path.startsWith('/api/');
	const isProtectedApi = path.startsWith('/api/private/');

	if (isApi && !isProtectedApi) return resolve(event);

	if (!session && (isPrivate || isProtectedApi || isRoot)) {
		throw redirect(303, '/auth');
	}

	if (session && !isPrivate && !isApi && (!isAuth || isRoot)) {
		throw redirect(303, '/private');
	}

	return resolve(event);
};

export const handle: Handle = sequence(colorThemeHandle, supabase, authGuard);
