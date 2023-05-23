<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { newsSectionStore } from '../../../stores/newsSectionStore';
	import { derived, get } from 'svelte/store';
	import { page } from '$app/stores';
	import newsUiStore, { getNewsUi } from '../../../stores/ui/newsUi';
	import { NewsDetail } from 'kubak-svelte-component';
	import { onMount } from 'svelte';
	import { ImgSourceEnum } from '../../../models/imgSourceEnum';
	import RecentNews from '$lib/components/RecentNews.svelte';

	let news = {
		title: '',
		long_description: '',
		news_languages: [{}],
		images: [
			{
				imgurl: '',
				id: 0
			}
		]
	};

	$: id = $page.params.newsId;
	export let data;
	$: {
		getNews();
		console.log(id);
	}
	async function getNews() {
		const response = await data.supabase
			.from('news')
			.select('*,news_languages(*)')
			.eq('id', id)
			.single();
		console.log(response.data);
		news = response.data;
		news.images = response.data.images.split(',');
		news.images = news.images.map((imgurl: string, index: number) => {
			return {
				imgurl,
				id: index,
				imgSource: ImgSourceEnum.remote
			};
		});
		console.log(news);
	}

	onMount(() => {
		getNews();
	});

	onMount(async () => {
		newsSectionStore.get(data.supabase, 6);
	});
</script>

<section class="dark:bg-slate-900 dark:text-white text-slate-950">
	<div class="px-4 sm:px-5 mx-auto max-w-screen-2xl py-10">
		<div class="grid grid-cols-1 items-start lg:gap-8 lg:grid-cols-3">
			<div class="col-span-2 bg-gray-50">
				<NewsDetail
					long_description={news?.news_languages[0]?.long_description}
					images={news.images}
				/>
			</div>
			<div
				class="col-span-1 lg:mt-0 mt-5 bg-[#3E4248] dark:bg-[#3E4248] dark:bg-opacity-20 rounded-lg border dark:border-gray-700"
			>
				<h1 class="text-2xl py-8 font-bold">Recent News</h1>
				<section class="body-font">
					{#each $newsSectionStore as newsSection}
						<RecentNews {newsSection} />
					{/each}
				</section>
			</div>
		</div>
	</div>
</section>
