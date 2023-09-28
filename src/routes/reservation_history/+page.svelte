<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '../../stores/currentUser';
	import type { PageData } from './$types';
	import type { Reservation } from '../../models/reservationModel';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import moment from 'moment';
	import { PencilSquare, ChevronLeft, ChevronRight } from 'svelte-heros-v2';
	import UpdateReserve from './updateReserve.svelte';
	import type { ExhibitionModel } from '../../models/exhibitionModel';
	import { ReservationStatusEnum } from '../../models/reserveSeat';
	import { Modal } from 'flowbite-svelte';
	//@ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import SuccessLottieAnimation from '../exhibition/reserve/[exhibitionId]/successLottie.json';

	export let data: PageData;

	let successModal = false;
	let reservations: Reservation[] = [];
	let currentUserId = $currentUser.id;
	let openEditModal = false;
	let selectedExhibition: ExhibitionModel;
	let selectedReservation: Reservation;
	let selectedReservationId: number;
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
	async function updateReserveData(reservationData: any, reservedSeatData: any) {
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
				extra_discount_checked: reservationData.extra_discount_checked
			})
			.eq('id', reservationData.id)
			.then(async (response: any) => {
				await getAllReservationHistory();
				if (response.error) {
					alert('error ocuured');
					return;
				}
				successModal = true;
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
		<p class="font-bold">{$LL.reservation.reserveUpdated()}</p>
	</div>
</Modal>
{#if !openEditModal}
	<div class="w-full flex justify-center items-center">
		<div class="flex h-screen justify-center py-12 w-full md:w-3/4 max-w-[1000px] px-4">
			<div class="w-full">
				{#each reservations as reservation}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="my-2 py-2 w-full md:w-10/12 border-2 border-gray-300 bg-white shadow-sm min-h-[80px] rounded-lg flex justify-between md:px-10 items-center gap-3"
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
							class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2.5"
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
			class="flex flex-col min-h-screen justify-center items-center py-12 w-full md:w-3/4 max-w-[1500px] my-12 bg-white rounded-md"
		>
			<div class="flex justify-start w-full">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-lg p-2.5 -mt-6 mx-6"
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
			</div>
			<UpdateReserve
				data={selectedExhibition}
				supabase={data.supabase}
				locale={$locale}
				on:updateReserveSeat={(reserveData) => {
					updateReserveData(
						reserveData.detail.reservationData,
						reserveData.detail.reservedSeatData
					);
				}}
				reservationData={selectedReservation}
			/>
		</div>
	</div>
{/if}

<style>
	.pending {
		background-color: #37d6ff;
	}
	.reject {
		background-color: #d91010;
	}
	.accept {
		background-color: #00bf2d;
	}
</style>
