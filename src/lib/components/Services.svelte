<script lang="ts">
	import type { ServiceModel } from '../../models/serviceModel';
	import { ImgSourceEnum } from '../../models/imgSourceEnum';
	import { onMount } from 'svelte';
	import serviceUiStore, { getServiceUi } from '../../stores/ui/serviceUi';
	import TitleUi from './TitleUi.svelte';

	//get the news data
	export let service: ServiceModel[];
	export let supabase: any;
	let CardComponent: any;

	onMount(async () => {
		await getServiceUi(supabase);
		let card = $serviceUiStore?.component?.title;
		const module = await import('kubak-svelte-component');
		CardComponent = module[card as keyof typeof module];
	});

	console.log('first', service);
</script>

<section class="py-10">
	<div class="flex justify-center items-center my-8">
		<TitleUi text="Services" />
	</div>

	<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each service as item, i}
			{#if CardComponent}
				<svelte:component
					this={CardComponent}
					data={{
						title: item.title,
						thumbnail: item.thumbnail,
						short_description: item.short_description,
						imgSource: ImgSourceEnum.remote
					}}
					imageData={{ thumbnail: item.thumbnail, imgSource: ImgSourceEnum.remote }}
					colors={{
						primaryColor: item.primaryColor ?? $serviceUiStore.color_palette?.primaryColor,
						onPrimaryColor: item.onPrimaryColor ?? $serviceUiStore.color_palette?.onPrimaryColor
					}}
				/>
			{/if}
		{/each}
	</div>
</section>
