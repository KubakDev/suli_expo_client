<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { modelToItemModel } from '../../../models/covertModel';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import { exhibitionStore } from '../../../stores/exhibtionStore';
	import type { ExhibitionModel } from '../../../models/exhibitionModel';

	export let data;
	let exhibition: ExhibitionModel | undefined | null;

	async function getExhibition() {
		exhibition = await exhibitionStore.getSingle($locale, data.supabase, $page.params.exhibitionId);
		console.log(exhibition);
		exhibitionStore.get(data.supabase);
	}

	onMount(() => {
		getExhibition();
	});
</script>

<section class="dark:bg-slate-900 dark:text-white text-slate-950">
	{#if exhibition}
		<div class=" items-start flex flex-col 3xl:flex-row justify-around">
			<div class="m-auto w-full 3xl:w-96 4xl:w-142 block h-0 lg:mt-0 mt-5 rounded-lg" />
			<!-- <div class="w-full bg-gray-50 {Constants.page_max_width} m-auto flex-1 my-10">
				<DetailPage imagesCarousel={exhibition.imagesCarousel} long_description={exhibition.long_description} />
			</div> -->
			{#if $exhibitionStore}
				<RecentItems
					title={$LL.news()}
					items={$exhibitionStore.map((news) => modelToItemModel(news))}
					pageType={'news'}
				/>
			{/if}
		</div>
	{/if}
</section>
