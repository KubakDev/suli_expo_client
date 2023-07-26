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
		Input,
		Label,
		Modal,
		Toggle
	} from 'flowbite-svelte';
	import { exhibitionStore } from '../../../stores/exhibtionStore';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import type { UiModel } from '../../../models/uiModel';
	import { UiStore } from '../../../stores/ui/Ui';
	import { getNameRegex } from '../../../utils/urlRegexName';
	import { getPageType } from '../../../utils/pageType';
	import { DateInput } from 'date-picker-svelte';

	export let data;
	let CardComponent: any;

	let asc: boolean = false;
	let selectedExhibition: number[];
	let startDate: Date;
	let endDate: Date = new Date();

	$: {
		if ($locale || asc) {
			const currentPage = $page.params.page;
			newsStore.get($locale, data.supabase, currentPage, undefined, asc);

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

		console.log('CardComponent ', CardComponent);

		newsStore.get($locale, data.supabase, $page.params.page, undefined, asc);
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

	const filterByDate = function () {
		console.log('Dates ', startDate, endDate);
		newsStore.get(
			$locale,
			data.supabase,
			$page.params.page,
			undefined,
			asc,
			selectedExhibition,
			startDate.toISOString(),
			endDate.toISOString()
		);
	};
</script>

<section class=" py-12 {Constants.page_max_width} w-full mx-auto" id="newsSection">
	{#if $newsStore}
		<div class="flex justify-between items-center mb-12 w-full">
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
							.overlayPrimary ?? Constants.main_theme.overlayPrimary}; marg"
						><Chevron>{$LL.filter()}</Chevron></Button
					>
					<Dropdown
						class="w-80 p-3 space-y-3 text-sm bg-[{Constants.page_theme.news.overlayPrimary ??
							Constants.main_theme.overlayPrimary}]"
					>
						<div class="max-h-48 overflow-y-auto {Constants.scrollbar_layout}">
							<Label class="space-y-2">Filter By Exhibition</Label>
							{#each $exhibitionStore as exhibition}
								<li>
									<Checkbox
										on:change={filterByExhibition}
										bind:group={selectedExhibition}
										value={exhibition.id}
										class="border-b border-solid border-gray-300 w-full flex justify-between p-1"
										>{exhibition.title}</Checkbox
									>
								</li>
							{/each}
						</div>
						<Label class="space-y-2">Filter By Date</Label>
						<DropdownItem class="text-base text-center font-bold ">
							<Label class="space-y-2">
								<span>Start Date</span>
								<DateInput
									min={new Date('01-01-2010')}
									max={endDate}
									format="dd-MM-yyyy"
									bind:value={startDate}
								/>
							</Label>
							<Label class="space-y-2">
								<span>End Date</span>
								<DateInput
									min={startDate}
									max={new Date()}
									format="dd-MM-yyyy"
									bind:value={endDate}
								/>
							</Label>
							<Button class="mt-2" on:click={filterByDate}>Search</Button>
						</DropdownItem>
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
							primaryColor={'var(--newsPrimaryColor)'}
							overlayPrimaryColor={Constants.page_theme.news.overlayPrimary ??
								Constants.main_theme.overlayPrimary}
							imageClass={Constants.image_card_layout}
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
