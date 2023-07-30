<script lang="ts">
	import { onMount } from 'svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { exhibitionStore } from '../../../stores/exhibtionStore.js';
	import Constants from '../../../utils/constants.js';
	import { fly, fade } from 'svelte/transition';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import constants from '../../../utils/constants.js';
	import LL, { locale } from '$lib/i18n/i18n-svelte.js';
	import { goto } from '$app/navigation';
	import { getNameRegex } from '../../../utils/urlRegexName.js';
	import { page } from '$app/stores';
	import { UiStore } from '../../../stores/ui/Ui.js';
	import { getPageType } from '../../../utils/pageType.js';
	import type { UiModel } from '../../../models/uiModel.js';
	import { stringToEnum } from '../../../utils/enumToString.js';
	import type { ExhibitionPaginatedModel } from '../../../models/exhibitionModel.js';
	import { CardPlaceholder, Spinner } from 'flowbite-svelte';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import { ArrowDown, ArrowUp } from 'svelte-heros-v2';

	export let data: any;
	let CardComponent: any;
	let asc: boolean = false;
	let exhibitions: ExhibitionPaginatedModel;

	$: {
		if ($locale) {
			getExhibitions();
		}
	}

	onMount(async () => {
		let pageType = getNameRegex($page.url.pathname);
		let exhibitionUi = (await UiStore.get(data.supabase,getPageType(pageType))) as UiModel;
		let cardType =
			exhibitionUi?.component_type?.type?.charAt(0).toUpperCase() + exhibitionUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;
		getExhibitions();
	});

	function openExhibition(id: number) {
		goto(`/exhibition/detail/${id}`);
	}

	function changePage(page: number) {
		goto(`/exhibition/${page}`);
	}

	async function getExhibitions() {
		exhibitions = await exhibitionStore.getPaginated($locale, data?.supabase, $page.params.page, undefined, asc) as ExhibitionPaginatedModel;
	}

	async function changeOrder() {
		asc = !asc;
		getExhibitions();
	}
</script>

<svelte:head>
	<title>Exhibition</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

{#if exhibitions && exhibitions.data && exhibitions.data.length > 0}
<section class="py-12 {Constants.page_max_width} mx-auto w-full">
	<div class="flex justify-between items-center mb-12 w-full">
		<div class="p-2 text-center w-full">
			{#if asc}
				<button
					on:click={changeOrder}
					class="flex flex-row items-center justify-center p-2 rounded-full bg-newsPrimaryColor"
				>
					<ArrowUp
						size="30"
						class="transition-all hover:animate-pulse text-newsBackgroundColor"
					/>

					<span
						class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1 text-newsOverlayPrimaryColor"
						>Old - New</span
					>
				</button>
			{:else}
				<button
					on:click={changeOrder}
					class="flex flex-row items-center justify-center p-2 rounded-full bg-newsPrimaryColor"
				>
					<ArrowDown
						size="30"
						class="transition-all hover:animate-pulse text-newsBackgroundColor"
					/>
					<span
						class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1 text-newsBackgroundColor"
						>New - Old</span
					>
				</button>
			{/if}
		</div>
		<div
			in:fade={{ duration: 800 }}
			out:fade={{ duration: 400 }}
			class="flex justify-center w-full px-2"
		>
			<TitleUi text={$LL.exhibition()} />
		</div>
		<div class="justify-end flex z-10 w-full"></div>
	</div>

	<div
		class="grid grid-cols-1 lg:grid-cols-2 gap-5 justify-items-center items-center {constants.section_margin_top}"
	>
		{#each exhibitions.data as exhibition, i}
			<button
				class="w-full"
				on:click={() => {
					openExhibition(exhibition.id || 0);
				}}
			>
			{#if CardComponent}
				<ExpoCard
					primaryColor={Constants.page_theme.exhibition.primary ?? Constants.main_theme.primary}
					overlayPrimaryColor={Constants.page_theme.exhibition.overlayPrimary ?? Constants.main_theme.overlayPrimary}
					title={exhibition.title}
					thumbnail={exhibition.thumbnail}
					short_description={exhibition.description}
					startDate={exhibition.start_date}
					endDate={exhibition.end_date}
					cardType={CardComponent || CardType.Simple}
				/>
			{/if}
			</button>
		{/each}
	</div>
	<div dir="ltr" class="flex justify-center my-10">
		{#if exhibitions.count > 10}
			<PaginationComponent
				total={exhibitions.pages}
				page={parseInt($page.params.page)}
				on:changePage={(value) => changePage(value.detail.page)}
			/>
		{/if}
	</div>
</section>

<!-- Sekelaton -->
{:else}
<section class="py-12 {Constants.page_max_width} mx-auto w-full">
	<div
		in:fade={{ duration: 800 }}
		out:fade={{ duration: 400 }}
		class="flex justify-center items-center mb-12"
	>
		<TitleUi text={$LL.exhibition()} />
	</div>
</section>
{/if}
