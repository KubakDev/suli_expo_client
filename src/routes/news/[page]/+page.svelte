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
	import { ArrowDown, ArrowUp } from 'svelte-heros-v2';
	import { exhibitionStore } from '../../../stores/exhibtionStore';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import type { UiModel } from '../../../models/uiModel';
	import { UiStore } from '../../../stores/ui/Ui';
	import { getNameRegex } from '../../../utils/urlRegexName';
	import { getPageType } from '../../../utils/pageType';
	import { themeToggle } from '../../../stores/darkMode';
	import DateRangePicker from 'svelte-daterangepicker/dist/components/DatePicker.svelte';
	import { Button, Checkbox, Chevron, Dropdown, Label } from 'flowbite-svelte';
	import NewsFilters from '$lib/components/NewsFilters.svelte';

	export let data;
	let CardComponent: any;

	let asc: boolean = false;
	let selectedExhibition: number[];

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
			const currentPage = $page.params.page;
			newsStore.get($locale, data.supabase, currentPage, undefined, asc, selectedExhibition);

			exhibitionStore.get($locale, data.supabase);
		}
	}

	onMount(async () => {
		exhibitionStore.get($locale, data.supabase);
		let pageType = getNameRegex($page.url.pathname);
		let newsUi = (await UiStore.get(data.supabase, getPageType(pageType))) as UiModel;
		let cardType =
			newsUi?.component_type?.type?.charAt(0).toUpperCase() +
			newsUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;

		newsStore.get($locale, data.supabase, $page.params.page, undefined, asc, selectedExhibition);
	});
	// onDestroy(() => {
	// 	activeThemeStore.reAddColors();
	// });
	function changePage(page: number) {
		goto(`/news/${page}`);
	}
</script>

<section class=" py-12 {Constants.page_max_width} w-full mx-auto" id="newsSection">
	{#if $newsStore}
		<div class="flex justify-between items-center mb-12 w-full">
			<div class="justify-end flex z-10 w-full" />
			<div class="flex justify-center w-full px-2">
				<TitleUi text={$LL.news()} />
			</div>
			<div class="justify-end flex z-10 w-full" />
		</div>
		<NewsFilters supabase={data.supabase} page={$page.params.page} selectedExhibition={selectedExhibition} exhibitionData={$exhibitionStore} />
		
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
							primaryColor={`var(--${tailVar}PrimaryColor)` ?? Constants.main_theme.lightPrimary}
							overlayPrimaryColor={`var(--${tailVar}OverlayPrimaryColor)` ??
								Constants.main_theme.lightOverlayPrimary}
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

<style>
	:root {
		--dateSelectWidth: 135px;
		--date-input-width: 100%;
		--date-picker-highlight-border: 1px solid #000;
		--date-picker-selected-color: #000;
	}
</style>
