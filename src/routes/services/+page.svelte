<script lang="ts">
	import { onMount } from 'svelte';
	import { serviceSectionStore } from '../../stores/serviceSectionStore';
	import Card from '$lib/components/Card.svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import Constants from '../../utils/constants';
	import { fly, fade } from 'svelte/transition';

	export let data;

	onMount(async () => {
		await serviceSectionStore.get(data?.supabase);
		console.log('data', $serviceSectionStore);
	});
</script>

<svelte:head>
	<title>Services</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<section class="py-12 {Constants.page_max_width} m-auto">
	{#if $serviceSectionStore}
		<div
			in:fade={{ duration: 800 }}
			out:fade={{ duration: 400 }}
			class="flex justify-center items-center mb-12"
		>
			<TitleUi text="Services" />
		</div>

		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $serviceSectionStore as item, i}
				<div
					in:fly={{ y: 200, duration: 600, delay: i * 100 }}
					out:fly={{ y: 200, duration: 200, delay: i * 20 }}
				>
					<Card />
				</div>
			{/each}
		</div>
	{/if}
</section>
