<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { DetailPage } from 'kubak-svelte-component';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { page } from '$app/stores';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import { Button, Chevron, Dropdown, DropdownDivider, DropdownItem, GradientButton } from 'flowbite-svelte';
	import { FilePdfSolid } from 'flowbite-svelte-icons';
	import type { MagazineModel } from '../../../../models/magazineModel.js';
	import { magazineStore } from '../../../../stores/magazineStore.js';
	import Constants from '../../../../utils/constants.js';
	import { modelToItemModel } from '../../../../models/covertModel.js';

	export let data;
	let magazine: MagazineModel | undefined | null;

	async function getMagazine() {
		magazine = await magazineStore.getSingle($locale, data.supabase, $page.params.magazineId);
		magazineStore.get($locale, data.supabase);
	}

	onMount(() => {
		getMagazine();
	});
</script>

<section class="dark:bg-slate-900 dark:text-white text-slate-950 {Constants.page_max_width} mx-auto w-full">
	{#if magazine}
		<div class="items-start grid xl:grid-cols-3 lg:grid-cols-2 mx-4 my-2 rounded-lg">
			<div class="  {Constants.page_max_width} m-auto flex-1 my-10 mt-auto col-span-2 w-full">
				<DetailPage
					long_description={magazine.long_description}
					imagesCarousel={magazine.imagesCarousel}
				/>
				<div class="flex justify-start mt-4 mx-2">
					<Button class="w-[12vh] dark:text-white text-gray-800"><Chevron>{$LL.pdf_file()}</Chevron></Button>
					<Dropdown class="overflow-y-auto max-h-[20vh] w-[20vh] {Constants.scrollbar_layout}">
			{#each magazine.pdf_files as pdf}	
				<DropdownItem href="{pdf}" target="_blank" class="flex flex-row justify-between items-center text-white"><FilePdfSolid class="dark:text-red-500 mr-1"/>{magazine.title}</DropdownItem>
				<DropdownDivider/>
				{/each}
			</Dropdown>
				</div>
			</div>
			{#if $magazineStore}
			<div class="col-span-1 w-full dark:bg-slate-700 bg-opacity-40 p-2 ml-1">
				<RecentItems
					title={$LL.magazine()}
					items={$magazineStore.map((magazine) => modelToItemModel(magazine))}
					pageType={'magazine'}
				/>
			</div>
			{/if}
		</div>

	{/if}
</section>
