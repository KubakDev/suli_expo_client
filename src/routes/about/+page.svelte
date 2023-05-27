<script lang="ts">
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { onMount } from 'svelte';
	import { aboutSectionStore } from '../../stores/aboutSectionStore';
	import { staffSectionStore } from '../../stores/staffSectionStore';
	import About from '$lib/components/About.svelte';
	import Staff from '$lib/components/Staff.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';

	export let data;

	onMount(async () => {
		await aboutSectionStore.get($locale, data?.supabase);
		// console.log('data', $aboutSectionStore);
		await staffSectionStore.get(data?.supabase);
		// console.log('staff data', $staffSectionStore);
	});
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<section class="py-10 dark:bg-slate-900">
	<div class="mx-auto px-4 sm:px-5 max-w-screen-2xl">
		<!-- title -->
		<div class="flex justify-center items-center my-8">
			<TitleUi text="About US" />
		</div>
		<!-- about content -->
		<div class="">
			{#if $aboutSectionStore}
				<div class="dark:bg-slate-900 dark:text-white">
					<ul class="py-10">
						<About aboutSection={$aboutSectionStore} />
					</ul>
				</div>
			{/if}
		</div>

		<!-- team section -->
		<section>
			<div class="text-center pb-12">
				<h1 class="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-[#e1b168]">
					Our Success Team
				</h1>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">
				{#each $staffSectionStore as staffSection}
					<div
						data-aos="fade-in"
						data-aos-offset="200"
						data-aos-easing="ease-in-cubic"
						data-aos-duration="900"
						class="dark:bg-slate-900 dark:text-white"
					>
						<Staff {staffSection} />
					</div>
				{/each}
			</div>
		</section>
	</div>
</section>
