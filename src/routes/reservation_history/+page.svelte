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

	onMount(async () => {
		await getAllReservationHistory();
	});
	async function getAllReservationHistory() {
		if (currentUserId) {
			const response = await data.supabase
				.from('seat_reservation')
				.select(
					'*,exhibition(*,exhibition_languages(*),seat_layout(*,seat_privacy_policy_lang(*)))'
				)
				.eq('company_id', currentUserId)
				.order('created_at', { ascending: false });
			reservations = response.data as Reservation[];
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

		if (!reservationData.file_url) {
			showNotification = true;
			return;
		}
		data.supabase
			.from('seat_reservation')
			.update({
				exhibition_id: reservationData.exhibition_id,
				company_id: $currentUser.id,
				object_id: new Date().getTime(),
				comment: reservedSeatData.comment,
				reserved_areas: JSON.stringify(reservedSeatData.area),
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
		<p class="font-bold">{$LL.reservation.pending.success()}</p>
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
	<div
		class="w-full flex justify-center items-center overflow-y-auto"
		style="max-height: calc(100vh);"
	>
		<div class="flex h-screen justify-center py-12 w-full md:w-3/4 max-w-[1000px] px-4">
			<div class="w-full">
				{#each reservations as reservation}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class=" my-2 py-2 w-full md:w-10/12 shadow-sm min-h-[80px] rounded-lg flex justify-between md:px-10 items-center gap-3"
						style="background-color: {$currentMainThemeColors.secondaryColor}; color: {$currentMainThemeColors.overlaySecondaryColor}"
					>
						<div class="max-w-[120px] text-center px-2 md:max-w-full text-sm md:text-lg">
							{exhibitionName(reservation)}
						</div>
						<div class="flex flex-col justify-center items-center text-sm md:text-lg">
							{moment(reservation.created_at).format('DD/MM/YYYY')}
							<div>
								{moment(reservation.created_at).format('HH:MM:SS')}
							</div>
						</div>
						<div
							class={`${reservation.status} md:py-2 md:px-6 py-1 px-2 rounded-full text-sm md:text-md text-white flex justify-center items-center text-center`}
						>
							{$LL.reservation.statuses[reservation.status]()}
						</div>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div
							class="cursor-pointer hover:bg-gray-600 dark:hover:bg-gray-700 rounded-lg p-2.5"
							on:click={() => {
								openEditModal = true;
								selectedExhibition = reservation.exhibition;
								selectedReservationId = reservation.id;
								selectedReservation = reservation;
							}}
						>
							<PencilSquare />
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div class="w-full flex justify-center items-center px-4">
		<div
			class="flex flex-col min-h-screen justify-center items-center py-12 w-full md:w-3/4 max-w-[1500px] my-12 rounded-md shadow-xl"
			style="background-color: {selectedReservation.type == 'AreaFields'
				? $currentMainThemeColors.secondaryColor
				: '#f5f5f5'};color: {$currentMainThemeColors.overlaySecondaryColor}"
		>
			<div class="flex justify-between w-full">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="cursor-pointer rounded-lg p-2.5 -mt-6 mx-6"
					style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
					on:click={() => {
						openEditModal = false;
					}}
				>
					{#if $locale == 'en'}
						<ChevronLeft />
					{:else}
						<ChevronRight />
					{/if}
				</div>
				<div class="flex items-center -mt-6 px-6">
					<div class="mx-2 rounded-lg p-2.5 {selectedReservation.status}">
						{selectedReservation.status}
					</div>
					{#if selectedReservation.status == ReservationStatus.PENDING}
						<Button color="alternative" on:click={() => (cancelReserveModal = true)}
							>Cancel Reservation</Button
						>
					{/if}
				</div>
			</div>
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
