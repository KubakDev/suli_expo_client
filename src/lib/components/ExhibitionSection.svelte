<script lang="ts">
	import TitleUi from './TitleUi.svelte';
	import { goto } from '$app/navigation';
	import type { ExhibitionModel } from '../../models/exhibitionModel';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import constants from '../../utils/constants';
	import { exhibitionSectionStore } from '../../stores/exhibtionSectionStore';
	import SeeAllBtn from './SeeAllBtn.svelte';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import Saos from '$lib/animate/Saos.svelte';
	import Constants from '../../utils/constants';
	import SulyButton from './sulyButton.svelte';

	export let exhibitions: ExhibitionModel[];
	export let supabase: any;

	$: {
		if ($locale) {
			exhibitionSectionStore.get($locale, supabase);
		}
	}

	function openAllExibition() {
		goto('/exhibitions');
	}

	function openExhibition(id: number) {
		goto(`/exhibitions/${id}`);
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
					<TitleUi text={$LL.exhibition()} />
				</div>
				<div class="flex justify-end w-32">
					<SeeAllBtn onBtnClick={openAllExibition} />
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
								primaryColor={'var(--exhibitionPrimaryColor)'}
								overlayPrimaryColor={'var(--exhibitionOverlayPrimaryColor)'}
								title={exhibition.title}
								short_description={exhibition.description}
								thumbnail={exhibition.thumbnail}
								cardType={CardType.Main}
								startDate={exhibition.start_date}
								endDate={exhibition.end_date}
							/>
						</button>
					{/each}
				</div>
			{/if}
		</section>
	</Saos>
	<!-- {:else}
	<section
		class="{constants.section_padding_y} {constants.page_max_width} m-auto {constants.horizontal_padding}"
	>
		<div class="flex justify-between items-center">
			<div class="h-10 w-32" />
			<div class="">
				<TitleUi text={$LL.exhibition()} customClass=" dark:text-white text-secondary " />
			</div>
			<Button color="primary" class="w-32 rounded-md bg-primary text-black">See all</Button>
		</div>
		<div
			class="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center items-center {constants.section_margin_top}"
		>
			{#each [1, 2] as n, i}
				<div
					class=" bg-gray-300 rounded-md animate-pulse flex-1 min-w-10 max-w-128 overflow-hidden h-128"
				>
					<div class="h-40 bg-gray-400 rounded-t-md w-128" />
				</div>
			{/each}
		</div>
	</section> -->
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
