<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '../../stores/currentUser';
	import type { PageData } from './$types';
	import { ReservationStatus, type Reservation } from '../../models/reservationModel';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import moment from 'moment';
	import { PencilSquare, ChevronLeft, ChevronRight } from 'svelte-heros-v2';
	import UpdateReserve from './updateReserve.svelte';
	import type { ExhibitionModel } from '../../models/exhibitionModel';
	import { ReservationStatusEnum } from '../../models/reserveSeat';
	import { Button, Modal, Toast } from 'flowbite-svelte';
	//@ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import SuccessLottieAnimation from '../exhibition/reserve/[exhibitionId]/successLottie.json';
	import { currentMainThemeColors } from '../../stores/darkMode';
	import { goto } from '$app/navigation';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { CloseCircleSolid } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';
	import LoadingExhibitionLottie from '../exhibition/reserve/[exhibitionId]/loadingExhibition.json';

	export let data: PageData;

	let successModal = false;
	let reservations: Reservation[] = [];
	let currentUserId = $currentUser.id;
	let openEditModal = false;
	let selectedExhibition: ExhibitionModel;
	let selectedReservation: Reservation;
	let selectedReservationId: number;
	let cancelReserveModal: boolean = false;
	let cancelReservationSuccessModal: boolean = false;
	let showNotification = false;
	let loading = false;
	onMount(async () => {
		await getAllReservationHistory();
	});
	async function getAllReservationHistory() {
		if (currentUserId) {
			loading = true;
			const response = await data.supabase
				.from('seat_reservation')
				.select(
					'*,exhibition(*,exhibition_languages(*),seat_layout(*,seat_privacy_policy_lang(*)))'
				)
				.eq('company_id', currentUserId)
				.order('created_at', { ascending: false });
			reservations = response.data as Reservation[];
			loading = false;
		}
	}
	$: {
		currentUserId = $currentUser.id;
		if (currentUserId) getAllReservationHistory();
	}
	function exhibitionName(reservation: Reservation) {
		let result = reservation?.exhibition?.exhibition_languages.find(
			(exhibition) => exhibition.language === $locale
		)?.title
			? reservation?.exhibition?.exhibition_languages.find(
					(exhibition) => exhibition.language === $locale
			  )?.title
			: reservation?.exhibition?.exhibition_languages.find(
					(exhibition) => exhibition.language === 'en'
			  )?.title
			? reservation?.exhibition?.exhibition_languages.find(
					(exhibition) => exhibition.language === 'en'
			  )?.title
			: '';
		return result;
	}
	async function updateReserveData(reservationData: any, reservedSeatData: any, areas: any) {
		showNotification = false;
		//  comment
		// if (!reservationData.file_url) {
		// 	showNotification = true;
		// 	return;
		// }

		data.supabase
			.from('seat_reservation')
			.update({
				exhibition_id: reservationData.exhibition_id,
				company_id: $currentUser.id,
				object_id: new Date().getTime(),
				comment: reservedSeatData.comment,
				reserved_areas: JSON.stringify(reservedSeatData.area),
				services: reservedSeatData.services,
				total_price: reservedSeatData.total_price,
				status: ReservationStatusEnum.PENDING,
				type: reservationData?.exhibition?.seat_layout[0]?.type,
				file_url: reservationData.file_url,
				extra_discount_checked: reservationData.extra_discount_checked,
				new_edit: true
			})
			.eq('id', reservationData.id)
			.then(async (response: any) => {
				await getAllReservationHistory();
				if (response.error) {
					alert('error ocuured');
					return;
				}
				let activeSeatLayout = reservationData?.exhibition?.seat_layout?.find(
					(seatLayout: any) => seatLayout.is_active == true
				);
			 	await data.supabase
					.from('seat_layout')
					.update({
						areas: JSON.stringify(areas)
					})
					.eq('id', activeSeatLayout.id)
					.then(() => {
						goto(`/exhibition/1`);
						successModal = true;
					});
			});
	}
	async function cancelReservation() {
		await data.supabase
			.from('seat_reservation')
			.update({ status: ReservationStatusEnum.REJECT, rejected_by_user: true })
			.eq('id', selectedReservation.id)
			.then((response) => {
				if (response.error) return;
				cancelReservationSuccessModal = true;

				setTimeout(() => {
					openEditModal = false;
					cancelReservationSuccessModal = false;
					getAllReservationHistory();
				}, 3000);
			});
	}


 function formatLocalDateTime(utcDateString: string) {
  const date = new Date(utcDateString);

  // Formatting the date as DD/MM/YYYY
  const localDate = date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Formatting the time as HH:MM:SS
  const localTime = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Switch to 24-hour format
  });

  return { localDate, localTime };
}

</script>
 
<Modal bind:open={cancelReservationSuccessModal}>
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
		<p class="font-bold">{$LL.reservation.pending.success()} </p>
	</div>
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
		<p class="font-bold">{$LL.reservation.reserveUpdated()}</p>
	</div>
</Modal>



