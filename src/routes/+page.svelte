<script lang="ts">
	import HomeSwiper from '$lib/components/HomeSwiper.svelte';
	import { onMount } from 'svelte';
	import { seatStore, type SeatLayoutModel } from '../stores/seatReservationStore';
	import SeatReservation from '$lib/components/SeatReservation.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { exhibitionSectionStore } from '../stores/exhibtionSectionStore';
	import ExhibitionSection from '$lib/components/ExhibitionSection.svelte';
	import PromoSection from '$lib/components/PromoSection.svelte';
	import NewsSectionShimmer from '$lib/components/NewsSection/NewsSectionShimmer.svelte';
	import NewsSection from '$lib/components/NewsSection/NewsSection.svelte';
	import About from '$lib/components/About.svelte';
	import AboutUsSection from '$lib/components/AboutUsSection.svelte';
	import 'aos/dist/aos.css';
	// @ts-ignore
	import AOS from 'aos';

	export let data;
	let seatLayout: SeatLayoutModel | undefined | null;

	onMount(async () => {
		AOS.init({
			disable: 'mobile'
		});
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

<div class="  m-auto w-full">
	<div class=" max-h-300 min-h-128 w-full block z-10">
		<ExhibitionSection exhibitions={$exhibitionSectionStore} supabase={data.supabase} />
	</div>

	<div
		data-aos="slide-right"
		data-aos-duration="1000"
		class=" bg-secondary w-full max-h-300 min-h-128 flex justify-center"
	>
		<NewsSection supabase={data.supabase} />
	</div>
	<div data-aos="slide-left" data-aos-duration="1000" data-aos-offset="300">
		<PromoSection supabase={data.supabase} />
	</div>
	<div
		data-aos-offset="1200"
		data-aos="slide-right"
		data-aos-duration="800"
		class=" bg-secondary w-full max-h-300 min-h-128 flex justify-center"
	>
		<AboutUsSection supabase={data.supabase} />
	</div>
	{#if seatLayout}
		<SeatReservation {seatLayout} />
	{/if}
</div>

<style>
</style>
