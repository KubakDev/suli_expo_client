<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { IconChevronLeft, IconChevronRight } from '@tabler/icons-svelte';
	import { currentMainThemeColors } from '../../stores/darkMode';

	export let page = 1;
	export let total: number;  

	const dispatch = createEventDispatcher();
	function handleClick(page: number) {
		if (page < 1 || page > total) return;  
		dispatch('changePage', { page: page });
	}

	// computed variable
	$: pagesToShow = getPagesToShow(page, total);  

	// helper function
	function getPagesToShow(current: number, total: number) {
		page = current;

		// convert current and total to numbers
		current = Number(current);
		total = Number(total);
		let start = Math.max(1, current - 1);
		let end = Math.min(total, current + 1);
		let pages:any = [];
		if (end === total) {
			start--;
		} else if (start === 1) {
			// add this condition
			end++;
		}
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}
		// filter out any zeros from the array
		pages = pages.filter((page:any) => page > 0 && page <= total);
		return pages;
	}
</script>

<nav aria-label="Page navigation example">
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<ul class="inline-flex items-center -space-x-px h-8">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<li on:click={() => handleClick(page - 1)} class="h-full cursor-pointer">
			<a
				 style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
				class="flex justify-center items-center h-full px-3 py-2 ml-0 leading-tight border border-gray-300 rounded-l-lg"
			>
				<IconChevronLeft class="w-5 h-5" />
			</a>
		</li>
		{#each pagesToShow as pageNumber}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li on:click={() => handleClick(pageNumber)} class="h-full">
				<!-- svelte-ignore a11y-missing-attribute -->
				{#if page === pageNumber}
					<a
							 style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
						aria-current="page"
						class="flex justify-center items-center h-full z-10 px-3 py-2 leading-tight border border-gray-300 font-bold hover:no-underline"
						>{pageNumber}</a
					>
				{:else}
					<a 
  	            style="color:{$currentMainThemeColors.overlayBackgroundColor};"
						aria-current="page"
						class="flex justify-center font-light hover:cursor-pointer items-center h-full z-10 px-3 py-2 leading-tight border border-gray-300"
						>{pageNumber}</a
					>
				{/if}
			</li>
		{/each}

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<li
			on:click={() => {
				if (page < total) {
					handleClick(page + 1);
				}
			}}
			class="h-full cursor-pointer"
		>
			<a
				 style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
				class="flex justify-center items-center h-full px-3 py-2 ml-0 leading-tight border border-gray-300 rounded-r-lg"
			>
				<IconChevronRight class="w-5 h-5" />
			</a>
		</li>
	</ul>
</nav>

<style>
	li {
		margin: 0px !important;
	}
</style>
