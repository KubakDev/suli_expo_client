<script lang="ts">
	import { onMount } from 'svelte';
	import TitleUi from '../TitleUi.svelte';
	import { goto } from '$app/navigation';
	import constants from '../../../utils/constants';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { newsSectionStore } from '../../../stores/newsSectionStore';
	import NewsSectionShimmer from './NewsSectionShimmer.svelte';
	import SeeAllBtn from '../SeeAllBtn.svelte';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import { stringToEnum } from '../../../utils/enumToString';
	import Saos from '$lib/animate/Saos.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import Constants from '../../../utils/constants';
	import { getNameRegex } from '../../../utils/urlRegexName';
	import { page } from '$app/stores';
	import { UiStore } from '../../../stores/ui/Ui';
	import { getPageType } from '../../../utils/pageType';
	import type { UiModel } from '../../../models/uiModel';
	import { themeToggle } from '../../../stores/darkMode';

	export let supabase: SupabaseClient;
	let CardComponent: any;
	export let exhibitionId:string = "";
	const routeRegex = /\/(news|exhibition|gallery|magazine|publishing|video)/;
	let tailVar: string = 'light';

	$: {
		if (routeRegex.test($page.url.pathname)) {
			let pageName = getNameRegex($page.url.pathname);
			tailVar = $themeToggle === "light" ? pageName + 'Light' : pageName + 'Dark';
		} else {
			tailVar = $themeToggle === "light" ? 'light' : 'dark';
		}
	}

	$: {
		if ($locale) {
			newsSectionStore.get($locale, supabase, exhibitionId);
		}
	}

	onMount(async () => {
		newsSectionStore.get($locale, supabase, exhibitionId);
		let pageType = "News";
		let newsUi = (await UiStore.get(supabase,getPageType(pageType))) as UiModel;
		let cardType = newsUi?.component_type?.type?.charAt(0).toUpperCase() + newsUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType);

		if ($locale) {
			newsSectionStore.get($locale, supabase, exhibitionId);
		}
	});

	function openNews() {
		goto('/news/1');
	}

	function DetailsPage(itemId: any) {
		goto(`/news/detail/${itemId}`);
	}
</script>

{#if $newsSectionStore && $newsSectionStore.length > 0}
	<section class="w-full {Constants.page_max_width} mx-auto py-12 px-4 md:px-0}">
		<div class="flex justify-between items-center">
			<div class="h-10 w-32" />
			<div class="">
				<TitleUi text={$LL.news()} />
			</div>
			<div class="flex justify-end w-32">
				<SeeAllBtn onBtnClick={openNews} />
			</div>
		</div>
		{#if $newsSectionStore.length === 0}
			<div class="flex justify-center items-center">
				<p class="text-white dark:text-white text-center">
					{$LL.no_news()}
				</p>
			</div>
		{:else}
			<div
				class="grid grid-cols-1 md:grid-cols-3 gap-5 justify-items-center items-center {constants.section_margin_top}"
			>
				{#each $newsSectionStore as n, i}
					<button on:click={() => DetailsPage(n.id)} class="w-full a-tag">
						<Saos
							animation="from-bottom {(i + 1) * 0.8 + 's'}  cubic-bezier(0.500, 0.5, 0.1, 1) both"
						>
						<!-- {#if CardComponent} -->
							<ExpoCard
								primaryColor={`var(--news${tailVar === "light" ? "Light" : "Dark"}PrimaryColor)` ?? Constants.main_theme.lightPrimary}
								overlayPrimaryColor={`var(--news${tailVar === "light" ? "Light" : "Dark"}OverlayPrimaryColor)` ?? Constants.main_theme.lightOverlayPrimary}
								imageClass={Constants.image_card_layout}
								cardType={CardComponent || CardType.Main}
								title={n.title}
								short_description={n.short_description}
								thumbnail={n.thumbnail}
								date={n.created_at}
							/>
						<!-- {/if} -->
						</Saos>
					</button>
					<!-- {:else}
						<div />
					{/if} -->
				{/each}
			</div>
		{/if}
	</section>
{:else}
	<NewsSectionShimmer />
{/if}

<style>
	@keyframes -global-from-bottom {
		0% {
			transform: translateY(50px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
