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
	import { publishingCurrentThemeColors } from '../../../../stores/darkMode';
	import { Spinner } from 'flowbite-svelte';

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
	style="background-color: {$publishingCurrentThemeColors.secondaryColor}; color: {$publishingCurrentThemeColors.overlaySecondaryColor}"
	class=" {Constants.page_max_width} mx-auto w-full"
>
	{#if publishing}
		<div
			class="grid 3xl:grid-cols-3 grid-cols-2 my-2 rounded-lg justify-center items-center content-center w-full"
		>
			<div class="flex-1 my-10 mt-auto col-span-2 w-full h-full z-0">
				<DetailPage
					long_description={publishing.long_description}
					imagesCarousel={publishing.imagesCarousel}
				/>
			</div>
			{#if $publishingStore?.data}
				<div class="3xl:col-span-1 p-2 col-span-2 ml-1 w-full h-full">
					<RecentItems
						title={$LL.publishing()}
						items={$publishingStore.data.map((publishing) => modelToItemModel(publishing))}
						pageType={'publishing'}
					/>
				</div>
			{/if}
		</div>
	{:else}
		<div class="w-full min-h-screen flex justify-center items-center">
			<Spinner />
		</div>
	{/if}
</section>
