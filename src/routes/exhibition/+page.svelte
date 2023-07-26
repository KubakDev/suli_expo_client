<script lang="ts">
	import { onMount } from 'svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { exhibitionStore } from '../../stores/exhibtionStore.js';
	import Constants from '../../utils/constants.js';
	import { fly, fade } from 'svelte/transition';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import constants from '../../utils/constants.js';
	import LL, { locale } from '$lib/i18n/i18n-svelte.js';
	import { goto } from '$app/navigation';
	import { getNameRegex } from '../../utils/urlRegexName.js';
	import { page } from '$app/stores';
	import { UiStore } from '../../stores/ui/Ui.js';
	import { getPageType } from '../../utils/pageType.js';
	import type { UiModel } from '../../models/uiModel.js';
	import { stringToEnum } from '../../utils/enumToString.js';

	export let data;
	let CardComponent: any;

	$: {
		if ($locale) {
			exhibitionStore.get($locale, data?.supabase);
		}
	}

	onMount(async () => {
		let pageType = getNameRegex($page.url.pathname);
		let exhibitionUi = (await UiStore.get(data.supabase,getPageType(pageType))) as UiModel;
		let cardType =
			exhibitionUi?.component_type?.type?.charAt(0).toUpperCase() + exhibitionUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;
	});

	function openExhibition(id: number) {
		goto(`/exhibition/${id}`);
	}
</script>

<svelte:head>
	<title>Exhibition</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="py-12 {Constants.page_max_width} mx-auto w-full">
	<div
		in:fade={{ duration: 800 }}
		out:fade={{ duration: 400 }}
		class="flex justify-center items-center mb-12"
	>
		<TitleUi text={$LL.exhibition()} />
	</div>

	<div
		class="grid grid-cols-1 lg:grid-cols-2 gap-5 justify-items-center items-center {constants.section_margin_top}"
	>
		{#each $exhibitionStore as exhibition, i}
			<button
				class="w-full"
				on:click={() => {
					openExhibition(exhibition.id || 0);
				}}
			>
			{#if CardComponent}
				<ExpoCard
					imageClass={Constants.image_card_layout}
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
</section>
