<script lang="ts">
	import { onMount } from 'svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { exhibitionStore } from '../../stores/exhibtionStore.js';
	import Constants from '../../utils/constants.js';
	import { fly, fade } from 'svelte/transition';
	import { CardType, ExpoCard } from 'kubak-svelte-component';

	export let data;

	onMount(async () => {
		await exhibitionStore.get(data?.supabase);
	});
</script>

<svelte:head>
	<title>Exhibition</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="py-12 {Constants.page_max_width} m-auto">
	<div class="">
		<div
			in:fade={{ duration: 800 }}
			out:fade={{ duration: 400 }}
			class="flex justify-center items-center mb-12"
		>
			<TitleUi text="Exhibition" customClass=" dark:text-white text-secondary " />
		</div>

		<div class="grid gap-8 mt-8 sm:grid-cols-1 lg:grid-cols-2">
			{#each $exhibitionStore as exhibition, i}
				<div
					in:fly={{ y: 200, duration: 600, delay: i * 100 }}
					out:fly={{ y: 200, duration: 200, delay: i * 20 }}
				>
					<ExpoCard
						title={exhibition.title}
						thumbnail={exhibition.images[0]}
						cardType={CardType.Square}
						primaryColor={'bg-primary'}
					/>
				</div>
			{/each}
		</div>
	</div>
</section>
