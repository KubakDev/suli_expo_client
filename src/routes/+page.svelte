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

	export let data;
	let seatLayout: SeatLayoutModel | undefined | null;

	onMount(async () => {
		seatLayout = await seatStore.get(data.supabase);

		exhibitionSectionStore.get(data.supabase);
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
	{#if $exhibitionSectionStore}
		<div class="">
			<ExhibitionSection exhibitions={$exhibitionSectionStore} supabase={data.supabase} />
		</div>
	{:else}
		<NewsSectionShimmer />
	{/if}

	<div class=" bg-secondary w-full">
		<NewsSection supabase={data.supabase} />
	</div>
	<PromoSection supabase={data.supabase} />
	{#if seatLayout}
		<SeatReservation {seatLayout} />
	{/if}
</div>

<style>
</style>
