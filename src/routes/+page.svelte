<script lang="ts">
	import HomeSwiper from '$lib/components/HomeSwiper.svelte';
	import { onMount } from 'svelte';
	import { seatStore, type SeatLayoutModel } from '../stores/seatReservationStore';
	import SeatReservation from '$lib/components/SeatReservation.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { exhibitionSectionStore } from '../stores/exhibtionSectionStore';
	import ExhibitionSection from '$lib/components/ExhibitionSection.svelte';
	import PromoSection from '$lib/components/PromoSection.svelte';
	import NewsSection from '$lib/components/NewsSection/NewsSection.svelte';
	import Saos from 'saos';

	import AboutUsSection from '$lib/components/AboutUsSection.svelte';

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

<!-- <picture>
			<source srcset="/images/suliexpo.jpg" type="image/webp" />
			<img class="object-cover" src="/images/suliexpo.jpg" alt="Welcome" />
		</picture> -->
<HomeSwiper locale={$locale} supabase={data.supabase} />

<div class="  m-auto w-full overflow-hidden">
	<div class=" max-h-300 min-h-128 w-full block z-10">
		<ExhibitionSection exhibitions={$exhibitionSectionStore} supabase={data.supabase} />
	</div>
	<Saos animation={'from-left 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}>
		<div class=" bg-secondary w-full max-h-300 min-h-128 flex justify-center">
			<NewsSection supabase={data.supabase} />
		</div>
	</Saos>
	<Saos animation={'from-right 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}>
		<div>
			<PromoSection supabase={data.supabase} />
		</div>
	</Saos>
	<Saos animation={'from-left 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}>
		<div class=" bg-secondary w-full max-h-300 min-h-128 flex justify-center">
			<AboutUsSection supabase={data.supabase} />
		</div>
	</Saos>
	{#if seatLayout}
		<!-- <SeatReservation {seatLayout} /> -->
	{/if}
</div>

<style>
	@keyframes -global-from-left {
		0% {
			transform: rotateX(50deg) translateX(-200vw);
			opacity: 1;
		}
		100% {
			transform: rotateX(0deg) translateX(0);
			opacity: 1;
		}
	}

	@keyframes -global-from-right {
		0% {
			transform: rotateX(50deg) translateX(200vw);
			opacity: 1;
		}
		100% {
			transform: rotateX(0deg) translateX(0);
			opacity: 1;
		}
	}
</style>
