<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { page } from '$app/stores';
	import { DetailPage } from 'kubak-svelte-component';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../../utils/constants';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import type { PublishingModel } from '../../../../models/publishingModel';
	import { publishingStore } from '../../../../stores/publishingStore';
	import { modelToItemModel } from '../../../../models/covertModel';

	export let data: any;
	let publishing: PublishingModel | undefined | null;

	async function getPublishing() {
		publishing = await publishingStore.getSingle($locale, data.supabase, $page.params.publishingId);
		publishingStore.get($locale, data.supabase, '1', 5);
	}

	onMount(() => {
		getPublishing();
	});
</script>

<section
	class="dark:bg-slate-900 dark:text-white text-slate-950 {Constants.page_max_width} mx-auto w-full"
>
	{#if publishing}
		<div
			class="grid 3xl:grid-cols-3 grid-cols-2 mx-4 my-2 rounded-lg justify-center items-center content-center"
		>
			<div class="flex-1 my-10 mt-auto col-span-2 w-full h-full justify-start items-start">
				<DetailPage
					long_description={publishing.long_description}
					imagesCarousel={publishing.imagesCarousel}
				/>
			</div>
			{#if $publishingStore}
				<RecentItems
					title={$LL.publishing()}
					items={$publishingStore.data.map((publishing) => modelToItemModel(publishing))}
					pageType={'publishing'}
				/>
			{/if}
		</div>
	{/if}
</section>
