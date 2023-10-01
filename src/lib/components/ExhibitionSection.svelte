<script lang="ts">
	import TitleUi from './TitleUi.svelte';
	import { goto } from '$app/navigation';
	import type { ExhibitionModel } from '../../models/exhibitionModel';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import constants from '../../utils/constants';
	import { exhibitionSectionStore } from '../../stores/exhibtionSectionStore';
	import SeeAllBtn from './SeeAllBtn.svelte';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import Saos from 'saos';
	import Constants from '../../utils/constants';
	import { onMount } from 'svelte';
	import { UiStore } from '../../stores/ui/Ui';
	import { getPageType } from '../../utils/pageType';
	import type { UiModel } from '../../models/uiModel';
	import { stringToEnum } from '../../utils/enumToString';
	import {
		currentMainThemeColors,
		themeToggle,
		exhibitionCurrentMainThemeColors
	} from '../../stores/darkMode';
	import { getNameRegex } from '../../utils/urlRegexName';
	import { page } from '$app/stores';

	export let exhibitions: ExhibitionModel[];
	export let supabase: any;
	let CardComponent: any;
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
			exhibitionSectionStore.get($locale, supabase);
		}
	}
	console.log('exhibition  ///// ', $exhibitionSectionStore);
	onMount(async () => {
		let pageType = 'Exhibition';
		let exhibitionUi = (await UiStore.get(supabase, getPageType(pageType))) as UiModel;
		let cardType =
			exhibitionUi?.component_type?.type?.charAt(0).toUpperCase() +
			exhibitionUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;

		// Fetch data for exhibitionSectionStore
		if ($locale) {
			exhibitionSectionStore.get($locale, supabase);
		}
	});

	function openAllExibition() {
		goto('/exhibition/1');
	}

	function openExhibition(id: number) {
		goto(`/exhibition/detail/${id}`);
	}
</script>

{#if $exhibitionSectionStore && $exhibitionSectionStore.length > 0}
	<Saos animation="from-bottom {1 * 0.8 + 's'}  cubic-bezier(0.500, 0.5, 0.1, 1) both">
		<section
			class="{constants.section_padding_y} {constants.page_max_width} mx-auto {constants.horizontal_padding}"
		>
			<div class="flex justify-between items-center">
				<div class="h-10 w-32" />
				<div class="">
					<TitleUi
						text={$LL.exhibition()}
						textColor={$exhibitionCurrentMainThemeColors.overlayBackgroundColor}
						borderColor={$exhibitionCurrentMainThemeColors.primaryColor}
					/>
				</div>
				<div class="flex justify-end w-32">
					<SeeAllBtn
						onBtnClick={openAllExibition}
						color={{
							backgroundColor: $exhibitionCurrentMainThemeColors.primaryColor ?? '',
							textColor: $exhibitionCurrentMainThemeColors.overlayPrimaryColor ?? ''
						}}
					/>
				</div>
			</div>
			{#if $exhibitionSectionStore}
				<div
					class="grid grid-cols-1 lg:grid-cols-2 gap-5 justify-items-center items-center {constants.section_margin_top}"
				>
					{#each exhibitions as exhibition, i}
						<button
							class="w-full"
							on:click={() => {
								openExhibition(exhibition.id || 0);
							}}
						>
							<ExpoCard
								imageClass={Constants.image_card_layout}
								primaryColor={$exhibitionCurrentMainThemeColors.secondaryColor ??
									Constants.main_theme.lightPrimary}
								overlayPrimaryColor={$exhibitionCurrentMainThemeColors.overlaySecondaryColor ??
									Constants.main_theme.lightOverlayPrimary}
								title={exhibition.title}
								short_description={exhibition.description}
								thumbnail={exhibition.thumbnail}
								cardType={CardComponent}
								startDate={exhibition.start_date}
								endDate={exhibition.end_date}
							/>
						</button>
					{/each}
				</div>
			{/if}
		</section>
	</Saos>
{/if}

<style>
	@keyframes -global-from-bottom {
		0% {
			transform: translateY(10vw);
			opacity: 1;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
