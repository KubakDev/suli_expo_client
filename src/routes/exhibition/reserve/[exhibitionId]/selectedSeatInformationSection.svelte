<script lang="ts">
	import { Button, Spinner, Textarea } from 'flowbite-svelte';
	import InputNumberButton from '$lib/components/inputNumberButton.svelte';
	import {
		addSelectedSeat,
		seatDataLoading,
		selectedFreeSeatServices,
		selectedPaidSeatServices,
		selectedSeat
	} from './seatReservationStore';
	import { currentUser } from '../../../../stores/currentUser';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ReservationStatusEnum, type ReserveSeatModel } from '../../../../models/reserveSeat';
	import { XMark } from 'svelte-heros-v2';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { createEventDispatcher } from 'svelte';
	import { LL } from '$lib/i18n/i18n-svelte';

	export let supabase: SupabaseClient;

	const dispatch = createEventDispatcher();
	let reserveSeatData: ReserveSeatModel = {
		company_id: 0,
		exhibition_id: +$page.params.exhibitionId,
		object_id: 0,
		services: [],
		status: ReservationStatusEnum.PENDING
	};
	let objectDetail = $selectedSeat?.objectDetail;
	$: totalPrice = +$selectedSeat?.objectDetail?.price ?? 0;
	let servicesPrice: {
		serviceId: number;
		totalPrice: number;
	}[] = [];

	function countTotalPrice() {
		totalPrice = +objectDetail?.price;
		for (let price of servicesPrice) {
			totalPrice += price.totalPrice;
		}
	}
	function reserveThisSeat() {
		if (!$currentUser?.uid) {
			localStorage.setItem('reservedExhibitionId', $page.params.exhibitionId);
			goto('/login');
			return;
		}
		reserveSeatData.company_id = $currentUser.id;
		reserveSeatData.services = servicesPrice;
		reserveSeatData.object_id = $selectedSeat.id;
		dispatch('reserveSeat', reserveSeatData);
	}
</script>

<div class="h-full w-full">
	{#if $seatDataLoading}
		<div class="h-full w-full flex justify-center items-center">
			<Spinner size={'20'} />
		</div>
	{:else}
		<div class="flex 2xl:hidden w-full p-4 justify-end">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="p-2 hover:bg-slate-300 rounded-md cursor-pointer"
				on:click={() => addSelectedSeat(undefined)}
			>
				<XMark />
			</div>
		</div>
		<div class="w-full flex flex-col px-10 pb-6 justify-between items-center">
			<div class="w-full flex flex-col items-center">
				<p class="text-3xl font-bold" style="color: var(--lightPrimaryColor);">
					{$LL.reservation.description()}
				</p>
				<p class="py-4 text-center">{$selectedSeat?.objectDetail?.description}</p>
				<p class="text-3xl font-bold" style="color: var(--lightPrimaryColor);">
					{$LL.reservation.comment()}
				</p>
				<Textarea
					id="textarea-id"
					placeholder={$LL.reservation.comment_placeholder()}
					rows="5"
					class="my-3"
					bind:value={reserveSeatData.comment}
				/>
				<p class="text-3xl font-bold" style="color: var(--lightPrimaryColor);">
					{$LL.reservation.services.title()}
				</p>
				<div class="flex w-full justify-between py-4">
					<div class="w-full">
						<p>{$LL.reservation.services.free_services()}</p>

						<ul class="list-disc">
							{#each $selectedFreeSeatServices as freeService}
								<li>{freeService?.serviceDetail?.languages[0]?.title}</li>
							{/each}
						</ul>
					</div>
				</div>
				<div class="flex w-full justify-between py-4">
					<div class="w-full">
						<p>{$LL.reservation.services.paid_services()}</p>
						{#each $selectedPaidSeatServices as paidService}
							<div class="my-1 flex justify-between items-center flex-wrap">
								<p class=" text-xl">
									{paidService?.serviceDetail?.languages[0]?.title}
								</p>
								<div class="w-[150px]">
									<InputNumberButton
										on:numberChanged={(number) => {
											let servicePrice = servicesPrice.find(
												(service) => service.serviceId == paidService?.serviceDetail?.id
											);
											if (servicePrice) {
												if (+number.detail == 0) {
													servicesPrice = servicesPrice.filter(
														(service) => service.serviceId != paidService?.serviceDetail?.id
													);
												} else {
													servicePrice.totalPrice =
														+number.detail * +paidService?.serviceDetail?.price;
												}
											} else {
												servicesPrice.push({
													serviceId: paidService?.serviceDetail?.id,
													totalPrice: +number.detail * +paidService?.serviceDetail?.price
												});
												servicesPrice = [...servicesPrice];
											}
											countTotalPrice();
										}}
										serviceQuantity={paidService?.serviceDetail?.quantity}
									/>
								</div>
								<div
									class="bg-[#edeeec] min-h-12 py-2 min-w-32 border-[#dadddd] border-2 rounded-md flex flex-col justify-center items-center"
								>
									{#if paidService?.serviceDetail?.discount}
										<p class="text-sm" style="text-decoration: line-through;">
											{paidService.serviceDetail.price}IQD
										</p>
										<p class="text-xl font-bold">{paidService.serviceDetail.discount}IQD</p>
									{:else}
										<p class="text-xl font-bold">{paidService.serviceDetail.price}IQD</p>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="w-full">
				<div class="w-full h-[2px] bg-[var(--lightPrimaryColor)]" />
				<div class="w-full flex justify-between">
					<h1 class="text-2xl my-6">{$LL.reservation.total_price()}</h1>
					<h1 class="text-2xl my-6 font-bold">{totalPrice} $</h1>
				</div>
				<Button class="w-full py-4" on:click={reserveThisSeat}>{$LL.reservation.reserve()}</Button>
			</div>
		</div>
	{/if}
</div>
