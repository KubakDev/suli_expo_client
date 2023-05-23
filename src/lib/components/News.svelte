<script lang="ts">
	import type { NewsModel } from '../../models/newsModel';
	import { ImgSourceEnum } from '../../models/imgSourceEnum';
	import { onMount } from 'svelte';
	import newsUiStore, { getNewsUi } from '../../stores/ui/newsUi';
	import TitleUi from './TitleUi.svelte';
	import { goto } from '$app/navigation';

	//get the news data
	export let news: NewsModel[];
	export let supabase: any;
	let CardComponent: any;

	onMount(async () => {
		await getNewsUi(supabase);
		let card = $newsUiStore?.component?.title;
		const module = await import('kubak-svelte-component');
		CardComponent = module[card as keyof typeof module];
	});

	// Navigate to newsDetail page
	function DetailsPage(itemId) {
		goto(`/newsDetail/${itemId}`);
		console.log('news :', itemId);
	}
</script>

<section class="py-10">
	<div class="flex justify-center items-center my-8">
		<TitleUi text="News " />
	</div>

	<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each news as item, i}
			{#if CardComponent}
				<button on:click={() => DetailsPage(item.id)}>
					<svelte:component
						this={CardComponent}
						data={{
							title: item.title,
							thumbnail: item.thumbnail,
							imgSource: ImgSourceEnum.remote
						}}
						imageData={{ thumbnail: item.thumbnail, imgSource: ImgSourceEnum.remote }}
						colors={$newsUiStore.color_palette}
					/>
				</button>
			{/if}
		{/each}
	</div>
</section>
