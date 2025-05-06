<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import { UiStore } from '../../../stores/ui/Ui';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../utils/constants';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import { stringToEnum } from '../../../utils/enumToString';
	import { galleryStore } from '../../../stores/galleryStore';
	import { getNameRegex } from '../../../utils/urlRegexName';
	import { page } from '$app/stores';
	import { getPageType } from '../../../utils/pageType';
	import type { UiModel } from '../../../models/uiModel';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import { ascStore } from '../../../stores/ascStore';
	import { galleryCurrentThemeColors, themeToggle } from '../../../stores/darkMode';
	import OrderFilter from '$lib/components/OrderFilter.svelte';
	import { Spinner } from 'flowbite-svelte';

	export let data: any;
	let CardComponent: any;
	let asc = ascStore;
	let isLoading = true;

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

	// Consolidated reactive block that watches both locale and asc
	$: if ($locale && $page.params.page) {
		const currentPage = $page.params.page;
		galleryStore.get($locale, data.supabase, currentPage, undefined, $asc);
	}

	onMount(async () => {
		isLoading = true;
		let pageType = getNameRegex($page.url.pathname);

		let galleryUi = (await UiStore.get(data.supabase, getPageType(pageType))) as UiModel;
		let cardType =
			galleryUi?.component_type?.type?.charAt(0).toUpperCase() +
			galleryUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;

		await galleryStore.get($locale, data.supabase, $page.params.page, undefined, $asc);
		isLoading = false;
	});

	// Navigate to newsDetail page
	function DetailsPage(itemId: any) {
		goto(`/gallery/detail/${itemId}`);
	}

	function changePage(page: number) {
		goto(`/gallery/${page}`);
	}
</script>

<section class="py-12 {Constants.page_max_width} mx-auto flex-1 w-full h-full">
	<div
		class="flex justify-center items-center mb-12"
		in:fade={{ duration: 800 }}
		out:fade={{ duration: 400 }}
	>
		<TitleUi
			text={$LL.gallery()}
			borderColor={$galleryCurrentThemeColors.primaryColor}
			textColor={$galleryCurrentThemeColors.overlayBackgroundColor}
		/>
	</div>
	
	<!-- Add filters grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6" dir="ltr">
		<OrderFilter pageType="gallery" isLoading={isLoading} />
	</div>

	{#if isLoading}
		<div class="flex justify-center items-center h-64">
			<Spinner color="primary" size="12" class="text-galleryLightPrimaryColor dark:text-galleryDarkPrimaryColor" />
		</div>
	{:else if $galleryStore}
		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $galleryStore.data as item, i}
				{#if CardComponent}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={() => DetailsPage(item.id)}>
						<ExpoCard
							primaryColor={$galleryCurrentThemeColors.secondaryColor}
							overlayPrimaryColor={$galleryCurrentThemeColors.overlaySecondaryColor}
							imageClass={Constants.image_card_layout}
							cardType={CardComponent}
							title={item.title}
							thumbnail={item.thumbnail}
						/>
					</div>
				{/if}
			{/each}
		</div>
		<div dir="ltr" class="flex justify-center my-10">
			{#if $galleryStore.count > 9}
				<PaginationComponent
					total={$galleryStore.pages}
					page={parseInt($page.params.page)}
					on:changePage={(value) => changePage(value.detail.page)}
				/>
			{/if}
		</div>
	{/if}
</section>
