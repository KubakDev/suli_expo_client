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
	import { themeToggle } from '../../../stores/darkMode';
	export let data: any;
	let CardComponent: any;
	let asc: boolean = false;
	let thumbnailUrl: string[];

	const youtubeRegex =
		/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

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
			videoStore.get($locale, data.supabase, currentPage, undefined, asc);
		}
	}

	onMount(async () => {
		let pageType = getNameRegex($page.url.pathname);
		let videoUi = (await UiStore.get(data.supabase, getPageType(pageType))) as UiModel;
		let cardType =
			videoUi?.component_type?.type?.charAt(0).toUpperCase() +
			videoUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;

		await videoStore.get($locale, data.supabase, $page.params.page, undefined, asc);

		if(!$videoStore.data) return;
		thumbnailUrl = $videoStore.data.map((item) => {
			return `https://img.youtube.com/vi/${getYouTubeId(item?.link ?? '')}/hqdefault.jpg`;
		});		
	});

	// Navigate to newsDetail page
	function DetailsPage(itemId: number) {
		goto(`/video/detail/${itemId}`);
		//('news :', itemId);
	}

	function changePage(page: number) {
		goto(`/video/${page}`);
	}

	function changeOrder() {
		asc = !asc;
		videoStore.get($locale, data?.supabase, $page.params.page, undefined, asc);
	}

	// get the YouTube ID from the URL
	function getYouTubeId(url:string): string | null {
		const match = youtubeRegex.exec(url);

		console.log('match', match);

		return match ? match[1] : null;
	}
</script>

<section class="py-12 {Constants.page_max_width} mx-auto flex-1 w-full h-full">
	<div class="flex justify-center items-center mb-12">
		<div class="p-2 text-center w-full">
			{#if asc}
				<button
					on:click={changeOrder}
					class="flex flex-row items-center justify-center p-2 rounded-full bg-videoLightPrimaryColor dark:bg-videoDarkPrimaryColor"
				>
					<ArrowUp size="30" class="transition-all hover:animate-pulse text-videoLightBackgroundColor dark:text-videoDarkBackgroundColor" />

					<span
						class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1 text-videoLightBackgroundColor dark:text-videoDarkBackgroundColor"
						>Old - New</span
					>
				</button>
			{:else}
				<button
					on:click={changeOrder}
					class="flex flex-row items-center justify-center p-2 rounded-full bg-videoLightPrimaryColor dark:bg-videoDarkPrimaryColor"
				>
					<ArrowDown
						size="30"
						class="transition-all hover:animate-pulse text-videoLightBackgroundColor dark:text-videoDarkBackgroundColor"
					/>
					<span
						class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1 text-videoLightBackgroundColor dark:text-videoDarkBackgroundColor"
						>New - Old</span
					>
				</button>
			{/if}
		</div>
		<div
			class="flex justify-center w-full px-2"
			in:fade={{ duration: 800 }}
			out:fade={{ duration: 400 }}
		>
			<TitleUi text={$LL.videos()} />
		</div>
		<div class="justify-end flex z-10 w-full" />
	</div>
	{#if $videoStore && thumbnailUrl}
		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $videoStore.data as item, index}
				{#if CardComponent}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={() => DetailsPage(item.id ?? 1)}>
						<ExpoCard
							primaryColor={`var(--${tailVar}PrimaryColor)` ?? Constants.main_theme.lightPrimary}
							overlayPrimaryColor={`var(--${tailVar}OverlayPrimaryColor)` ??
								Constants.main_theme.lightOverlayPrimary}
							cardType={CardComponent || CardType.Main}
							title={item.title}
							thumbnail={item?.thumbnail ??
								thumbnailUrl[index] ?? ""}
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
</section>
