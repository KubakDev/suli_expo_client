<script lang="ts">
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { onMount } from 'svelte';
	import { aboutSectionStore } from '../../stores/aboutSectionStore';
	import About from '$lib/components/+About.svelte';

	export let data;

	onMount(async () => {
		await aboutSectionStore.get(data?.supabase);
		console.log('data', $aboutSectionStore);
	});
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<section class="py-10 dark:bg-slate-900">
	<div class="mx-auto px-4 sm:px-5 max-w-screen-2xl">
		<div class="flex justify-center items-center my-8">
			<TitleUi text="About US" />
		</div>

		<div class="">
			{#each $aboutSectionStore as aboutSection}
				<div class="dark:bg-slate-900 dark:text-white">
					<ul class="py-10">
						<About {aboutSection} />
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>
