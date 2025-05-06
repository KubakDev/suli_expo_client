<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../utils/constants';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import { stringToEnum } from '../../../utils/enumToString';
	import { videoStore } from '../../../stores/videoStore';
	import { getNameRegex } from '../../../utils/urlRegexName';
	import { page } from '$app/stores';
	import { UiStore } from '../../../stores/ui/Ui';
	import { getPageType } from '../../../utils/pageType';
	import type { UiModel } from '../../../models/uiModel';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import { themeToggle, videoCurrentThemeColors } from '../../../stores/darkMode';
	import { ascStore } from '../../../stores/ascStore';
	import OrderFilter from '$lib/components/OrderFilter.svelte';
	import { Spinner } from 'flowbite-svelte';
	import type { Locales } from '$lib/i18n/i18n-types';

	export let data: any;
	let CardComponent: any;
	let asc = ascStore;
	let thumbnailUrl: string[] = [];
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

	const youtubeRegex =
		/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

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
			videoStore.get($locale as Locales, data.supabase, $page.params.page, undefined, $asc);
		}
	}

	$: if ($videoStore?.data) {
		thumbnailChanging();
	}

	onMount(async () => {
		// Set initial parameters BEFORE any requests
		currentParameters = {
			page: $page.params.page,
			locale: $locale,
			asc: $asc
		};
		
		// Initial UI setup
		let pageType = getNameRegex($page.url.pathname);
		let videoUi = (await UiStore.get(data.supabase, getPageType(pageType))) as UiModel;
		let cardType =
			videoUi?.component_type?.type?.charAt(0).toUpperCase() +
			videoUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;
		
		// Single explicit initial request
		requestCounter++;
		console.log(`Initial API request #${requestCounter} - Page: ${$page.params.page}, Locale: ${$locale}, Asc: ${$asc}`);
		await videoStore.get($locale as Locales, data.supabase, $page.params.page, undefined, $asc);
		
		thumbnailChanging();
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

	function thumbnailChanging() {
		if ($videoStore?.data) {
			thumbnailUrl = $videoStore.data.map((item) => {
				return `https://img.youtube.com/vi/${getYouTubeId(item?.link ?? '')}/hqdefault.jpg`;
			});
		}
	}

	// Navigate to newsDetail page
	function DetailsPage(itemId: number) {
		goto(`/video/detail/${itemId}`);
	}

	function changePage(page: number) {
		console.log(`Pagination changed to page: ${page}`);
		
		// Set navigating flag to prevent duplicate requests
		isNavigating = true;
		
		// Navigate to the new page
		goto(`/video/${page}`);
		
		// Reset the flag after navigation is complete
		// This timeout gives the router time to complete the navigation
		navigationTimeout = setTimeout(() => {
			isNavigating = false;
		}, 100);
	}
	
	// get the YouTube ID from the URL
	function getYouTubeId(url: string): string | null {
		const match = youtubeRegex.exec(url);
		return match ? match[1] : null;
	}
</script>

<section class="py-12 {Constants.page_max_width} mx-auto flex-1 w-full h-full">
	<div
		class="flex justify-center items-center mb-12"
		in:fade={{ duration: 800 }}
		out:fade={{ duration: 400 }}
	>
		<TitleUi
			text={$LL.videos()}
			borderColor={$videoCurrentThemeColors.primaryColor}
			textColor={$videoCurrentThemeColors.overlayBackgroundColor}
		/>
	</div>
	
	<!-- Add filters grid similar to exhibition page -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6" dir={$locale === 'ckb' || $locale === 'ar' ? 'rtl' : 'ltr'}>
		<OrderFilter pageType="video" isLoading={isLoading} />
	</div>

	{#if isLoading}
		<div class="flex justify-center items-center h-64">
			<Spinner color="primary" size="12" class="text-videoLightPrimaryColor dark:text-videoDarkPrimaryColor" />
		</div>
	{:else if $videoStore}
		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $videoStore.data as item, index}
				{#if CardComponent}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={() => DetailsPage(item.id ?? 1)}>
						<ExpoCard
							primaryColor={$videoCurrentThemeColors.secondaryColor}
							overlayPrimaryColor={$videoCurrentThemeColors.overlaySecondaryColor}
							cardType={CardComponent || CardType.Main}
							title={item.title}
							thumbnail={thumbnailUrl[index] ?? ''}
						/>
					</div>
				{/if}
			{/each}
		</div>
		<div dir="ltr" class="flex justify-center my-10">
			{#if $videoStore.count > 9}
				<PaginationComponent
					total={$videoStore.pages}
					page={parseInt($page.params.page)}
					on:changePage={(value) => changePage(value.detail.page)}
				/>
			{/if}
		</div>
	{/if}

	<!-- <MailTemplate /> -->
</section>
