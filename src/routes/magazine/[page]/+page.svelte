<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { UiStore } from '../../../stores/ui/Ui';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../utils/constants';
	import { stringToEnum } from '../../../utils/enumToString';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import { magazineStore } from '../../../stores/magazineStore';
	import { getNameRegex } from '../../../utils/urlRegexName';
	import { page } from '$app/stores';
	import { getPageType } from '../../../utils/pageType';
	import type { UiModel } from '../../../models/uiModel';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import { fade } from 'svelte/transition';
	import { themeToggle, magazineCurrentThemeColors } from '../../../stores/darkMode';
	import { ascStore } from '../../../stores/ascStore';
	import OrderFilter from '$lib/components/OrderFilter.svelte';
	import { Spinner } from 'flowbite-svelte';
	import type { Locales } from '$lib/i18n/i18n-types';

	export let data: any;
	let CardComponent: any;
	let asc = ascStore;
	let isLoading = true;
	let requestCounter = 0; // Counter to track number of API requests
	let isNavigating = false; // Flag to prevent duplicate requests during navigation
	let isInitializing = true; // Flag to prevent reactive statement firing during initialization
	let navigationTimeout: ReturnType<typeof setTimeout> | null = null;
	
	// Keep track of the request parameters to avoid duplicate fetches
	let currentParameters = {
		page: '',
		locale: '',
		asc: false
	};

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

	// Single reactive statement to handle all fetch trigger cases
	$: if ($locale && $page.params.page && !isNavigating && !isInitializing) {
		// Only fetch if parameters have changed
		if (
			$page.params.page !== currentParameters.page ||
			$locale !== currentParameters.locale ||
			$asc !== currentParameters.asc
		) {
			requestCounter++;
			console.log(`API request #${requestCounter} - Page: ${$page.params.page}, Locale: ${$locale}, Asc: ${$asc}`);
			
			// Update current parameters BEFORE making the request
			currentParameters = {
				page: $page.params.page,
				locale: $locale,
				asc: $asc
			};
			
			// Make the request
			magazineStore.get($locale as Locales, data.supabase, $page.params.page, undefined, $asc);
		}
	}
	
	onMount(async function () {
		isLoading = true;
		
		// Set initial parameters BEFORE any requests
		currentParameters = {
			page: $page.params.page,
			locale: $locale,
			asc: $asc
		};
		
		// Initial UI setup
		let pageType = getNameRegex($page.url.pathname);
		let magazineUi = (await UiStore.get(data.supabase, getPageType(pageType))) as UiModel;
		let cardType =
			magazineUi?.component_type?.type?.charAt(0).toUpperCase() +
			magazineUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;

		// Single explicit initial request
		requestCounter++;
		console.log(`Initial API request #${requestCounter} - Page: ${$page.params.page}, Locale: ${$locale}, Asc: ${$asc}`);
		await magazineStore.get($locale as Locales, data.supabase, $page.params.page, undefined, $asc);
		
		isLoading = false;
		
		// Allow reactive statements to work for subsequent changes
		setTimeout(() => {
			isInitializing = false;
		}, 100);
	});
	
	onDestroy(() => {
		// Clean up timeout if component is destroyed
		if (navigationTimeout) {
			clearTimeout(navigationTimeout);
		}
	});

	// Navigate to newsDetail page
	function DetailsPage(itemId: any) {
		goto(`/magazine/detail/${itemId}`);
	}

	function changePage(page: number) {
		console.log(`Pagination changed to page: ${page}`);
		
		// Set navigating flag to prevent duplicate requests
		isNavigating = true;
		
		// Navigate to the new page
		goto(`/magazine/${page}`);
		
		// Reset the flag after navigation is complete
		// This timeout gives the router time to complete the navigation
		navigationTimeout = setTimeout(() => {
			isNavigating = false;
		}, 100);
	}
</script>

<section class="py-12 {Constants.page_max_width} mx-auto flex-1 w-full h-full">
	<div
		class="flex justify-center items-center mb-12"
		in:fade={{ duration: 800 }}
		out:fade={{ duration: 400 }}
	>
		<TitleUi
			text={$LL.magazine()}
			borderColor={$magazineCurrentThemeColors.primaryColor}
			textColor={$magazineCurrentThemeColors.overlayBackgroundColor}
		/>
	</div>
	
	<!-- Add filters grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6" dir={$locale === 'ckb' || $locale === 'ar' ? 'rtl' : 'ltr'}>
		<OrderFilter pageType="magazine" isLoading={isLoading} />
	</div>

	{#if isLoading}
		<div class="flex justify-center items-center h-64">
			<Spinner color="primary" size="12" class="text-magazineLightPrimaryColor dark:text-magazineDarkPrimaryColor" />
		</div>
	{:else if $magazineStore}
		<div class="grid justify-around grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
			{#each $magazineStore.data as item, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div on:click={() => DetailsPage(item.id)}>
					{#if CardComponent}
						<ExpoCard
							primaryColor={$magazineCurrentThemeColors.secondaryColor}
							overlayPrimaryColor={$magazineCurrentThemeColors.overlaySecondaryColor}
							imageClass={Constants.image_card_layout}
							cardType={CardComponent || CardType.Main}
							title={item.title}
							date={item.created_at}
							thumbnail={item.thumbnail}
						/>
					{/if}
				</div>
			{/each}
		</div>
		<div dir="ltr" class="flex justify-center my-10">
			{#if $magazineStore.count > 9}
				<PaginationComponent
					total={$magazineStore.pages}
					page={parseInt($page.params.page)}
					on:changePage={(value) => changePage(value.detail.page)}
				/>
			{/if}
		</div>
	{/if}
</section>
