<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { getNewsUi } from '../../../stores/ui/newsUi';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import newsUiStore from '../../../stores/ui/newsUi';
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../utils/constants';
	import { stringToEnum } from '../../../utils/enumToString';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import { page } from '$app/stores';
	import DateRangePicker from '$lib/components/dateRangePicker.svelte';
	import { newsStore } from '../../../stores/newsStore';
	import { activeThemeStore } from '../../../stores/ui/theme';

	export let data;
	let CardComponent: any;

	$: {
		if ($locale) {
			const currentPage = $page.params.page;
			newsStore.get($locale, data.supabase, currentPage, 9);
		}
	}

	onMount(async () => {
		await getNewsUi(data.supabase).then(async (value) => {
			CardComponent = stringToEnum($newsUiStore?.component.title!, CardType);
		});
	});
	onDestroy(() => {
		activeThemeStore.reAddColors();
	});
	function changePage(page: number) {
		goto(`/news/${page}`);
	}
</script>

<section class=" py-12 {Constants.page_max_width} mx-auto" id="newsSection">
	{#if $newsStore}
		<div class="flex justify-center items-start mb-12">
			<DateRangePicker />

			<div>
				<TitleUi text={$LL.news()} />
			</div>
		</div>

		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $newsStore.data as item, i}
				<a href="/news/detail/{item.id}" class="a-tag">
					<ExpoCard
						imageClass={Constants.image_card_layout}
						cardType={$newsUiStore?.component_type.type ?? CardType.Main}
						title={item.title}
						thumbnail={item.thumbnail}
						date={item.news_date || '01-01-2000'}
						short_description={item.short_description}
					/>
				</a>
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
