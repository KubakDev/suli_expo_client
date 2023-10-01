<script lang="ts">
	import { goto } from '$app/navigation';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import Constants from '../../utils/constants';
	import type { ItemModel } from '../../models/covertModel';
	import { getNameRegex } from '../../utils/urlRegexName';
	import { page } from '$app/stores';
	import { currentMainThemeColors } from '../../stores/darkMode';

	export let title: string;
	export let pageType: string;
	export let items: ItemModel[];
	export let youtubeThumbnail: string[] = [];

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
	class="flex flex-col justify-start mb-10 lg:mt-10 mt-5 rounded-lg {Constants.page_max_width} mx-auto"
>
	<h1 class="text-2xl py-4 font-bold text-center">Recent {title}</h1>
	{#each items as item, index}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			onmouseover="this.style.backgroundColor='{$currentMainThemeColors.primaryColor}'; this.style.color='{$currentMainThemeColors.overlayPrimaryColor}';"
			onmouseout="this.style.backgroundColor=''; this.style.color='';"
			class="flex md:flex-row flex-col items-start cursor-pointer bg-opacity-20 dark:bg-opacity-40 rounded-xl transition-all"
			on:click={() => DetailsPage(item.id)}
		>
			<div class="lg:w-2/4 md:w-1/2 w-full mb-4 md:mb-0 h-60 3xl:h-36 p-2">
				<img
					class="object-cover w-full h-full rounded-lg"
					alt="hero"
					src={item.thumbnail ?? youtubeThumbnail[index]}
				/>
			</div>
			<div
				class="text-{getNameRegex(
					$page.url.pathname
				)}SecondaryColor lg:flex-grow lg:w-3/4 md:w-1/2 lg:px-5 md:pl-4 flex flex-col md:items-start md:text-left items-center text-start mt-2"
			>
				{#if item.title.length > 19}
					<h1 class="title-font text-base mb-2 font-bold tracking-wider text-start">
						{item.title.slice(0, 20)}...
					</h1>
				{:else}
					<h1 class="title-font text-base mb-2 font-bold tracking-wider text-start">
						{item.title}
					</h1>
				{/if}

				{#if (item.short_description ?? '').length > 79}
					<p class="leading-relaxed text-justify text-sm">
						{item.short_description?.slice(0, 80)}...
					</p>
				{:else}
					<p class="leading-relaxed text-justify text-sm">
						{item.short_description}
					</p>
				{/if}
			</div>
		</div>
	{/each}
</div>
