<script lang="ts">
	import { onMount } from 'svelte';
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
	import { ArrowDown, ArrowUp } from 'svelte-heros-v2';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import { themeToggle, videoCurrentThemeColors } from '../../../stores/darkMode';
	import { ascStore } from '../../../stores/ascStore';
	import Filters from '$lib/components/Filters.svelte';

	export let data: any;
	let CardComponent: any;
	let asc = ascStore;
	let thumbnailUrl: string[];
	let isLoading = true;

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

	$: {
		if ($locale) {
			const currentPage = $page.params.page;
			videoStore.get($locale, data.supabase, currentPage, undefined, $asc);
			thumbnailChanging();
		}
	}

	$: {
		if (asc) {
			const currentPage = $page.params.page;
			videoStore.get($locale, data.supabase, currentPage, undefined, $asc);
			thumbnailChanging();
		}
	}

	$: {
		if ($videoStore?.data) {
			thumbnailChanging();
		}
	}

	onMount(async () => {
		videoStore.get($locale, data.supabase, $page.params.page, undefined, $asc);

		let pageType = getNameRegex($page.url.pathname);
		let videoUi = (await UiStore.get(data.supabase, getPageType(pageType))) as UiModel;
		let cardType =
			videoUi?.component_type?.type?.charAt(0).toUpperCase() +
			videoUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;

		thumbnailChanging();
		isLoading = false;
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
		//('news :', itemId);
	}

	function changePage(page: number) {
		goto(`/video/${page}`);
	}
	// get the YouTube ID from the URL
	function getYouTubeId(url: string): string | null {
		const match = youtubeRegex.exec(url);

		return match ? match[1] : null;
	}
</script>

<section class="py-12 {Constants.page_max_width} mx-auto flex-1 w-full h-full">
	<div class="flex justify-center items-center mb-12">
		<Filters />
		<div
			class="flex justify-center w-full px-2"
			in:fade={{ duration: 800 }}
			out:fade={{ duration: 400 }}
		>
			<TitleUi text={$LL.videos()} />
		</div>
		<div class="justify-end flex z-10 w-full" />
	</div>
	{#if $videoStore}
		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $videoStore.data as item, index}
				{#if CardComponent && !isLoading}
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
