<script lang="ts">
	import type { NewsModel } from '../../../models/newsModel';
	import { ImgSourceEnum } from '../../../models/imgSourceEnum';
	import { onMount } from 'svelte';
	import newsUiStore, { getNewsUi } from '../../../stores/ui/newsUi';
	import TitleUi from '../TitleUi.svelte';
	import { Button } from 'flowbite-svelte';
	// import { MainCard } from 'suli/suliexpo-cards/MainCard.svelte';
	import logger from '../../../utils/logger';
	import { goto } from '$app/navigation';
	import constants from '../../../utils/constants';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { newsSectionStore } from '../../../stores/newsSectionStore';
	import NewsSectionShimmer from './NewsSectionShimmer.svelte';

	export let supabase: any;
	let CardComponent: any;

	$: {
		logger.info('locale changed %%%%%%%%%%%%%%%%%%');
		if ($locale) {
			logger.info('locale changed #########', $locale);
			newsSectionStore.get($locale, supabase);
		}
	}

	onMount(async () => {
		getNewsUi(supabase).then(async (value) => {
			let card = $newsUiStore?.component?.title;
			import('kubak-svelte-component').then(
				(module) => (CardComponent = module[card as keyof typeof module])
			);
			// console.log(card);
		});
	});

	function openNews() {
		goto('/news');
	}
</script>

{#if $newsSectionStore && $newsSectionStore.length > 0}
	<section class="{constants.section_padding_y} {constants.page_max_width} m-auto">
		<div class="flex justify-between items-center">
			<div class="h-10 w-32" />
			<div class="">
				<TitleUi textColorDark="text-white" textColorLight="text-white" text={$LL.news()} />
			</div>
			<Button on:click={openNews} color="primary" class="w-32 rounded-md bg-primary text-black"
				>{$LL.seeAll()}</Button
			>
		</div>
		<div
			class="grid grid-cols-1 md:grid-cols-3 gap-5 justify-items-center items-center {constants.section_margin_top}"
		>
			{#each $newsSectionStore as n, i}
				{#if CardComponent}
					<svelte:component
						this={CardComponent}
						data={{
							title: n.title,
							thumbnail: n.thumbnail,
							imgSource: ImgSourceEnum.remote,
							short_description: n.short_description
						}}
						colors={$newsUiStore.color_palette}
					/>
				{:else}
					<div />
				{/if}
			{/each}
		</div>
	</section>
{:else}
	<NewsSectionShimmer />
{/if}
