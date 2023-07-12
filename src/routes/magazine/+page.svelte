<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getNewsUi } from '../../stores/ui/newsUi';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import newsUiStore from '../../stores/ui/newsUi';
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../utils/constants';
	import { stringToEnum } from '../../utils/enumToString';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import { magazineStore } from '../../stores/magazineStore';
	export let data;
	let CardComponent: any;

	$: {
		if ($locale) {
			magazineStore.get($locale, data.supabase);
		}
	}
	onMount(async () => {
		getNewsUi(data.supabase).then(async (value) => {
			CardComponent = stringToEnum($newsUiStore?.component.title!, CardType);
		});
	});

	// Navigate to newsDetail page
	function DetailsPage(itemId: any) {
		goto(`/magazine/detail/${itemId}`);
		//('news :', itemId);
	}
</script>

<section class="py-12 {Constants.page_max_width} mx-auto flex-1 w-full h-full">
	<div class="flex justify-center items-center mb-12">
		<div>
			<TitleUi text="{$LL.magazine()}" customClass=" dark:text-white text-secondary " />
		</div>
	</div>
	{#if $magazineStore}
		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $magazineStore as item, i}
				{#if CardComponent}
					<div on:click={() => DetailsPage(item.id)}>
						<ExpoCard imageClass="rounded-t-3xl object-cover" cardType={CardType.Main} title={item.title} short_description={item.short_description} date={item.created_at} thumbnail={item.thumbnail} />
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</section>
