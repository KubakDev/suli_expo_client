<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import type { NewsModel } from '../../models/newsModel';
	import { getNewsUi } from '../../stores/ui/newsUi';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { ImgSourceEnum } from '../../models/imgSourceEnum';
	import newsUiStore from '../../stores/ui/newsUi';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import logger from '../../utils/logger';
	import { newsStore } from '../../stores/newsStore';
	import Constants from '../../utils/constants';
	export let data;
	export let news: NewsModel[];
	let CardComponent: any;

	$: {
		logger.error('news page invoke');
		if ($locale) {
			logger.error('news page invoke');
			newsStore.get($locale, data.supabase);
		}
	}

	onMount(async () => {
		logger.error('news page invoke onMount');
		getNewsUi(data.supabase).then(async (value) => {
			let card = $newsUiStore?.component?.title;
			logger.error('news page invoke', card);
			import('kubak-svelte-component').then(
				(module) => (CardComponent = module[card as keyof typeof module])
			);
			// console.log(card);
		});
	});

	// Navigate to newsDetail page
	function DetailsPage(itemId: any) {
		goto(`/news/${itemId}`);
		console.log('news :', itemId);
	}
</script>

<section class="py-10 {Constants.page_max_width} m-auto">
	<div class="flex justify-center items-center my-8">
		<div in:fade={{ duration: 800 }}>
			<TitleUi text="News " />
		</div>
	</div>
	{#if $newsStore}
		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $newsStore as item, i}
				{#if CardComponent}
					<div
						on:click={() => DetailsPage(item.id)}
						in:fly={{ y: 200, duration: 500, delay: i * 100 }}
						out:fly={{ y: 200, duration: 200, delay: i * 20 }}
					>
						<svelte:component
							this={CardComponent}
							data={{
								title: item.title,
								thumbnail: item.thumbnail,
								imgSource: ImgSourceEnum.remote
							}}
							imageData={{ thumbnail: item.thumbnail, imgSource: ImgSourceEnum.remote }}
							colors={$newsUiStore.color_palette}
						/>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</section>
