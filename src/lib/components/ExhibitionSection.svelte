<script lang="ts">
	import type { NewsModel } from '../../models/newsModel';
	import { ImgSourceEnum } from '../../models/imgSourceEnum';
	import { onMount } from 'svelte';
	import newsUiStore, { getNewsUi } from '../../stores/ui/newsUi';
	import TitleUi from './TitleUi.svelte';
	import { Button } from 'flowbite-svelte';
	import Exhibition from './Exhibition.svelte';
	// import { MainCard } from 'suli/suliexpo-cards/MainCard.svelte';
	import logger from '../../utils/logger';
	import { goto } from '$app/navigation';
	import type { ExhibitionModel } from '../../models/exhibitionModel';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import constants from '../../utils/constants';
	import { fly, fade } from 'svelte/transition';
	import { exhibitionSectionStore } from '../../stores/exhibtionSectionStore';
	import SeeAllBtn from './SeeAllBtn.svelte';

	export let exhibitions: ExhibitionModel[];
	export let supabase: any;

	$: {
		logger.info('locale changed %%%%%%%%%%%%%%%%%%');
		if ($locale) {
			logger.info('locale changed #########', $locale);
			exhibitionSectionStore.get($locale, supabase);
		}
	}

	function openNews() {
		goto('/exhibitions');
	}
</script>

{#if $exhibitionSectionStore && $exhibitionSectionStore.length > 0}
	<section
		class="{constants.section_padding_y} {constants.page_max_width} m-auto {constants.horizontal_padding}"
		in:fly={{ y: 400, duration: 800, delay: 200 }}
		out:fly={{ y: 200, duration: 200, delay: 20 }}
	>
		<div class="flex justify-between items-center">
			<div class="h-10 w-32" />
			<div class="">
				<TitleUi text={$LL.exhibition()} />
			</div>
			<div class="flex justify-end w-32">
				<SeeAllBtn onBtnClick={openNews} />
			</div>
		</div>
		{#if $exhibitionSectionStore}
			<div
				class="grid grid-cols-1 lg:grid-cols-2 gap-5 justify-items-center items-center {constants.section_margin_top}"
			>
				{#each exhibitions as exhibition, i}
					<div>
						<Exhibition {exhibition} />
					</div>
				{/each}
			</div>
		{/if}
	</section>
{:else}
	<section class="{constants.section_padding_y} {constants.page_max_width} m-auto">
		<div class="flex justify-between items-center">
			<div class="h-10 w-32" />
			<div class="">
				<TitleUi text={$LL.exhibition()} />
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
	</section>
{/if}
