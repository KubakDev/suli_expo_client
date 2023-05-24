<script lang="ts">
	import HomeSwiper from '$lib/components/HomeSwiper.svelte';
	import { onMount } from 'svelte';
	import { seatStore, type SeatLayoutModel } from '../stores/seatReservationStore';
	import SeatReservation from '$lib/components/SeatReservation.svelte';
	import { newsSectionStore } from '../stores/newsSectionStore';
	import NewsSection from '$lib/components/NewsSection.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';

	export let data;
	let seatLayout: SeatLayoutModel | undefined | null;

	onMount(async () => {
		seatLayout = await seatStore.get(data.supabase);
		newsSectionStore.get($locale, data.supabase, 3);
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

<h1>Hi welcome {$LL.HI({ name: 'World' })}</h1>
<div class="px-4 max-w-7xl m-auto sm:px-10">
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
