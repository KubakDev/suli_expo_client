<!-- <script lang="ts">
	import { TitleUi } from '$lib/components/TitleUi.svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	//@ts-ignore
	import Marquee from "svelte-fast-marquee";
	import type { Locale } from 'typesafe-i18n/types/runtime/src/core.mjs';
	import type { ExhibitionModel } from '../../models/exhibitionModel';
	import TitleUi from './TitleUi.svelte';
	export let exhibition: ExhibitionModel;
	export let locale: Locale;
</script>

{#if exhibition.sponsor_images}
<TitleUi text={$LL.exhibition_mini_data.Exhibition_Sponsors()} />
<div class="sponsor-slider flex py-6">
	<Marquee
	speed={30}
	> 
		<div class="flex flex-row justify-between">
			{#each exhibition.sponsor_images as sponsor}
				<img src={sponsor} class="w-48 h-48 object-cover rounded-xl" />
			{/each}
		</div>
	</Marquee>
</div>
{/if} -->

<script lang="ts">
	import { LL } from '$lib/i18n/i18n-svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	export let images: string[];

	let selectedImage = 0;

	function nextImage() {
		selectedImage = (selectedImage + 1) % images.length;
	}

	setInterval(nextImage, 3000);
</script>

<div class="flex overflow-x-hidden">
	<div class="animate-marquee flex flex-row-reverse whitespace-nowrap w-full mx-auto py-5">
		{#each images as image}
			<!-- svelte-ignore a11y-missing-attribute -->
			<img
				src={image}
				class="w-48 h-32 object-fit rounded-lg mx-6 hover:bg-lightTransparentBackgroundColor hover:p-1 transition-all"
			/>
		{/each}
	</div>
</div>

<style>
	.animate-marquee {
		animation: marquee 17.5s linear infinite;
	}

	.animate-marquee:hover {
		animation-play-state: paused;
	}

	@keyframes marquee {
		0% {
			/* Start with images shifted outside viewport */
			transform: translateX(50%);
		}
		100% {
			transform: translateX(-100%);
		}
	}
</style>
