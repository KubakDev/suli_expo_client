<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../../utils/constants';
	import type { GalleryModel } from '../../../../models/galleryModel';
	import { galleryStore } from '../../../../stores/galleryStore';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import { modelToItemModel } from '../../../../models/covertModel';
	import { galleryCurrentThemeColors } from '../../../../stores/darkMode';
	import { Spinner } from 'flowbite-svelte';
	import ImageCarousel from '$lib/components/ImageCarousel.svelte';

	export let data: any;
	let gallery: GalleryModel | undefined | null;

	$: {
		if ($locale) {
			getGallery();
		}
	}

	async function getGallery() {
		gallery = await galleryStore.getSingle($locale, data.supabase, $page.params.galleryId);
		galleryStore.get($locale, data.supabase, '1', 5);
	}

	onMount(() => {
		getGallery();
	});
</script>

<section class="w-full">
	<div class="{Constants.page_max_width} mx-auto">
		{#if gallery}
			<div
				class="grid 3xl:grid-cols-3 xl:grid-cols-3 grid-cols-1 my-2 rounded-lg justify-center items-start content-center w-full gap-6 px-4 py-8"
			>
				<div class="flex-1 xl:col-span-2 col-span-1 w-full h-full z-0 xl:mt-10">
					<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
						{#if gallery.imagesCarousel && gallery.imagesCarousel.length > 0}
							<ImageCarousel 
								images={gallery.imagesCarousel}
								height="600px"
								showThumbs={true}
								autoplay={true}
								effect="fade"
								zoom={true}
							/>
						{/if}
						<div class="p-6" style="background-color: {$galleryCurrentThemeColors.secondaryColor}; color: {$galleryCurrentThemeColors.overlaySecondaryColor}">
							<div class="mt-4 prose max-w-none dark:prose-invert">
								{@html gallery.long_description}
							</div>
						</div>
					</div>
				</div>
				{#if $galleryStore?.data}
					<div class="xl:col-span-1 col-span-1 xl:p-2 w-full h-full xl:mt-10">
						<div class="sticky top-4 w-full">
							<RecentItems
								title={$LL.gallery()}
								items={$galleryStore?.data.map((gallery) => modelToItemModel(gallery))}
								pageType={'gallery'}
							/>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<div class="w-full min-h-screen flex justify-center items-center">
				<Spinner size="12" />
			</div>
		{/if}
	</div>
</section>

