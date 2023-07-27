<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Constants from '../../utils/constants';

	// event

	export let page = 1;
	export let total: number; // remove this line

	const dispatch = createEventDispatcher();
	function handleClick(page: number) {
		if (page < 1 || page > total) return; // use $newsStore.pages here
		dispatch('changePage', { page: page });
	}

	// computed variable
	$: pagesToShow = getPagesToShow(page, total); // use $newsStore.pages here

	// helper function
	function getPagesToShow(current: number, total: number) {
		page = current;
		console.log('current', total);
		console.log('total', page);

		// convert current and total to numbers
		current = Number(current);
		total = Number(total);
		let start = Math.max(1, current - 1);
		let end = Math.min(total, current + 1);
		let pages = [];
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
		pages = pages.filter((page) => page > 0 && page <= total);
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
				class="flex justify-center text-overlaySecondaryColor bg-overlayBackgroundColor items-center h-full px-3 py-2 ml-0 leading-tight border border-gray-300 rounded-l-lg hover:bg-transparentSecondaryColor"
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
		{#each pagesToShow as pageNumber}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li on:click={() => handleClick(pageNumber)} class="h-full">
				<!-- svelte-ignore a11y-missing-attribute -->
				{#if page === pageNumber}
					<a
						aria-current="page"
						class="flex justify-center items-center h-full z-10 px-3 py-2 leading-tight border border-gray-300 bg-transparentSecondaryColor text-overlaySecondaryColor font-bold hover:no-underline "
						>{pageNumber}</a
					>
				{:else}
					<a
						aria-current="page"
						class="flex justify-center font-light hover:cursor-pointer items-center h-full z-10 px-3 py-2 leading-tight border border-gray-300 bg-transparentOverlayPrimaryColor text-secondaryColor hover:text-overlaySecondaryColor hover:no-underline hover:bg-transparentSecondaryColor"
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
				class="flex justify-center text-overlaySecondaryColor bg-overlayBackgroundColor items-center h-full px-3 py-2 ml-0 leading-tight border border-gray-300 rounded-r-lg hover:bg-transparentSecondaryColor"
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
