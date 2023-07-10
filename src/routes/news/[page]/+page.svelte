<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import type { NewsModel } from '../../../models/newsModel';
	import { getNewsUi } from '../../../stores/ui/newsUi';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { ImgSourceEnum } from '../../../models/imgSourceEnum';
	import newsUiStore from '../../../stores/ui/newsUi';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { newsStore } from '../../../stores/newsStore';
	import Constants from '../../../utils/constants';
	import { stringToEnum } from '../../../utils/enumToString';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	let date = new Date();

	import { page } from '$app/stores';
	import DateRangePicker from '$lib/components/dateRangePicker.svelte';

	export let data;
	let CardComponent: any;

	$: {
		if ($locale) {
			const currentPage = $page.params.page;
			newsStore.get($locale, data.supabase, currentPage, 9);
		}
	}
	let selected;

	onMount(async () => {
		getNewsUi(data.supabase).then(async (value) => {
			CardComponent = stringToEnum($newsUiStore?.component.title!, CardType);
		});
	});

	function changePage(page: number) {
		goto(`/news/${page}`);
	}
</script>

<section class="py-12 {Constants.page_max_width} mx-auto">
	{#if $newsStore}
		<div class="flex justify-center items-start mb-12">
			<DateRangePicker />

			<div>
				<TitleUi text="News " customClass=" dark:text-white text-secondary " />
			</div>
		</div>

		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $newsStore.data as item, i}
				{#if CardComponent}
					<a href="/news/detail/{item.id}" class="a-tag">
						<ExpoCard
							cardType={CardType.Main}
							title={item.title}
							short_description={item.short_description}
							thumbnail={item.thumbnail}
							date={item.news_date}
							primaryColor={CardComponent.primaryColor}
						/>
					</a>
				{/if}
			{/each}
		</div>

		<div dir="ltr" class="flex justify-center my-10">
			{#if $newsStore.count > 9}
			<PaginationComponent
				total={$newsStore.count}
				page={parseInt($page.params.page)}
				on:changePage={(value) => changePage(value.detail.page)}
			/>
			{/if}
		</div>
	{/if}
</section>
