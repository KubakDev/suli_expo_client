<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { activeThemeStore } from '../../stores/ui/theme';
	import { newsStore } from '../../stores/newsStore';

	// event

	export let page = 1;
	export let total = 1;

	const dispatch = createEventDispatcher();
	function handleClick(page: number) {
		if (page < 1 || page > total) return;
		dispatch('changePage', { page: page });
	}
</script>

<nav aria-label="Page navigation example">
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<ul class="inline-flex items-center -space-x-px h-8">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<li on:click={() => handleClick(page - 1)} class="h-full">
			<a
				class="flex justify-center items-center h-full px-3 py-2 ml-0 leading-tight text-[var(--secondaryColor)] bg-[var(--primaryColor)] border border-gray-300 rounded-l-lg hover:bg-[var(--transparentSecondaryColor)] hover:text-[var(--primaryColor)]"
			>
				<span class="sr-only">Previous</span>
				<svg
					aria-hidden="true"
					class="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/></svg
				>
			</a>
		</li>
		{#each Array.from({ length: Math.min(3, page === 1 ? $newsStore.pages - page + 1 : 2)}, (_, i) => i + (page === 1 ? page : page - 1)) as pageNumber}
		{#if pageNumber > 0 && pageNumber <= $newsStore.pages}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li on:click={() => handleClick(pageNumber)} class="h-full">
					<!-- svelte-ignore a11y-missing-attribute -->
					<a
						aria-current="page"
						class="flex justify-center hover:cursor-pointer items-center h-full z-10 px-3 py-2 leading-tight border border-gray-300 bg-[var(--transparentPrimaryColor)] {page ===
						pageNumber
							? ' text-[var(--secondaryColor)]'
							: 'text-[var(--onSecondaryColor)] '}">{pageNumber}</a
					>
				</li>
			{/if}
		{/each}

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<li
			on:click={() => {
				if (page < $newsStore.pages) {
					handleClick(page + 1);
				}
			}}
			class="h-full"
		>
			<a
				class="flex justify-center items-center h-full block px-3 py-2 leading-tight text-[var(--secondaryColor)] bg-[var(--primaryColor)] border border-gray-300 rounded-r-lg hover:bg-[var(--transparentSecondaryColor)] hover:text-[var(--primaryColor)]"
			>
				<span class="sr-only">Next</span>
				<svg
					aria-hidden="true"
					class="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
						clip-rule="evenodd"
					/></svg
				>
			</a>
		</li>
	</ul>
</nav>

<style>
	li {
		margin: 0px !important;
	}
</style>
