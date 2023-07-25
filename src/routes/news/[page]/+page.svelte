<script lang="ts">
	//@ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../utils/constants';
	import { stringToEnum } from '../../../utils/enumToString';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import { page } from '$app/stores';
	import { newsStore } from '../../../stores/newsStore';
	import { activeThemeStore } from '../../../stores/ui/theme';
	import { AcademicCap, ArrowDown, ArrowUp, ArrowsUpDown } from 'svelte-heros-v2';
	import {
		Avatar,
		Button,
		Checkbox,
		Chevron,
		Dropdown,
		DropdownItem,
		Toggle
	} from 'flowbite-svelte';
	import { exhibitionStore } from '../../../stores/exhibtionStore';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import type { UiModel } from '../../../models/uiModel';
	import { UiStore } from '../../../stores/ui/Ui';
	import { getNameRegex } from '../../../utils/urlRegexName';
	import { getPageType } from '../../../utils/pageType';
	import moment from 'moment';
	import { CollapsibleCard } from 'svelte-collapsible';
	import { DateInput } from 'date-picker-svelte';

	export let data;
	let CardComponent: any;

	let asc: boolean = false;
	let selectedExhibition: number[];
	let years: string[] = [];
	let startDate: Date;
	let expiryDate: Date;

	$: {
		if ($locale || asc) {
			const currentPage = $page.params.page;
			newsStore.get($locale, data.supabase, currentPage, undefined, asc);
		}
	}

	onMount(async () => {
		exhibitionStore.get($locale, data.supabase);
		let pageType = getNameRegex($page.url.pathname);
		let newsUi = (await UiStore.get(data.supabase, getPageType(pageType))) as UiModel;
		let cardType =
			newsUi.component_type.type.charAt(0).toUpperCase() + newsUi.component_type.type.slice(1);
		CardComponent = stringToEnum(cardType, CardType);

		newsStore.get($locale, data.supabase, $page.params.page, undefined, asc);

		years = [...new Set($newsStore.data.map((news) => moment(news.news_date).format('YYYY')))];
	});
	onDestroy(() => {
		activeThemeStore.reAddColors();
	});
	function changePage(page: number) {
		goto(`/news/${page}`);
	}
	async function changeOrder() {
		asc = !asc;
		newsStore.get($locale, data.supabase, $page.params.page, undefined, asc);
	}
	async function filterByExhibition() {
		newsStore.get($locale, data.supabase, $page.params.page, undefined, asc, selectedExhibition);
	}
</script>

<section class=" py-12 {Constants.page_max_width} w-full mx-auto" id="newsSection">
	{#if $newsStore}
		<div class="flex justify-between items-center mb-12 w-full">
			<div class="flex justify-start z-10">
				<CollapsibleCard open={false} duration={0.3} easing="ease-in-out">
					<div slot="header">
						<!-- <LottiePlayer
								src="../../../lottie/Calender Animation 2.json"
								autoplay={true}
								loop={true}
								height={100}
								width={100}
							/> -->
						<Avatar src="../../../icons/calendar-icon.png" rounded />
					</div>
					<div slot="body" class="w-full z-10" >
						<DateInput format="dd-MM-yyyy" bind:value={startDate} />
					</div>
				</CollapsibleCard>
			</div>
			<div class="p-2 text-center w-full">
				{#if asc}
					<button
						on:click={changeOrder}
						class="flex flex-row items-center justify-center p-2 rounded-full"
						style="background-color: {Constants.page_theme.news.primary ??
							Constants.main_theme.primary};"
					>
						<ArrowUp
							size="30"
							class="transition-all hover:animate-pulse"
							style="color:{Constants.page_theme.news.background ??
								Constants.main_theme.background} ;"
						/>
						<span
							class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1"
							style="color:{Constants.page_theme.news.overlayPrimary ??
								Constants.main_theme.overlayPrimary} ;">Old - New</span
						>
					</button>
				{:else}
					<button
						on:click={changeOrder}
						class="flex flex-row items-center justify-center p-2 rounded-full"
						style="background-color: {Constants.page_theme.news.primary ??
							Constants.main_theme.primary};"
					>
						<ArrowDown
							size="30"
							class="transition-all hover:animate-pulse"
							style="color:{Constants.page_theme.news.background ??
								Constants.main_theme.background} ;"
						/>
						<span
							class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1"
							style="color: {Constants.page_theme.news.background ??
								Constants.main_theme.background};">New - Old</span
						>
					</button>
				{/if}
			</div>
			<div class="flex justify-center w-full px-2">
				<TitleUi text={$LL.news()} />
			</div>

			{#if $exhibitionStore.length > 0}
				<div class="justify-end flex z-10 w-full">
					<Button
						class="text-xs sm:text-[16px]"
						style="background-color: {Constants.page_theme.news.primary ??
							Constants.main_theme.overlayPrimary}; color: {Constants.page_theme.news
							.overlayPrimary ?? Constants.main_theme.overlayPrimary}"
						><Chevron>Filter By Exhibition</Chevron></Button
					>
					<Dropdown
						class="w-44 p-3 space-y-3 text-sm bg-[{Constants.page_theme.news.overlayPrimary ??
							Constants.main_theme
								.overlayPrimary}] max-h-32 overflow-y-auto {Constants.scrollbar_layout}"
					>
						{#each $exhibitionStore as exhibition}
							<li>
								<Checkbox bind:group={selectedExhibition} value={exhibition.id}
									>{exhibition.title}</Checkbox
								>
							</li>
						{/each}
						<DropdownItem
							slot="footer"
							class="text-base text-center font-bold "
							on:click={filterByExhibition}>Search</DropdownItem
						>
					</Dropdown>
				</div>
			{/if}
		</div>

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
							primaryColor={Constants.page_theme.news.primary ?? Constants.main_theme.primary}
							overlayPrimaryColor={Constants.page_theme.news.overlayPrimary ??
								Constants.main_theme.overlayPrimary}
							imageClass={Constants.image_card_layout}
							cardType={CardComponent || CardType.Flat}
							title={item.title}
							thumbnail={item.thumbnail}
							date={item.news_date ?? new Date()}
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
	}
	:card-header {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
	}
</style>
