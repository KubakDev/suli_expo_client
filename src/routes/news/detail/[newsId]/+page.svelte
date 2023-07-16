<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import type { NewsModel } from '../../../../models/newsModel';
	import { modelToItemModel } from '../../../../models/covertModel';
	import Constants from '../../../../utils/constants';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import { newsStore } from '../../../../stores/newsStore';
	import { Spinner } from 'flowbite-svelte';
	import { DetailPage } from 'kubak-svelte-component';

	export let data;
	let news: NewsModel | undefined | null;

	$: {
		if ($locale) {
			getNews();
		}
	}

	async function getNews() {
		news = await newsStore.getSingle($locale, data.supabase, $page.params.newsId);

		newsStore.get($locale, data.supabase, '1', 5);
	}

	onMount(() => {
		getNews();
	});
</script>

<!-- <section class="dark:bg-slate-900 dark:text-white text-slate-950 flex-1 relative p-2">
	{#if news}
		<div class="items-start flex flex-col 3xl:flex-row justify-around">
			<div class="w-full bg-gray-50 {Constants.page_max_width} m-auto flex-1 my-10">
				<DetailPage imagesCarousel={news.imagesCarousel} long_description={news.long_description} />
			</div>
			{#if $newsStore && $newsStore.data.length > 0}
				<RecentItems
					title={$LL.news()}
					items={$newsStore.data.map((news) => modelToItemModel(news))}
					pageType={'news'}
				/>
			{/if}
		</div>
	{:else}
		<div class="w-full h-full flex flex-1 justify-center items-center absolute">
			<Spinner />
		</div>
	{/if}
</section> -->

<section
	class=" dark:text-white text-slate-950 {Constants.page_max_width} mx-auto w-full "
>
	{#if news}
		<div
			class="grid 3xl:grid-cols-3 grid-cols-2 my-2 rounded-lg justify-center items-center content-center w-full"
		>
			<div class="flex-1 my-10 mt-auto col-span-2 w-full h-full">
				<DetailPage
					customClass="bg-none "
					imagesCarousel={news.imagesCarousel}
					long_description={news.long_description}
				/>
			</div>
			{#if $newsStore && $newsStore.data.length > 0}
				<div class="3xl:col-span-1 p-2 col-span-2 ml-1 w-full">
					<RecentItems
						title={$LL.news()}
						items={$newsStore.data.map((news) => modelToItemModel(news))}
						pageType={'news'}
					/>
				</div>
			{/if}
		</div>
	{:else}
		<div class="w-full h-full flex flex-1 justify-center items-center absolute">
			<Spinner />
		</div>
	{/if}
</section>
