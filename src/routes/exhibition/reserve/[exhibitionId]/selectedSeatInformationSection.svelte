<script lang="ts">
	import { Button, Modal, Spinner, Textarea } from 'flowbite-svelte';
	import InputNumberButton from '$lib/components/inputNumberButton.svelte';
	import {
		addSelectedSeat,
		seatDataLoading,
		selectedFreeSeatServices,
		selectedPaidSeatServices,
		selectedSeat,
		totalReservedSeat
	} from './seatReservationStore';
	import { currentUser } from '../../../../stores/currentUser';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ReservationStatusEnum, type ReserveSeatModel } from '../../../../models/reserveSeat';
	import { XMark } from 'svelte-heros-v2';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { createEventDispatcher, onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	//@ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import SuccessLottieAnimation from './successLottie.json';

	export let supabase: SupabaseClient;
	export let objectId: number;
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
		quantity?: number;
		serviceDetail?: any;
	}[] = [];
	let selectedSeatObjectId: any = undefined;
	let thisObjectReservedByThisCompany: boolean = false;
	let thisObjectReservedByThisCompanyStatus: ReservationStatusEnum | undefined = undefined;
	let cancelReserveModal = false;
	let successModal = false;
	let objectReservedByThisCompanyData: any = undefined;
	$: {
		thisObjectReservedByThisCompany = false;
		if (objectId && selectedSeatObjectId != objectId) {
			selectedSeatObjectId = objectId;
			getPreviousCompanyReservationForThisObject();
		}
	}
	async function getPreviousCompanyReservationForThisObject() {
		await supabase
			.from('seat_reservation')
			.select('*')
			.eq('object_id', objectId)
			.eq('company_id', $currentUser.id)
			.then((response) => {
				if (response.data && response.data?.length > 0) {
					thisObjectReservedByThisCompany = true;
					thisObjectReservedByThisCompanyStatus = response.data[0].status;
					objectReservedByThisCompanyData = response.data[0];
				}
			});
	}
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
	function descriptionLanguage() {
		return $selectedSeat?.objectDetail?.descriptionLanguages?.find(
			(x: any) => x.language == $locale ?? 'en'
		)?.description;
	}
	async function cancelReservation() {
		await supabase
			.from('seat_reservation')
			.update({ status: ReservationStatusEnum.REJECT, rejected_by_user: true })
			.eq('id', objectReservedByThisCompanyData.id)
			.then((response) => {
				if (response.error) return;
				successModal = true;
				setTimeout(() => {
					goto('/exhibition/detail' + $page.params.exhibitionId);
				}, 3000);
			});
	}
</script>

<Modal bind:open={successModal}>
	<div class="flex justify-center">
		<LottiePlayer
			src={SuccessLottieAnimation}
			autoplay={true}
			renderer="svg"
			background="transparent"
			height={300}
			width={300}
		/>
	</div>
	<div class="w-full flex justify-center items-center">
		<p class="font-bold">{$LL.reservation.pending.success()}</p>
	</div>

	<svelte:fragment slot="footer">
		<div class=" w-full flex justify-end items-center">
			<Button
				on:click={() => {
					goto('/exhibition/detail' + $page.params.exhibitionId);
				}}>Ok</Button
			>
		</div>
	</svelte:fragment>
</Modal>

<Modal bind:open={cancelReserveModal} size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			{$LL.reservation.pending.confirmation()}
		</h3>
		<Button color="red" class="mr-2" on:click={cancelReservation}
			>{$LL.reservation.pending.yes()}</Button
		>
		<Button color="alternative">{$LL.reservation.pending.no()}</Button>
	</div>
</Modal>
<div class="h-full w-full" style="overflow-y: auto;">
	{#if $totalReservedSeat}
		<p class="text-center my-2 text-[#e1b147] font-medium text-xl">
			{$LL.reservation.total_company_reserve()}
		</p>
		<p class="text-center my-2 text-[#e1b147] font-bold text-xl mb-6">{$totalReservedSeat}</p>
	{/if}
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
				<p class="py-4 text-center">
					{$selectedSeat?.objectDetail?.description ?? descriptionLanguage() ?? ''}
				</p>
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
											let priceResult = paidService.serviceDetail.discount
												? +paidService.serviceDetail.discount
												: +paidService.serviceDetail.price;
											let freeCountResult = paidService.maxFreeCount ?? 0;
											let countPaidService = +number.detail - freeCountResult;
											if (countPaidService <= 0) countPaidService = 0;
											if (servicePrice) {
												if (+number.detail == 0) {
													servicesPrice = servicesPrice.filter(
														(service) => service.serviceId != paidService?.serviceDetail?.id
													);
												} else {
													servicePrice.totalPrice = paidService.unlimitedFree
														? 0
														: priceResult * countPaidService;
													servicePrice.quantity = +number.detail;
												}
											} else {
												let serviceDetailData = {
													discount: paidService.serviceDetail.discount,
													price: paidService.serviceDetail.price,
													quantity: paidService.serviceDetail.quantity,
													title: paidService.serviceDetail.languages[0].title,
													description: paidService.serviceDetail.languages[0].description
												};
												servicesPrice.push({
													serviceId: paidService?.serviceDetail?.id,
													totalPrice: paidService.unlimitedFree
														? 0
														: priceResult * countPaidService,
													quantity: +number.detail,
													serviceDetail: serviceDetailData
												});
												servicesPrice = [...servicesPrice];
											}

											countTotalPrice();
										}}
										serviceQuantity={paidService?.serviceDetail?.quantity}
										maxQuantityPerUser={paidService?.maxQuantityPerUser}
									/>
								</div>
								<div
									class="bg-[#edeeec] min-h-12 py-2 min-w-32 border-[#dadddd] border-2 rounded-md flex justify-between px-2 items-center w-full my-3"
								>
									<div class="flex flex-col justify-center items-center">
										{#if paidService?.serviceDetail?.discount}
											<p class="text-sm" style="text-decoration: line-through;">
												{paidService.serviceDetail.price}$
											</p>
											<p class="text-xl font-bold">{paidService.serviceDetail.discount}$</p>
										{:else}
											<p class="text-xl font-bold">{paidService.serviceDetail.price}$</p>
										{/if}
									</div>
									<div>
										{#if paidService.maxFreeCount > 0}
											<p class=" ">
												less <span class="text-[#e1b168] font-bold text-2xl mx-1">
													{paidService.maxFreeCount + 1}
												</span>
												is free
											</p>
										{/if}
									</div>
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
				{#if thisObjectReservedByThisCompany && thisObjectReservedByThisCompanyStatus == ReservationStatusEnum.PENDING}
					<p class="text-center leading-8">
						{$LL.reservation.pending.description()}
						<span class="{thisObjectReservedByThisCompanyStatus} mx-1 p-1 rounded-md text-white">
							{$LL.reservation.pending.status()}
						</span>
						{#if thisObjectReservedByThisCompanyStatus == ReservationStatusEnum.PENDING}
							<span>
								{$LL.reservation.pending.click()}
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<span
									class="text-[#1782ff] cursor-pointer"
									on:click={() => {
										cancelReserveModal = true;
									}}
								>
									{$LL.reservation.pending.here()}
								</span>
								{$LL.reservation.pending.to_cancel()}
							</span>
						{/if}
					</p>
				{:else}
					<Button class="w-full py-4" on:click={reserveThisSeat}>{$LL.reservation.reserve()}</Button
					>
				{/if}
			</div>
		</div>
	{/if}
</div>
