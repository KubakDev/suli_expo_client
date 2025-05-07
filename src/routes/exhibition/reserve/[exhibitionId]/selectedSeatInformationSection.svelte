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
	import { IconChevronRight, IconChevronLeft } from '@tabler/icons-svelte';

	export let supabase: SupabaseClient;
	export let objectId: number;
	const dispatch = createEventDispatcher();
	let reserveSeatData: ReserveSeatModel = {
		company_id: 0,
		exhibition_id: +$page.params.exhibitionId,
		object_id: 0,
		services: [],
		status: ReservationStatusEnum.PENDING,
		total_price: 0
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
	let isThisObjectHasAPendingStatusForThisCompany: boolean = false;
	let cancelReserveModal = false;
	let successModal = false;
	let objectReservedByThisCompanyData: any = undefined;
	let buttonHovered = false;
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
					isThisObjectHasAPendingStatusForThisCompany = response.data.find(
						(item) => item.status == ReservationStatusEnum.PENDING
					)
						? true
						: false;
					objectReservedByThisCompanyData = response.data.find(
						(item) => item.status == ReservationStatusEnum.PENDING
					);
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
		reserveSeatData.total_price = totalPrice;
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

<div class="h-full w-full flex flex-col">
	{#if $totalReservedSeat}
		<div class="flex-none p-4">
			<p class="text-center my-2 text-[#e1b147] font-medium text-xl">
				{$LL.reservation.total_company_reserve()}
			</p>
			<p class="text-center my-2 text-[#e1b147] font-bold text-xl">{$totalReservedSeat}</p>
		</div>
	{/if}

	{#if $seatDataLoading}
		<div class="h-full w-full flex justify-center items-center">
			<Spinner size={'20'} />
		</div>
	{:else}
		<div class="flex-none flex 2xl:hidden w-full p-4 justify-end">
			<div
				class="p-2 hover:bg-slate-300 rounded-md cursor-pointer"
				on:click={() => addSelectedSeat(undefined)}
			>
				<XMark />
			</div>
		</div>

		<div class="flex-1 flex flex-col px-4 overflow-hidden">
			<div class="flex-none">
				<p class="text-lg font-bold mb-1" style="color: var(--lightPrimaryColor);">
					{$LL.reservation.description()}
				</p>
				<p class="py-1 text-sm text-center">
					{$selectedSeat?.objectDetail?.description ?? descriptionLanguage() ?? ''}
				</p>
				<p class="text-lg font-bold mb-1" style="color: var(--lightPrimaryColor);">
					{$LL.reservation.comment()}
				</p>
				<Textarea
					id="textarea-id"
					placeholder={$LL.reservation.comment_placeholder()}
					rows="2"
					class="mb-2 text-sm"
					bind:value={reserveSeatData.comment}
				/>
			</div>

			<div class="flex-1 overflow-y-auto min-h-0">
				<p class="text-base md:text-lg font-bold mb-2" style="color: var(--lightPrimaryColor);">
					{$LL.reservation.services.title()}
				</p>
				<div class="space-y-2">
					{#each $selectedPaidSeatServices as paidService}
						<div class="service-item">
							<div class="flex justify-start items-center">
								<img
									src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${
										paidService?.serviceDetail?.icon
									}`}
									alt="image of service"
									class="w-8 h-8 md:w-10 md:h-10 object-cover rounded"
								/>
								<p class="text-sm md:text-base mx-2">
									{paidService?.serviceDetail?.languages[0]?.title}
								</p>
							</div>
							<div class="my-1 flex justify-between gap-2 items-center">
								<div class="bg-[#edeeec] min-h-8 md:min-h-10 py-1 lg:w-1/2 border-[#dadddd] border-2 rounded-md flex flex-col justify-between px-2 items-center w-full my-1 md:my-2">
									<div class="flex flex-col justify-start items-center">
										{#if paidService?.serviceDetail?.discount}
											<p class="text-[10px] md:text-xs" style="text-decoration: line-through;">
												{paidService.serviceDetail.price}$
											</p>
											<p class="text-xs md:text-sm font-bold">{paidService.serviceDetail.discount}$</p>
										{:else}
											<p class="text-xs md:text-sm font-bold">
												{paidService.serviceDetail.price} $
											</p>
										{/if}
									</div>
									<div>
										{#if paidService.maxFreeCount > 0}
											<p class="text-[10px] md:text-xs">
												{$LL.reservation.lessThan()}
												<span class="text-[#e1b168] font-bold text-xs md:text-sm mx-1">
													{paidService.maxFreeCount + 1}
												</span>
												{$LL.reservation.isFree()}
											</p>
										{/if}

										{#if paidService.unlimitedFree}
											<p class="text-[#e1b168] font-bold text-xs md:text-sm mx-1">
												{$LL.reservation.free()}
											</p>
										{/if}
									</div>
								</div>
								<div class="lg:w-1/2 w-full">
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
												countTotalPrice();
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
												countTotalPrice();
											}
										}}
										serviceQuantity={paidService?.serviceDetail?.quantity}
										maxQuantityPerUser={paidService?.maxQuantityPerUser}
									/>
								</div>
							</div>
							<div class="border-b w-full my-3 md:my-5" />
						</div>
					{/each}
				</div>
			</div>

			<div class="flex-none mt-2 border-t pt-2">
				<div class="w-full flex justify-between items-center mb-2">
					<h1 class="text-base">{$LL.reservation.total_price()}</h1>
					<h1 class="text-lg font-bold">{totalPrice} $</h1>
				</div>
				{#if thisObjectReservedByThisCompany && isThisObjectHasAPendingStatusForThisCompany}
					<p class="text-center leading-8">
						{$LL.reservation.pending.description()}
						<span class="pending mx-1 p-1 rounded-md text-white">
							{$LL.reservation.pending.status()}
						</span>
						{#if isThisObjectHasAPendingStatusForThisCompany}
							<span>
								{$LL.reservation.pending.click()}
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
					<button
						on:click={reserveThisSeat}
						on:mouseenter={() => buttonHovered = true}
						on:mouseleave={() => buttonHovered = false}
						class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all w-full"
						style="
							color: {buttonHovered ? '#fff' : 'var(--lightPrimaryColor)'}; 
							border-color: var(--lightPrimaryColor);
							background-color: {buttonHovered ? 'var(--lightPrimaryColor)' : 'transparent'};
						"
					>
						{$LL.reservation.reserve()}
						{#if $locale === 'en'}
							<IconChevronRight size={16} />
						{:else}
							<IconChevronLeft size={16} />
						{/if}
					</button>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.overflow-y-auto {
		scrollbar-width: thin;
		scrollbar-color: #e1b168 transparent;
	}

	.overflow-y-auto::-webkit-scrollbar {
		width: 6px;
	}

	.overflow-y-auto::-webkit-scrollbar-track {
		background: transparent;
	}

	.overflow-y-auto::-webkit-scrollbar-thumb {
		background-color: #e1b168;
		border-radius: 3px;
	}

	.service-item {
		min-height: fit-content;
		font-size: 14px;
	}

	@media (max-width: 768px) {
		.service-item {
			font-size: 12px;
		}
	}
</style>
