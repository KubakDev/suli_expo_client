<script lang="ts">
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { onMount } from 'svelte';
	import { aboutSectionStore } from '../../stores/aboutSectionStore';
	import { staffSectionStore } from '../../stores/staffSectionStore';
	import About from '$lib/components/About.svelte';
	import Staff from '$lib/components/Staff.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Saos from 'saos';
	import Constants from '../../utils/constants';
	import { currentMainThemeColors } from '../../stores/darkMode';

	export let data;

	$: {
		if ($locale) {
			aboutSectionStore.get($locale, data.supabase);
			staffSectionStore.get($locale, data.supabase);
		}
	}
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<section class="py-12 flex-1">
	<div class="mx-auto {Constants.page_max_width}">
		<div class="flex justify-center items-center mb-12">
			<TitleUi
				text={$LL.about()}
				borderColor={$currentMainThemeColors.primaryColor}
				textColor={$currentMainThemeColors.overlayBackgroundColor}
			/>
		</div>
		<div class="">
			{#if $aboutSectionStore}
				<div class="rounded-xl">
					<About aboutSection={$aboutSectionStore} />
				</div>
			{/if}
		</div>

		<section>
			<div class="text-center pb-12">
				<h1
					class="font-bold text-3xl md:text-4xl lg:text-5xl font-heading"
					style="color: {$currentMainThemeColors.overlayBackgroundColor};"
				>
					{$LL.successTeam()}
				</h1>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">
				{#each $staffSectionStore as staffSection}
					<div
						class=" rounded-lg p-2"
						style="color: {$currentMainThemeColors.overlayBackgroundColor};"
					>
						<Staff {staffSection} />
					</div>
				{/each}
			</div>
		</section>
	</div>
</section>

<style>
	@keyframes -global-from-bottom {
		from {
			transform: translateY(20%);
		}
		to {
			transform: translateY(0);
		}
	}
</style>
