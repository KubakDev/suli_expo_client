<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../utils/constants';
	import { stringToEnum } from '../../../utils/enumToString';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import { page } from '$app/stores';
	import { newsStore } from '../../../stores/newsStore';
	import { exhibitionStore } from '../../../stores/exhibtionStore';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import type { UiModel } from '../../../models/uiModel';
	import { UiStore } from '../../../stores/ui/Ui';
	import { getNameRegex } from '../../../utils/urlRegexName';
	import { getPageType } from '../../../utils/pageType';
	import { newsCurrentThemeColors, themeToggle } from '../../../stores/darkMode';
	import NewsFilters from '$lib/components/NewsFilters.svelte';
	import { incrementNewsViewer, viewAdded_news } from '../../../stores/viewersStore';
	import { Spinner } from 'flowbite-svelte';

	export let data;
	let CardComponent: any;
	let isLoading = true;

	let asc: boolean = false;
	let selectedExhibition: string[] = [];


	const routeRegex = /\/(news|exhibition|gallery|magazine|publishing|video)/;
	let tailVar: string = 'light';

	$: {
		if (routeRegex.test($page.url.pathname)) {
			let pageName = getNameRegex($page.url.pathname);
			tailVar = $themeToggle === 'light' ? pageName + 'Light' : pageName + 'Dark';
		} else {
			tailVar = $themeToggle === 'light' ? 'light' : 'dark';
		}
	}

	$: {
		if ($locale || asc) {
			isLoading = true;
			const currentPage = $page.params.page;
			newsStore.get($locale, data.supabase, currentPage, undefined, asc, selectedExhibition)
				.then(() => {
					isLoading = false;
				});

			exhibitionStore.get($locale, data.supabase);
		}
	}

	$: isLoading = !$newsStore || isLoading;

	onMount(async () => {
		isLoading = true;
		exhibitionStore.get($locale, data.supabase);
		let pageType = getNameRegex($page.url.pathname);
		let newsUi = (await UiStore.get(data.supabase, getPageType(pageType))) as UiModel;
		let cardType =
			newsUi?.component_type?.type?.charAt(0).toUpperCase() +
			newsUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;

		newsStore.get($locale, data.supabase, $page.params.page, undefined, asc, selectedExhibition)
			.then(() => {
				isLoading = false;
			});
	});
 
	function changePage(page: number) {
		isLoading = true;
		goto(`/news/${page}`);
	}

	// count viewers
	onMount(() => {
		 if (!$viewAdded_news) {
			incrementNewsViewer(data.supabase);
		}
	});
</script>

<div class="w-full" style=" background-color: {$newsCurrentThemeColors.backgroundColor};">
	<section class=" py-12 {Constants.page_max_width} w-full mx-auto" id="newsSection">
		<div class="flex justify-between items-center mb-12 w-full">
			<div class="justify-end flex z-10 w-full" />
			<div class="flex justify-center w-full px-2">
				<TitleUi
					text={$LL.news()}
					borderColor={$newsCurrentThemeColors.primaryColor}
					textColor={$newsCurrentThemeColors.overlayBackgroundColor}
				/> 
			</div>
			<div class="justify-end flex z-10 w-full" />
		</div>
		<NewsFilters
			supabase={data.supabase}
			page={$page.params.page}
			bind:selectedExhibition
			exhibitionData={$exhibitionStore}
		/> 

		{#if isLoading}
			<div class="flex justify-center items-center h-64">
				<Spinner color="primary" size="12" class="text-newsLightPrimaryColor dark:text-newsDarkPrimaryColor" />
			</div>
		{:else if $newsStore && $newsStore.data}
			<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each $newsStore.data as item, i}
					<button
						on:click={() => {
							goto(`/news/detail/${item.id}`);
						}}
						class="no-underline"
					>
						{#if CardComponent}
							<ExpoCard
								primaryColor={$newsCurrentThemeColors.secondaryColor}
								overlayPrimaryColor={$newsCurrentThemeColors.overlaySecondaryColor}
								cardType={CardComponent ?? CardType.Flat}
								title={item.title}
								thumbnail={item.thumbnail}
								date={item.created_at ?? new Date()}
								short_description={item.short_description}
							/>
						{/if}
					</button>
				{/each}
			</div>

			<div dir="ltr" class="flex justify-center my-10">
				{#if $newsStore.count > 9}
					<PaginationComponent
						total={$newsStore.pages}
						page={parseInt($page.params.page)}
						on:changePage={(value) => changePage(value.detail.page)}
					/>
				{/if}
			</div>
		{/if}
	</section>
</div>

<style>
	:root {
		--dateSelectWidth: 135px;
		--date-input-width: 100%;
		--date-picker-highlight-border: 1px solid #000;
		--date-picker-selected-color: #000;
	}
</style>
