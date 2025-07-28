<script lang="ts">
	import { Check, ChevronDown } from '@lucide/svelte';
	import { getAppState } from '$lib/state';
	import { themes } from '$lib/data/themes';

	const appState = getAppState();

	const onSetTheme = (theme: (typeof themes)[number]) => {
		appState.setTheme(theme);
		(document.activeElement as HTMLElement)?.blur();
	};
</script>

<div title="Change Theme" class="dropdown dropdown-end block">
	<div
		tabindex="0"
		role="button"
		class="group btn gap-1.5 px-1.5 btn-ghost btn-sm"
		aria-label="Change Theme"
	>
		<div
			class="grid shrink-0 grid-cols-2 gap-0.5 rounded-md border border-base-content/10 bg-base-100 p-1 transition-colors group-hover:border-base-content/20"
		>
			<div class="size-1 rounded-full bg-base-content"></div>
			<div class="size-1 rounded-full bg-primary"></div>
			<div class="size-1 rounded-full bg-secondary"></div>
			<div class="size-1 rounded-full bg-accent"></div>
		</div>
		<ChevronDown class="h-4 w-4" />
	</div>
	<div
		tabindex="0"
		class="dropdown-content top-px mt-8 h-[30.5rem] max-h-[calc(100vh-8.6rem)] overflow-y-auto rounded-box border border-white/5 bg-base-200 text-base-content shadow-2xl outline-1 outline-black/5"
	>
		<ul class="menu w-56">
			<li class="menu-title text-xs">Theme</li>
			{#each themes as theme}
				<li>
					<button
						class="gap-3 px-2"
						data-set-theme={theme}
						data-act-class="[&amp;_svg]:visible"
						onclick={() => onSetTheme(theme)}
					>
						<div
							data-theme={theme}
							class="grid shrink-0 grid-cols-2 gap-0.5 rounded-md bg-base-100 p-1 shadow-sm"
						>
							<div class="size-1 rounded-full bg-base-content"></div>
							<div class="size-1 rounded-full bg-primary"></div>
							<div class="size-1 rounded-full bg-secondary"></div>
							<div class="size-1 rounded-full bg-accent"></div>
						</div>
						<div class="w-32 truncate">{theme}</div>
						{#if theme === appState.theme}
							<Check class="h-4 w-4" />
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	</div>
</div>
