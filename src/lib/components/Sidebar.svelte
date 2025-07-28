<script lang="ts">
	import { page } from '$app/state';
	import { getAppState } from '$lib/state';
	import { Sparkles, FolderOpenDot, LogOut, Settings, Users } from '@lucide/svelte';
	import ThemeSelector from './ThemeSelector.svelte';

	let route = $derived(page.route.id || '');
	const appState = getAppState();

	let user = $derived(appState.user);

	const logout = () => {
		appState.logout();
	};
</script>

<aside class="flex w-64 shrink-0 flex-col border-r border-base-300 bg-base-100">
	<div class="flex-1 p-2">
		<div class="flex items-center justify-end">
			<ThemeSelector />
		</div>

		<ul class="flex flex-col gap-2">
			<li>
				<a
					href="/private"
					class="btn {route === '/private' ? 'btn-active btn-secondary' : 'btn-ghost'}"
				>
					<Sparkles class="w-4" />
					Dashboard
				</a>
			</li>
			<li>
				<a
					href="/private/projects"
					class="btn {route === '/private/projects' ? 'btn-active btn-secondary' : 'btn-ghost'}"
				>
					<FolderOpenDot class="w-4" />
					Projects
				</a>
			</li>
			<li>
				<a
					href="/private/clients"
					class="btn {route === '/private/clients' ? 'btn-active btn-secondary' : 'btn-ghost'}"
				>
					<Users class="w-4" />
					Clients
				</a>
			</li>
			<li>
				<a
					href="/private/settings"
					class="btn {route === '/private/settings' ? 'btn-active btn-secondary' : 'btn-ghost'}"
				>
					<Settings class="w-4" />
					Settings
				</a>
			</li>
		</ul>
	</div>

	<div class="flex flex-col gap-2 p-2">
		<div class="badge badge-neutral">{user?.email}</div>
		<button type="button" onclick={logout} class="btn w-full btn-outline btn-sm btn-error">
			<LogOut class="w-4" />
			Logout
		</button>
	</div>
</aside>
