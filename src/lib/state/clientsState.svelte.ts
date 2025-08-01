import { getContext, setContext } from 'svelte';
import type { ClientWithStats } from '$lib/types';

class ClientsState {
	#clients = $state<ClientWithStats[]>([]);
	#loaded = $state<boolean>(false);
	#loading = $state<boolean>(false);
	#error = $state<string | null>(null);
	#success = $state<string | null>(null);

	constructor() {}

	get clients() {
		return this.#clients;
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

	getClientById(id: string): ClientWithStats | null {
		return this.#clients.find((c) => c.id === id) ?? null;
	}

	async loadClients() {
		this.#loading = true;
		this.#error = null;

		try {
			const response = await fetch('/private/api/clients');

			if (!response.ok) {
				throw new Error(`Failed to fetch clients: ${response.status} ${response.statusText}`);
			}

			const { clients }: { clients: ClientWithStats[]; total: number } = await response.json();

			this.#clients = clients.sort((a, b) => a.name.localeCompare(b.name));
			this.#loaded = true;
		} catch (error) {
			console.error('Error loading clients:', error);
			this.#error = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			this.#loading = false;
		}
	}

	async createClient(name: string) {
		this.#loading = true;
		this.#error = null;

		try {
			const response = await fetch('/private/api/clients', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `Failed to create client: ${response.status} ${response.statusText}`
				);
			}

			const { client } = await response.json();
			this.#clients = [...this.#clients, client].sort((a, b) => a.name.localeCompare(b.name));
			this.#success = 'Client created successfully';
		} catch (error) {
			console.error('Error creating client:', error);
			this.#error = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			this.#loading = false;
		}
	}

	async updateClient(id: string, updates: Partial<ClientWithStats>) {
		this.#error = null;

		const clientIndex = this.#clients.findIndex((c) => c.id === id);
		if (clientIndex === -1) {
			this.#error = 'Client not found';
			return;
		}

		const originalClient = { ...this.#clients[clientIndex] };

		this.#clients[clientIndex] = { ...this.#clients[clientIndex], ...updates };

		if (updates.name) {
			this.#clients.sort((a, b) => a.name.localeCompare(b.name));
		}

		try {
			const response = await fetch(`/private/api/clients/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updates)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `Failed to update client: ${response.status} ${response.statusText}`
				);
			}

			this.#success = 'Client updated successfully';
		} catch (error) {
			console.error('Error updating client:', error);
			this.#error = error instanceof Error ? error.message : 'Unknown error';

			const currentIndex = this.#clients.findIndex((c) => c.id === id);
			if (currentIndex !== -1) {
				this.#clients[currentIndex] = originalClient;
				this.#clients.sort((a, b) => a.name.localeCompare(b.name));
			}
		}
	}

	async deleteClient(id: string) {
		this.#loading = true;
		this.#error = null;

		try {
			const response = await fetch(`/private/api/clients/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `Failed to delete client: ${response.status} ${response.statusText}`
				);
			}

			this.#success = 'Client deleted successfully';
			this.#clients = this.#clients.filter((c) => c.id !== id);
		} catch (error) {
			console.error('Error deleting client:', error);
			this.#error = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			this.#loading = false;
		}
	}
}

const KEY = Symbol('clientsState');

export const createClientsState = () => {
	const state = new ClientsState();
	setContext(KEY, state);
	return state;
};

export const getClientsState = (): ClientsState => {
	return getContext(KEY);
};
