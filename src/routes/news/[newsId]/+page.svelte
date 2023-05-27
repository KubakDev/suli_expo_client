<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { newsSectionStore } from '../../../stores/newsSectionStore';
	import { page } from '$app/stores';
	import { NewsDetail } from 'kubak-svelte-component';
	import { onMount } from 'svelte';
	import RecentNews from '$lib/components/RecentNews.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import type { NewsModel } from '../../../models/newsModel';
	import { convertModel } from '../../../models/covertModel';

	export let data;
	let news: NewsModel | undefined | null;
	$: id = $page.params.newsId;

	$: {
		getNews();
		console.log(id);
	}
	async function getNews() {
		let response = await data.supabase
			.from('news')
			.select('*,languages:news_languages(*)')
			.eq('languages.language', $locale)
			.eq('id', id)
			.single();
		news = convertModel<NewsModel>(response.data) as NewsModel;
		console.log(news);
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
		<div class="px-4 sm:px-5 mx-auto max-w-screen-2xl py-10">
			<div class="grid grid-cols-1 items-start lg:gap-8 lg:grid-cols-3">
				<div class="col-span-2 bg-gray-50">
					<NewsDetail {news} />
				</div>
				<div
					class="col-span-1 lg:mt-0 mt-5 bg-[#3E4248] dark:bg-[#3E4248] dark:bg-opacity-20 rounded-lg border dark:border-gray-700"
				>
					<h1 class="text-2xl py-8 font-bold">Recent News</h1>
					<!-- <section class="body-font">
						{#each $newsSectionStore as newsSection}
							<RecentNews {newsSection} />
						{/each}
					</section> -->
				</div>
			</div>
		</div>
	{/if}
</section>
