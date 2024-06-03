<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { DetailPage } from 'kubak-svelte-component';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { page } from '$app/stores';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import {
		Button,
		Dropdown,
		DropdownDivider,
		DropdownItem,
		Spinner
	} from 'flowbite-svelte';
	import { FilePdfSolid } from 'flowbite-svelte-icons';
	import type { MagazineModel } from '../../../../models/magazineModel.js';
	import { magazineStore } from '../../../../stores/magazineStore.js';
	import Constants from '../../../../utils/constants.js';
	import { modelToItemModel } from '../../../../models/covertModel.js';
	import { magazineCurrentThemeColors, currentMainThemeColors } from '../../../../stores/darkMode';
	import { ChevronDown } from 'svelte-heros-v2';

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

<section
	style="background-color: {$magazineCurrentThemeColors.secondaryColor}; color: {$magazineCurrentThemeColors.overlaySecondaryColor}"
	class=" {Constants.page_max_width} mx-auto w-full"
>
	{#if magazine}
		<div
			class="grid 3xl:grid-cols-3 grid-cols-2 my-2 rounded-lg justify-center items-center content-center w-full"
		>
			<div class="flex-1 my-10 mt-auto col-span-2 w-full h-full z-0">
				<DetailPage
					customClass="bg-none"
					long_description={magazine.long_description}
					imagesCarousel={magazine.imagesCarousel}
				/>
				<div class="flex justify-start mt-4 mx-2">
					<Button
						style="background-color:{$currentMainThemeColors.primaryColor}; color: {$currentMainThemeColors.overlayPrimaryColor}"
						class="w-[12vh]  ">{$LL.pdf_file()}<ChevronDown></ChevronDown></Button
					>
					<Dropdown
						style="background-color:{$currentMainThemeColors.primaryColor}; color: {$currentMainThemeColors.overlayPrimaryColor}"
						class="overflow-y-auto max-h-[20vh] w-[20vh] {Constants.scrollbar_layout}"
					>
						{#each magazine.pdf_files as pdf}
							<DropdownItem
								style="background-color:{$currentMainThemeColors.primaryColor}; color: {$currentMainThemeColors.overlayPrimaryColor}"
								href={pdf}
								target="_blank"
								class="flex flex-row justify-between items-center"
								><FilePdfSolid class="mr-1" size="lg" />{magazine.title}</DropdownItem
							>
							<DropdownDivider />
						{/each}
					</Dropdown>
				</div>
			</div>
			{#if $magazineStore?.data}
				<div class="3xl:col-span-1 p-2 col-span-2 ml-1 w-full h-full">
					<RecentItems
						title={$LL.magazine()}
						items={$magazineStore.data.map((magazine) => modelToItemModel(magazine))}
						pageType={'magazine'}
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
