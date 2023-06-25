<script lang="ts">
	import { onMount } from 'svelte';
	import { serviceSectionStore } from '../../stores/serviceSectionStore';
	import Card from '$lib/components/Card.svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import Constants from '../../utils/constants';

	export let data;

	onMount(async () => {
		await serviceSectionStore.get(data?.supabase);
		//('data', $serviceSectionStore);
	});
</script>

<svelte:head>
	<title>Services</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<section class="py-12 {Constants.page_max_width} mx-auto w-full h-full flex-1">
	{#if $serviceSectionStore}
		<div class="flex justify-center items-center mb-12">
			<TitleUi text="Services" customClass=" dark:text-white text-secondary " />
		</div>

		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $serviceSectionStore as item, i}
				<div>
					<Card title={item.title} description={item.short_description} image={item.thumbnail} />
				</div>
			{/each}
		</div>
	{/if}
</section>
