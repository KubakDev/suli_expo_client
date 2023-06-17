<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { page } from '$app/stores';
	import { DetailPage } from 'kubak-svelte-component';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import type { NewsModel } from '../../../models/newsModel';
	import { modelToItemModel } from '../../../models/covertModel';
	import Constants from '../../../utils/constants';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import { newsStore } from '../../../stores/newsStore';

	export let data;
	let news: NewsModel | undefined | null;

	async function getNews() {
		news = await newsStore.getSingle($locale, data.supabase, $page.params.newsId);

		newsStore.get($locale, data.supabase);
		console.log('////test', news);
	}

	onMount(() => {
		getNews();
	});
</script>

<section class="dark:bg-slate-900 dark:text-white text-slate-950">
	{#if news}
		<div class=" items-start flex flex-col 3xl:flex-row justify-around">
			<div class="m-auto w-full 3xl:w-96 4xl:w-142 block h-0 lg:mt-0 mt-5 rounded-lg" />
			<div class="w-full bg-gray-50 {Constants.page_max_width} m-auto flex-1 my-10">
				<DetailPage imagesCarousel={news.imagesCarousel} long_description={news.long_description} />
			</div>
			{#if $newsStore}
				<RecentItems
					title={$LL.news()}
					items={$newsStore.map((news) => modelToItemModel(news))}
					pageType={'news'}
				/>
			{/if}
		</div>
	{/if}
</section>
