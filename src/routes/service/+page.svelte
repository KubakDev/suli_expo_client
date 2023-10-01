<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { serviceSectionStore } from '../../stores/serviceSectionStore';
	import Card from '$lib/components/Card.svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import Constants from '../../utils/constants';
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import { goto } from '$app/navigation';
	import { serviceCurrentThemeColors } from '../../stores/darkMode';

	export let data: any;

	$: {
		if ($locale) {
			serviceSectionStore.get($locale, data.supabase);
		}
	}

	onMount(async () => {
		await serviceSectionStore.get($locale, data?.supabase);
	});
</script>

<svelte:head>
	<title>Services</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<section class="py-12 {Constants.page_max_width} mx-auto w-full h-full flex-1">
	{#if $serviceSectionStore}
		<div class="flex justify-center items-center mb-12">
			<TitleUi
				text={$LL.services()}
				borderColor={$serviceCurrentThemeColors.primaryColor}
				textColor={$serviceCurrentThemeColors.overlayBackgroundColor}
			/>
		</div>

		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $serviceSectionStore as item, i}
				<div class=" bg-white rounded-3xl">
					<Card
						title={item.title}
						description={item.short_description}
						image={item.thumbnail}
						service_color={{
							title: item.primaryColor || `${$serviceCurrentThemeColors.overlaySecondaryColor}`,
							description: item.onPrimaryColor || `${$serviceCurrentThemeColors.secondaryColor}`
						}}
					/>
				</div>
			{/each}
		</div>
	{/if}
</section>
