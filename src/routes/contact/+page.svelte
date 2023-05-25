<script lang="ts">
	import { onMount } from 'svelte';
	import { contactInfoSectionStore } from '../../stores/contactInfo';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';

	export let data;
	$: {
		if ($locale && data.supabase) {
			contactInfoSectionStore.get($locale, data.supabase);
		}
	}
</script>

<svelte:head>
	<title>Contact</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="py-10 dark:bg-slate-900">
	<div class="mx-auto px-4 sm:px-5 max-w-screen-2xl">
		<div class="flex justify-center items-center my-8">
			<TitleUi text="Contact" />
		</div>

		<div class="grid gap-8 mt-8 sm:grid-cols-1 lg:grid-cols-2">
			{#if $contactInfoSectionStore}
				{#each $contactInfoSectionStore as contactInfoSection}
					<div class="dark:bg-slate-900 dark:text-white">
						{contactInfoSection?.location}
					</div>
				{/each}
			{/if}
			fgfg
		</div>
	</div>
</section>
