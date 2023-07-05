<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { DetailPage } from 'kubak-svelte-component';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../utils/constants';
	import { magazineStore } from '../../../stores/magazineStore';
	import { page } from '$app/stores';
	import type { MagazineModel } from '../../../models/magazineModel';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import { modelToItemModel } from '../../../models/covertModel';
	import { Button, Chevron, Dropdown, DropdownItem, GradientButton } from 'flowbite-svelte';
	import { FilePdfSolid } from 'flowbite-svelte-icons';

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

<section class="dark:bg-slate-900 dark:text-white text-slate-950 w-full">
	{#if magazine}
		<div class=" items-start flex flex-col 3xl:flex-row justify-around">
			<div class=" bg-gray-50 {Constants.page_max_width} m-auto flex-1 my-10">
				<DetailPage
				class="object-contain"
					long_description={magazine.long_description}
					imagesCarousel={magazine.imagesCarousel}
				/>
				<div class="absolute justify-center mt-8">
					<Button><Chevron>PDF Files</Chevron></Button>
			{#each magazine.pdf_files as pdf}	
			<Dropdown>
				<DropdownItem href="{pdf}" class="flex flex-row justify-between items-center text-white"><FilePdfSolid size="30" class="dark:text-red-500"/>{magazine.title}</DropdownItem>
			  </Dropdown>
			{/each}
				</div>
			</div>
			{#if $magazineStore}
				<RecentItems
					title={$LL.magazine()}
					items={$magazineStore.map((magazine) => modelToItemModel(magazine))}
					pageType={'magazine'}
				/>
			{/if}
		</div>

	{/if}
</section>
