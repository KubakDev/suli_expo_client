<script lang="ts">
	import type { NewsModel } from '../../models/newsModel';
	import { ImgSourceEnum } from '../../models/imgSourceEnum';
	import { onMount } from 'svelte';
	import newsUiStore, { getNewsUi } from '../../stores/ui/newsUi';
	import TitleUi from './TitleUi.svelte';
	import { Button } from 'flowbite-svelte';
	// import { MainCard } from 'suli/suliexpo-cards/MainCard.svelte';
	import logger from '../../utils/logger';

	export let news: NewsModel[];
	export let supabase: any;
	let CardComponent: any;
	onMount(async () => {
		await getNewsUi(supabase);
		let card = $newsUiStore?.component?.title;
		logger.info(news);
		const module = await import('kubak-svelte-component');
		console.log(card);
		CardComponent = module[card as keyof typeof module];
	});
</script>

<section class="py-10">
	<div class="flex justify-between items-center my-8">
		<div class="h-10 w-32" />
		<div class="">
			<TitleUi text="News " />
		</div>
		<Button color="primary" class="w-32 rounded-md bg-primary text-black">See all</Button>
	</div>
	<div class="grid justify-around grid-cols-1 sm:grid-cols-3 gap-8">
		{#each news as n, i}
			{#if CardComponent}
				<svelte:component
					this={CardComponent}
					data={{
						title: n.title,
						thumbnail: n.thumbnail,
						imgSource: ImgSourceEnum.remote,
						short_description: n.short_description
					}}
					colors={$newsUiStore.color_palette}
				/>
			{:else}
				<div />
			{/if}
		{/each}
	</div>
</section>
