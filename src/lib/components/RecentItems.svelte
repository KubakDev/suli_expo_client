<script lang="ts">
	import { goto } from '$app/navigation';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import Constants from '../../utils/constants';
	import type { ItemModel } from '../../models/covertModel';

	export let title: string;
	export let pageType: string;
	export let items: ItemModel[];

	interface $$props extends HTMLAnchorAttributes {
		title: string;
		thumbnail: string;
		short_description?: string;
		pageType: string;
	}

	//  //('test ', newsSection);

	function DetailsPage(itemId: number) {
		//  //(itemId);
		goto(`/${pageType}/detail/${itemId}`);
	}
</script>

<div
	class="flex flex-col justify-start mb-10 lg:mt-10 mt-5 rounded-lg {Constants.page_max_width} mx-auto max-h-[46.55vh] overflow-auto {Constants.scrollbar_layout} "
>
	<h1 class="text-2xl py-8 font-bold text-start">{title}</h1>
	{#each items as item}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="  flex py-3 md:flex-row flex-col items-start cursor-pointer bg-opacity-20 hover:bg-slate-400 dark:bg-opacity-40 rounded-xl transition-all" on:click={() => DetailsPage(item.id)}>
			<div class=" lg:w-2/4 md:w-1/2 w-full mb-4 md:mb-0 h-60 3xl:h-36 p-2">
				<img class="object-cover w-full h-full rounded-lg" alt="hero" src={`${item.thumbnail}`} />
			</div>
			<div
				class="lg:flex-grow lg:w-3/4 md:w-1/2 lg:px-5 md:pl-4 flex flex-col md:items-start md:text-left items-center text-start"
			>
				<h1 class="title-font text-base mb-2 font-bold tracking-wider text-start ">{item.title}</h1>
				<p class="leading-relaxed">
					{item.short_description?.slice(0, 80)}
				</p>
			</div>
		</div>
	{/each}
</div>
