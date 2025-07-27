import { getContext, setContext } from 'svelte';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';

class AuthService {
	#supabase: SupabaseClient;

	constructor() {
		this.#supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
	}

	get client() {
		return this.#supabase;
	}

	async sendOtp(email: string): Promise<string | null> {
		const { error } = await this.#supabase.auth.signInWithOtp({
			email,
			options: { shouldCreateUser: true }
		});
		return error?.message ?? null;
	}

	async verifyOtp(email: string, otp: string): Promise<string | null> {
		const { error } = await this.#supabase.auth.verifyOtp({
			email,
			token: otp,
			type: 'email'
		});

		if (error) return error.message;

		let session = null;
		for (let i = 0; i < 10; i++) {
			const { data } = await this.#supabase.auth.getSession();
			session = data.session;
			if (session) break;
			await new Promise((r) => setTimeout(r, 200));
		}

		if (!session) return 'Login successful but session not ready. Please try again.';
		return null;
	}
}

const KEY = Symbol('authService');

export const setAuthService = () => {
	const auth = new AuthService();
	setContext<AuthService>(KEY, auth);
	return auth;
};

export const getAuthService = (): AuthService => {
	return getContext<AuthService>(KEY);
};
