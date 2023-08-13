<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { locale, LL } from '$lib/i18n/i18n-svelte';
	import { exhibitionStore } from '../../../../stores/exhibtionStore';
	import type { ExhibitionModel } from '../../../../models/exhibitionModel';
	//@ts-ignore
	import ReservationComponent from './ReservationComponent.svelte';
	import SelectedSeatInformationSection from './selectedSeatInformationSection.svelte';
	import { selectedSeat } from './seatReservationStore';
	import NotSelectedObject from './notSelectedObject.svelte';
	import { Button, Modal } from 'flowbite-svelte';
	import { fade, fly } from 'svelte/transition';

	export let data: any;
	let defaultModal = false;
	let reserveSeatData: any;
	let exhibition: ExhibitionModel;
	async function getExhibition() {
		exhibition = (await exhibitionStore.getSingle(
			$locale,
			data.supabase,
			$page.params.exhibitionId
		)) as ExhibitionModel;
	}

	$: {
		if ($locale) {
			getExhibition();
		}
	}

	onMount(async () => {
		await getExhibition();
	});
	async function reserveSeat() {
		data.supabase
			.from('seat_reservation')
			.insert(reserveSeatData)
			.then((result: any) => {});
	}
</script>

<section class="w-full flex-1 overflow-x-hidden">
	<div class="px-0 lg:px-32 3xl:px-72 w-full h-full">
		<div class="w-full h-full flex items-center 2xl:px-20 flex-wrap">
			<div class="bg-[#f5f5f5] h-3/4 mx-2 rounded-xl w-full 2xl:w-[69%]">
				<div class=" items-center sm:h-auto h-screen flex flex-col justify-around">
					{#if exhibition?.seat_layout}
						<ReservationComponent
							data={exhibition?.seat_layout}
							supabase={data.supabase}
							locale={$locale}
						/>
					{/if}
				</div>
			</div>

			<div class="hidden 2xl:flex h-3/4 bg-[#f5f5f5] rounded-xl py-4" style="width: 29%;">
				{#if $selectedSeat}
					<SelectedSeatInformationSection
						supabase={data.supabase}
						on:reserveSeat={(reserveData) => {
							defaultModal = true;
							reserveSeatData = reserveData.detail;
						}}
					/>
				{:else}
					<NotSelectedObject />
				{/if}
			</div>
			{#if $selectedSeat}
				<div
					class="pt-20 md:pt-0 2xl:hidden md:h-3/4 absolute bg-white rounded-xl h-screen w-screen md:w-full lg:w-5/6 left-0 top-0 md:top-auto md:left-auto"
					in:fly={{ x: -200, duration: 500 }}
					out:fly={{ x: 200, duration: 500 }}
				>
					<SelectedSeatInformationSection
						supabase={data.supabase}
						on:reserveSeat={(reserveData) => {
							defaultModal = true;
							reserveSeatData = reserveData.detail;
						}}
					/>
				</div>
			{/if}
		</div>
	</div>
	<Modal title={$LL.reservation.privacy_policy.title()} bind:open={defaultModal} autoclose>
		<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
			{exhibition?.seat_layout[0]?.seat_privacy_policy_lang.find((x) => x.language == $locale)
				?.description ?? ''}
		</p>
		<svelte:fragment slot="footer">
			<div class=" w-full flex justify-end items-center">
				<Button on:click={reserveSeat}>{$LL.reservation.privacy_policy.accept()}</Button>
				<div class="w-[2px]" />
				<Button color="alternative">{$LL.reservation.privacy_policy.decline()}</Button>
			</div>
		</svelte:fragment>
	</Modal>
</section>
