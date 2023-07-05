<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { page } from '$app/stores';
	import { DetailPage } from 'kubak-svelte-component';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../utils/constants';
	import type { GalleryModel } from '../../../models/galleryModel';
	import { galleryStore } from '../../../stores/galleryStore';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import { modelToItemModel } from '../../../models/covertModel';

	export let data;
	let gallery: GalleryModel | undefined | null;

	async function getGallery() {
		gallery = await galleryStore.getSingle($locale, data.supabase, $page.params.galleryId);
		galleryStore.get($locale, data.supabase);
		//(news);
		//(news.images);
	}

	onMount(() => {
		getGallery();
	});
</script>

<section class="dark:bg-slate-900 dark:text-white text-slate-950 flex-1 relative">
	{#if gallery}
		<div class=" items-start flex flex-col 3xl:flex-row justify-around">
			<div class="m-auto w-full 3xl:w-96 4xl:w-142 block h-0 lg:mt-0 mt-5 rounded-lg" />
			<div class="w-full bg-gray-50 {Constants.page_max_width} m-auto flex-1 my-10">
				<DetailPage
					imagesCarousel={gallery.imagesCarousel}
					long_description={gallery.long_description}
				/>
			</div>

			{#if $galleryStore}
				<RecentItems
					title={$LL.gallery()}
					items={$galleryStore.map((gallery) => modelToItemModel(gallery))}
					pageType={'gallery'}
				/>
			{/if}
		</div>
	{/if}
</section>
