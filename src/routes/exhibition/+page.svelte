<script lang="ts">
	import { onMount } from 'svelte';
	import Exhibition from '$lib/components/Exhibition.svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { exhibitionStore } from '../../stores/exhibtionStore.js';

	export let data;

	onMount(async () => {
		await exhibitionStore.get(data?.supabase);
		// console.log('data', $exhibitionSectionStore);
	});
</script>

<svelte:head>
	<title>Exhibition</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="py-10 dark:bg-slate-900">
	<div class="mx-auto px-4 sm:px-5 max-w-screen-2xl">
		<div class="flex justify-center items-center my-8">
			<TitleUi text="Exhibition" />
		</div>

		<div class="grid gap-8 mt-8 sm:grid-cols-1 lg:grid-cols-2">
			{#each $exhibitionStore as exhibition}
				<div class="dark:bg-slate-900">
					<ul>
						<Exhibition {exhibition} />
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>
