<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { page } from '$app/stores';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import {
		Button,
		Dropdown,
		DropdownDivider,
		Spinner
	} from 'flowbite-svelte';
	import { FilePdfSolid } from 'flowbite-svelte-icons';
	import type { MagazineModel } from '../../../../models/magazineModel.js';
	import { magazineStore } from '../../../../stores/magazineStore.js';
	import Constants from '../../../../utils/constants.js';
	import { modelToItemModel } from '../../../../models/covertModel.js';
	import { magazineCurrentThemeColors, currentMainThemeColors } from '../../../../stores/darkMode';
	import { ChevronDown } from 'svelte-heros-v2';
	import ImageCarousel from '$lib/components/ImageCarousel.svelte';

	export let data;
	let magazine: MagazineModel | undefined | null;

	$: {
		if ($locale) {
			getMagazine();
		}
	}

	async function getMagazine() {
		magazine = await magazineStore.getSingle($locale, data.supabase, $page.params.magazineId);
		magazineStore.get($locale, data.supabase, '1', 5);
	}

	onMount(() => {
		getMagazine();
	});
</script>

<section class="w-full">
	
	<div class="{Constants.page_max_width} mx-auto mt-10 flex flex-col items-center">
		{#if magazine}
			<!-- Top action section with dropdown button -->
			{#if magazine.pdf_files && magazine.pdf_files.length > 0}
				<div class="w-full flex justify-start">
					<Button
						style="background-color:{$currentMainThemeColors.backgroundColor}; color: {$currentMainThemeColors.overlayBackgroundColor}; border-color: {$currentMainThemeColors.primaryColor}; border-width: 1px;"
						class="w-[25vh] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
						<FilePdfSolid size="sm" />
						{$LL.pdf_file()}
						<ChevronDown class="w-4 h-4" />
					</Button>
					<Dropdown
						style="background-color: {$currentMainThemeColors.backgroundColor}; color: {$currentMainThemeColors.overlayBackgroundColor}"
						class="overflow-y-auto max-h-[30vh] w-[25vh] {Constants.scrollbar_layout} shadow-lg rounded-lg"
					>
						{#each magazine.pdf_files as pdf}
							<a
								href={pdf}
								target="_blank"
								rel="noopener noreferrer"
								class="flex flex-row items-center gap-3 p-4 hover:bg-opacity-10 transition-all duration-200"
								style="color: {$currentMainThemeColors.overlayBackgroundColor};
								 background-color: {$currentMainThemeColors.backgroundColor}"
							>
								<FilePdfSolid class="text-red-500" size="sm" />
								<span class="truncate text-sm">{magazine.title}</span>
							</a>
							<DropdownDivider class="my-1 opacity-20" />
						{/each}
					</Dropdown>
				</div>
			{/if}

			<!-- Main content grid: carousel and magazine list side by side -->
			<div class="grid 3xl:grid-cols-3 xl:grid-cols-3 grid-cols-1 my-2 rounded-lg justify-center items-start content-center w-full gap-6 px-4 py-8">
				<div class="flex-1 xl:col-span-2 col-span-1 w-full h-full z-0">
					<div class="rounded-lg shadow-lg overflow-hidden" 
					style="background-color: {$magazineCurrentThemeColors.secondaryColor};
					 color: {$magazineCurrentThemeColors.overlaySecondaryColor}"
					>
						{#if magazine.imagesCarousel && magazine.imagesCarousel.length > 0}
							<ImageCarousel 
								images={magazine.imagesCarousel}
								height="600px"
								showThumbs={true}
								autoplay={true}
								effect="fade"
								zoom={true}
							/>
						{/if}
						<div class="p-6">
							<div class="mt-4 prose max-w-none dark:prose-invert">
								{@html magazine.long_description}
							</div>
						</div>
					</div>
				</div>
				{#if $magazineStore?.data}
					<div class="xl:col-span-1 col-span-1 xl:p-2 w-full h-full flex xl:items-start items-center xl:justify-start justify-center xl:px-0 px-4">
						<div class="sticky top-4 w-full">
							<RecentItems
								title={$LL.magazine()}
								items={$magazineStore.data.map((magazine) => modelToItemModel(magazine))}
								pageType={'magazine'}
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
