<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { page } from '$app/stores';
	import { DetailPage } from 'kubak-svelte-component';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../utils/constants';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import type { PublishingModel } from '../../../models/publishingModel';
	import { publishingStore } from '../../../stores/publishingStore';
	import { modelToItemModel } from '../../../models/covertModel';

	export let data;
	let publishing: PublishingModel | undefined | null;

	async function getPublishing() {
		publishing = await publishingStore.getSingle($locale, data.supabase, $page.params.publishingId);
		publishingStore.get($locale, data.supabase);
	}

	onMount(() => {
		getPublishing();
	});
</script>

<section class="dark:bg-slate-900 dark:text-white text-slate-950">
	{#if publishing}
		<div class=" items-start flex flex-col 3xl:flex-row justify-around">
			<div class="m-auto w-full 3xl:w-96 4xl:w-142 block h-0 lg:mt-0 mt-5 rounded-lg" />
			<div class="w-full bg-gray-50 {Constants.page_max_width} m-auto flex-1 my-10">
				<DetailPage
					long_description={publishing.long_description}
					imagesCarousel={publishing.imagesCarousel}
				/>
			</div>
			{#if $publishingStore}
				<RecentItems
					title={$LL.publishing()}
					items={$publishingStore.map((publishing) => modelToItemModel(publishing))}
					pageType={'publishing'}
				/>
			{/if}
		</div>
	{/if}
</section>
