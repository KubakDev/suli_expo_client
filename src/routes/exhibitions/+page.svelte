<script lang="ts">
	import { onMount } from 'svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { exhibitionStore } from '../../stores/exhibtionStore.js';
	import Constants from '../../utils/constants.js';
	import { fly, fade } from 'svelte/transition';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import constants from '../../utils/constants.js';

	export let data;

	onMount(async () => {
		await exhibitionStore.get(data?.supabase);
	});
</script>

<svelte:head>
	<title>Exhibition</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="py-12 {Constants.page_max_width} mx-auto w-full">
	<div
		in:fade={{ duration: 800 }}
		out:fade={{ duration: 400 }}
		class="flex justify-center items-center mb-12"
	>
		<TitleUi text="Exhibition" customClass=" dark:text-white text-secondary " />
	</div>

	<div
		class="grid grid-cols-1 lg:grid-cols-2 gap-5 justify-items-center items-center {constants.section_margin_top}"
	>
		{#each $exhibitionStore as exhibition, i}
			<a href="/exhibitions/{exhibition.id}" class="w-full a-tag">
				<ExpoCard
					title={exhibition.title}
					thumbnail={exhibition.thumbnail}
					date={exhibition.exhibition_date}
					cardType={CardType.Square}
				/>
			</a>
		{/each}
	</div>
</section>
