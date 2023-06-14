<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import type { NewsModel } from '../../models/newsModel';
	import { getNewsUi } from '../../stores/ui/newsUi';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { ImgSourceEnum } from '../../models/imgSourceEnum';
	import newsUiStore from '../../stores/ui/newsUi';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { newsStore } from '../../stores/newsStore';
	import Constants from '../../utils/constants';
	import { stringToEnum } from '../../utils/enumToString';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	export let data;
	let CardComponent: any;

	$: {
		if ($locale) {
			newsStore.get($locale, data.supabase);
		}
	}

	onMount(async () => {
		getNewsUi(data.supabase).then(async (value) => {
			CardComponent = stringToEnum($newsUiStore?.component.title!, CardType);
		});
	});

	// Navigate to newsDetail page
	function DetailsPage(itemId: any) {
		goto(`/news/${itemId}`);
		//('news :', itemId);
	}
</script>

<section class="py-12 {Constants.page_max_width} mx-auto">
	<div class="flex justify-center items-start mb-12">
		<div in:fade={{ duration: 800 }} out:fade={{ duration: 400 }}>
			<TitleUi text="News " customClass=" dark:text-white text-secondary " />
		</div>
	</div>
	{#if $newsStore}
		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $newsStore as item, i}
				{#if CardComponent}
					<div on:click={() => DetailsPage(item.id)}>
						<ExpoCard
							cardType={CardType.Main}
							title={item.title}
							short_description={item.short_description}
							thumbnail={item.thumbnail}
							primaryColor={CardComponent.primaryColor}
						/>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</section>
