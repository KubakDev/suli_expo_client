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

	<div class=" m-auto w-full overflow-hidden px-2">
		<ExhibitionSection exhibitions={$exhibitionSectionStore} supabase={data.supabase} />

		<NewsSection supabase={data.supabase} />

		<div>
			<PromoSection supabase={data.supabase} />
		</div>

		<div class=" bg-secondary w-full max-h-300 min-h-128 flex justify-center">
			<AboutUsSection supabase={data.supabase} />
		</div>

		{#if seatLayout}
			<SeatReservation {seatLayout} />
		{/if}
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
