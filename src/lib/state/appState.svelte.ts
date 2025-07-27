import { goto } from '$app/navigation';
import { getContext, setContext } from 'svelte';
import type { SupabaseClient, User } from '@supabase/supabase-js';

class AppState {
	#supabase: SupabaseClient;
	#user: User | null = $state(null);

	get user() {
		return this.#user;
	}

	constructor(supabase: SupabaseClient) {
		this.#supabase = supabase;
	}

	public setUser(user: User | null) {
		this.#user = user;
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

	async logout(redirectTo: string = '/auth') {
		await this.#supabase.auth.signOut();
		goto(redirectTo);
	}
}

const KEY = Symbol('appState');

export const createAppState = (supabase: SupabaseClient) => {
	return setContext<AppState>(KEY, new AppState(supabase));
};

export const getAppState = (): ReturnType<typeof createAppState> => {
	return getContext<AppState>(KEY);
};
