<script lang="ts">
	import MailTemplate from './../lib/components/MailTemplate.svelte';
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
	import { UiStore } from '../stores/ui/Ui';
	import { currentUser } from '../stores/currentUser';
	import { incrementSulExpoViewer, viewAdded_sulyExpo } from '../stores/viewersStore';
	import { TwicImg, TwicView } from '@twicpics/components/sveltekit';
	import {
		currentMainThemeColors,
		exhibitionCurrentMainThemeColors,
		newsCurrentThemeColors
	} from '../stores/darkMode';

	export let data;
	let seatLayout: SeatLayoutModel | undefined | null;
	let exhibitionSection: boolean = false;
	let newsSection: boolean = false;

	onMount(async () => {
		seatLayout = await seatStore.get(data.supabase);
		exhibitionSection = (await UiStore.getPage(data.supabase, 'exhibition')) as boolean;
		newsSection = (await UiStore.getPage(data.supabase, 'news')) as boolean;
	});

	// count viewers
	onMount(() => {
		if (!$viewAdded_sulyExpo) {
			incrementSulExpoViewer(data.supabase);
		}
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Suly Expo" />
</svelte:head>
<div class="flex-1 w-full h-full">
	<HomeSwiper locale={$locale} supabase={data.supabase} />

	<div class="m-auto w-full overflow-hidden">
		{#if exhibitionSection}
			<div style="background-color:{$exhibitionCurrentMainThemeColors.backgroundColor} p-2">
				<ExhibitionSection exhibitions={$exhibitionSectionStore} supabase={data.supabase} />
			</div>
		{/if}

		{#if newsSection}
			<div style="background-color:{$newsCurrentThemeColors.backgroundColor}; p-2">
				<NewsSection supabase={data.supabase} />
			</div>
		{/if}
		<div>
			<PromoSection supabase={data.supabase} />
		</div>

		<div class=" w-full max-h-300 min-h-128 h-full flex justify-center">
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
