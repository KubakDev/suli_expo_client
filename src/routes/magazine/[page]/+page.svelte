<script lang="ts">
	import { onMount } from 'svelte';
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
	import { ArrowDown, ArrowUp } from 'svelte-heros-v2';
	import { fade } from 'svelte/transition';
	import { themeToggle } from '../../../stores/darkMode';
	import Filters from '$lib/components/Filters.svelte';
	import { ascStore } from '../../../stores/ascStore';
	export let data: any;
	let CardComponent: any;
	let asc = ascStore;

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
			magazineStore.get($locale, data.supabase, currentPage, undefined, $asc);
		}
	}

	$:{
		if(asc){
			const currentPage = $page.params.page;
            magazineStore.get($locale, data.supabase, currentPage, undefined, $asc);
		}
	}
	onMount(async function () {
		let pageType = getNameRegex($page.url.pathname);
		let magazineUi = (await UiStore.get(data.supabase, getPageType(pageType))) as UiModel;
		let cardType =
			magazineUi?.component_type?.type?.charAt(0).toUpperCase() +
			magazineUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;

		await magazineStore.get($locale, data.supabase, $page.params.page, undefined, $asc);
	});

	// Navigate to newsDetail page
	function DetailsPage(itemId: any) {
		goto(`/magazine/detail/${itemId}`);
	}

	function changePage(page: number) {
		goto(`/magazine/${page}`);
	}
</script>

<section class="py-12 {Constants.page_max_width} mx-auto flex-1 w-full h-full">
	<div class="flex justify-center items-center mb-12">
		<Filters />
		<div
			in:fade={{ duration: 800 }}
			out:fade={{ duration: 400 }}
			class="flex justify-center w-full px-2"
		>
			<TitleUi text={$LL.magazine()} />
		</div>
		<div class="justify-end flex z-10 w-full" />
	</div>
	{#if $magazineStore}
		<div class="grid justify-around grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
			{#each $magazineStore.data as item, i}
				<!-- {#if CardComponent} -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div on:click={() => DetailsPage(item.id)}>
					{#if CardComponent}
						<ExpoCard
							primaryColor={`var(--${tailVar}PrimaryColor)` ??
								Constants.main_theme.lightPrimary}
							overlayPrimaryColor={`var(--${tailVar}OverlayPrimaryColor)` ??
								Constants.main_theme.lightOverlayPrimary}
							imageClass={Constants.image_card_layout}
							cardType={CardComponent || CardType.Main}
							title={item.title}
							date={item.created_at}
							thumbnail={item.thumbnail}
						/>
					{/if}
				</div>
				<!-- {/if} -->
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
