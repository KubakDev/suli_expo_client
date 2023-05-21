<script lang="ts">
	import HomeSwiper from '$lib/components/HomeSwiper.svelte';
	import { onMount } from 'svelte';
	import { seatStore, type SeatLayoutModel } from '../stores/seatReservationStore';
	import SeatReservation from '$lib/components/SeatReservation.svelte';
	import { newsSectionStore } from '../stores/newsSectionStore';
	import NewsSection from '$lib/components/NewsSection.svelte';

	export let data;
	let seatLayout: SeatLayoutModel | undefined | null;

	onMount(async () => {
		seatLayout = await seatStore.get(data.supabase);
		newsSectionStore.get(data.supabase, 3);
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
<HomeSwiper />

<div class="px-20 dark:bg-slate-900">
	{#if $newsSectionStore}
		<div class="my-4">
			<NewsSection news={$newsSectionStore} supabase={data.supabase} />
		</div>
	{/if}
	{#if seatLayout}
		<SeatReservation {seatLayout} />
	{/if}
</div>

<style>
</style>