{#if !openEditModal}
	{#if loading}
		<div class="flex justify-center min-h[calc(100vh - 120px)] w-full items-center">
			<LottiePlayer
				src={LoadingExhibitionLottie}
				autoplay={true}
				renderer="svg"
				background="transparent"
				height={500}
				width={500}
				loop={true}
			/>
		</div>
	{:else}
	
	
<div
	class="w-full flex justify-center items-center overflow-y-auto mb-4"
	style="max-height: calc(100vh);"
>
	<div class="flex h-screen justify-center py-12 w-full md:w-3/4 max-w-[1000px] px-4">
		<div class="w-full space-y-4">
			{#each reservations as reservation}
				<!-- Reservation Card -->
				<div
					class="my-4 py-4 w-full md:w-10/12 shadow-md min-h-[100px] rounded-lg flex flex-col md:flex-row justify-between md:px-8 items-center gap-6"
					style="background-color: {$currentMainThemeColors.secondaryColor}; color: {$currentMainThemeColors.overlaySecondaryColor};"
				>
					<!-- Exhibition Name -->
					<div class="w-full md:w-1/3 text-center md:text-left px-4 text-sm md:text-lg font-semibold">
						{exhibitionName(reservation)}
					</div>

					<!-- Reservation Date and Time -->
					<div class="w-full md:w-1/3 flex justify-center items-center flex-col md:flex-row md:justify-start md:items-center text-sm md:text-lg">
						<div class="text-center md:text-left">
							<p class="font-semibold">{formatLocalDateTime(reservation.created_at).localDate}</p>
							<p class="text-xs text-gray-500 dark:text-gray-300">
								{formatLocalDateTime(reservation.created_at).localTime}
							</p>
						</div>
					</div>

					<!-- Status Badge and Rejection Info -->
					<div class="w-full md:w-1/3 flex flex-col items-center md:items-end space-y-2">
						<div
							class="md:py-2 md:px-6 py-1 px-3 rounded-full text-sm md:text-md text-white flex justify-center items-center"
							style="background-color: {reservation.status === 'accept' ? 'green' : reservation.status === 'reject' ? 'red' : $currentMainThemeColors.primaryColor};"
						>
							{$LL.reservation.statuses[reservation.status]()}
						</div>

						{#if reservation?.rejected_by_user}
							<p class="text-sm text-gray-500 dark:text-gray-400">
								{$LL.reservation.RejectedByUser()}
							</p>
						{/if}
					</div>

					<!-- Edit Button -->
					<div
					class="cursor-pointer rounded-lg p-3 transition"
						on:click={() => {
							openEditModal = true;
							selectedExhibition = reservation.exhibition;
							selectedReservationId = reservation.id;
							selectedReservation = reservation;
						}}
					>
						<PencilSquare class="w-5 h-5" />
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

 {/if}

{:else}


 <div class="w-full flex justify-center items-center px-4 mt-0">
  <div
    class="flex flex-col justify-center items-center py-12 w-full md:w-3/4 max-w-[1500px] my-12 rounded-md shadow-xl"
    class:bg-gray-100="{selectedReservation.type !== 'AreaFields'}"
    class:bg-secondary="{selectedReservation.type === 'AreaFields'}"
    style="color: {$currentMainThemeColors.overlaySecondaryColor}"
  >
    <div class="flex justify-between w-full">
      <!-- Back Button -->
      <div
        class="cursor-pointer w-8 h-8 flex items-center justify-center rounded-md mx-4"
        style="background-color: #B27D00;"
        on:click={() => (openEditModal = false)}
      >
        {#if $locale === 'en'}
          <ChevronLeft class="w-5 h-5 text-white" />
        {:else}
          <ChevronRight class="w-5 h-5 text-white" />
        {/if}
      </div>

      <!-- Status and Cancel Button -->
      <div class="flex items-center gap-2 px-4">
        <div 
            class="px-3 py-1 text-xs rounded-full text-white"
            style="background-color: {selectedReservation.status === 'accept' 
                ? 'green' 
                : selectedReservation.status === 'reject' 
                ? 'red' 
                : $currentMainThemeColors.primaryColor};"
        >
            {selectedReservation.status==='accept' 
                ? $LL.reservation.statuses.accept() 
                : selectedReservation.status==='reject' 
                ? $LL.reservation.statuses.reject() 
                : $LL.reservation.statuses.pending()}
        </div>

        {#if selectedReservation.status === ReservationStatus.PENDING}
            <button
                class="px-3 py-1 text-xs text-red-500 border border-red-500 hover:bg-red-50 rounded-full focus:outline-none"
                on:click={() => (cancelReserveModal = true)}
            >
                {$LL.reservation.cancelReservation()}
            </button>
        {/if}
      </div>
    </div>

    <!-- Update Reservation Component -->
    <UpdateReserve
      data={selectedExhibition}
      supabase={data.supabase}
      locale={$locale}
      on:updateReserveSeat={(reserveData) => {
        updateReserveData(
          reserveData.detail.reservationData,
          reserveData.detail.reservedSeatData,
          reserveData.detail.areas
        );
      }}
      reservationData={selectedReservation}
    />
  </div>
</div>


	
{/if}
{#if showNotification}
	<Toast
		color="red"
		class="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-5"
		transition={fly}
	>
		<svelte:fragment slot="icon">
			<CloseCircleSolid class="w-5 h-5" />
			<span class="sr-only">Error icon</span>
		</svelte:fragment>

		{$LL.reservation.warning_message()}
	</Toast>
{/if}

<style>
	::-webkit-scrollbar {
		width: 0;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #888;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
