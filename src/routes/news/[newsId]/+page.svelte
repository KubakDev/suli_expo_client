<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { newsSectionStore } from '../../../stores/newsSectionStore';
	import { page } from '$app/stores';
	import { NewsDetail } from 'kubak-svelte-component';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import type { NewsModel } from '../../../models/newsModel';
	import { convertModel } from '../../../models/covertModel';
	import RecentNews from '$lib/components/RecentNews.svelte';
	import Constants from '../../../utils/constants';

	export let data;
	let news: NewsModel | undefined | null;

	async function getNews() {
		let response = await data.supabase
			.from('news')
			.select('*,languages:news_languages(*)')
			.eq('languages.language', $locale)
			.eq('id', $page.params.newsId)
			.single();
		news = convertModel<NewsModel>(response.data, true) as NewsModel;
		console.log(news);
		console.log(news.images);
	}

	onMount(() => {
		getNews();
	});

	onMount(async () => {
		newsSectionStore.get($locale, data.supabase);
	});
</script>

<section class="dark:bg-slate-900 dark:text-white text-slate-950">
	{#if news}
		<div class=" items-start flex flex-col 3xl:flex-row justify-around">
			<div class="m-auto w-full 3xl:w-96 4xl:w-142 block h-0 lg:mt-0 mt-5 rounded-lg" />
			<div class="w-full bg-gray-50 {Constants.page_max_width} m-auto flex-1 my-10">
				<NewsDetail {news} />
			</div>
			<div
				class="flex flex-col justify-start m-auto mb-10 lg:mt-10 mt-5 rounded-lg w-full 3xl:w-96 4xl:w-142"
			>
				<h1 class="text-2xl py-8 font-bold text-start">{$LL.resentNews()}</h1>
				{#if $newsSectionStore}
					<section class="body-font">
						{#each $newsSectionStore as newsSection}
							<RecentNews {newsSection} />
						{/each}
					</section>
				{/if}
			</div>
		</div>
	{/if}
</section>
