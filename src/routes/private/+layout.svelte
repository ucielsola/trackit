<script>
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<header class="h-16 bg-base-200 border-b border-base-300 flex items-center px-4 z-10">
	  <!-- HEADER -->
	</header>
  
	<div class="flex flex-1 overflow-hidden">
	  <aside class="w-64 bg-base-100 border-r border-base-300 p-4 hidden md:block">
		<!-- SIDEBAR -->
	  </aside>
  
	  <main class="flex-1 overflow-y-auto p-6">
		{@render children()}
	  </main>
	</div>
  </div>