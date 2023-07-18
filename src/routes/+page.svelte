<script lang="ts">
	import HomeSwiper from '$lib/components/HomeSwiper.svelte';
	import { onMount } from 'svelte';
	import { seatStore, type SeatLayoutModel } from '../stores/seatReservationStore';
	import { locale } from '$lib/i18n/i18n-svelte';
	import PromoSection from '$lib/components/PromoSection.svelte';
	import { exhibitionSectionStore } from '../stores/exhibtionSectionStore';
	import AboutUsSection from '$lib/components/AboutUsSection.svelte';
	import ExhibitionSection from '$lib/components/ExhibitionSection.svelte';
	import NewsSection from '$lib/components/NewsSection/NewsSection.svelte';
	import SeatReservation from '$lib/components/SeatReservation.svelte';
	import { promoStore } from '../stores/promoStore';
	import { Parallax, ParallaxLayer, StickyLayer } from 'svelte-parallax';

	export let data;
	let seatLayout: SeatLayoutModel | undefined | null;

	onMount(async () => {
		seatLayout = await seatStore.get(data.supabase);
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<div class="flex-1 w-full h-full">
	<HomeSwiper locale={$locale} supabase={data.supabase} />

	<div class="m-auto w-full overflow-hidden px-2">
		<Parallax sections={1.6}>
			<ParallaxLayer class="bg-black">
				<ExhibitionSection exhibitions={$exhibitionSectionStore} supabase={data.supabase} />
				<NewsSection supabase={data.supabase} />
			</ParallaxLayer>

			<ParallaxLayer rate={0.95} offset={0.95} class="bg-orange-700">
			<div style="background-color: gray;">
				<PromoSection supabase={data.supabase} />
			</div>

			<div class=" w-full max-h-300 min-h-128 h-full flex justify-center">
				<AboutUsSection supabase={data.supabase} />
			</div>
		</ParallaxLayer>

			{#if seatLayout}
				<SeatReservation {seatLayout} />
			{/if}
		</Parallax>
	</div>
</div>

<style>
	@keyframes -global-from-left {
		0% {
			transform: translateX(-200vw);
			opacity: 1;
		}
		100% {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes -global-from-right {
		0% {
			transform: translateX(200vw);
			opacity: 1;
		}
		100% {
			transform: translateX(0);
			opacity: 1;
		}
	}
</style>
