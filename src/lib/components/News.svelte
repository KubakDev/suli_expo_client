<script lang="ts">
	import type { NewsModel } from '../../models/newsModel';
	import { ImgSourceEnum } from '../../models/imgSourceEnum';
	import { onMount } from 'svelte';
	import newsUiStore, { getNewsUi } from '../../stores/ui/newsUi';
	import logger from '../../utils/logger';
	import TitleUi from './TitleUi.svelte';
	export let news: NewsModel[];
	export let supabase: any;
	let CardComponent: any;

	onMount(async () => {
		console.log(supabase);
		await getNewsUi(supabase);
		let card = $newsUiStore?.component?.title;
		logger.info(news);
		const module = await import('kubak-svelte-component');
		console.log(card);
		CardComponent = module[card as keyof typeof module];
	});
</script>

<section class="py-10">
	<div class="flex justify-center items-center my-8">
		<TitleUi text="News " />
	</div>

	<div class="mx-auto px-4 sm:px-5 max-w-screen-2xl">
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
	</div>
</section>
