<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { locale, LL } from '$lib/i18n/i18n-svelte';
	import type { ExhibitionModel } from '../../../../models/exhibitionModel';
	//@ts-ignore
	import ReservationComponent from './ReservationComponent.svelte';
	import SelectedSeatInformationSection from './selectedSeatInformationSection.svelte';
	import { selectedSeat } from './seatReservationStore';
	import NotSelectedObject from './notSelectedObject.svelte';
	import { Button, Checkbox, Modal, Toast } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	//@ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import SuccessLottieAnimation from './successLottie.json';
	import LoadingExhibitionLottie from './loadingExhibition.json';
	import { currentUser } from '../../../../stores/currentUser';
	import { SeatsLayoutTypeEnum } from './models/seatsLayoutTypeEnum';
	import ReserveByFieldComponent from './reserveByField.svelte';
	import { ReservationStatusEnum } from '../../../../models/reserveSeat';
	import { setExhibitionID, setRequiredFields } from '../../../../stores/requiredFieldStore';
	import { getRandomTextNumber } from '../../../../utils/getRandomText';

	export let data: any;

	let allFieldsPresent = false;
	let acceptedPrivacyPolicy = false;
	let defaultModal = false;
	let reserveSeatData: any;
	let exhibition: ExhibitionModel;
	let seatReserved = false;
	let loaded = false;

	async function getExhibition() {
		const response = await data.supabase
			.from('exhibition')
			.select(
				'*,languages:exhibition_languages(*),sections:exhibition_sections(*),seat_layout:seat_layout(*,seat_privacy_policy_lang(*))',
				{ count: 'exact' }
			)
			.eq('languages.language', $locale)
			.eq('id', $page.params.exhibitionId)
			.eq('seat_layout.is_active', true)
			.is('deleted_status', null)
			.single();
		// setTimeout(() => {
		loaded = true;
		// }, 3300);
		exhibition = response.data;
	}

	onMount(async () => {
		if (!data.session && !data.session?.user) {
			setTimeout(() => {
				goto('/login');
			}, 100);
			return;
		}
		await getExhibition();
		await getData();

		console.log('reserveSeatData', exhibition.seat_layout[0].type);
	});

	async function reserveSeat() {
		let fileUrl = '';
		seatReserved = true;
		defaultModal = false;

		if (!reserveSeatData.file || reserveSeatData.file.size === 0) {
			alert('Please upload a non-empty Excel file before proceeding.');
			return;
		}

		try {
			const response = await data.supabase.storage
				.from('file')
				.upload(
					`reserve/${getRandomTextNumber()}_${reserveSeatData.file.name}`,
					reserveSeatData.file
				);

			fileUrl = response?.data?.path;
			console.log('reserveSeatData File', fileUrl);

			if (exhibition.seat_layout[0].type == SeatsLayoutTypeEnum.AREAFIELDS) {
				console.log('reserveSeatData', reserveSeatData);

				await data.supabase.from('seat_reservation').insert({
					exhibition_id: exhibition.id,
					company_id: $currentUser.id,
					object_id: new Date().getTime(),
					comment: reserveSeatData.comment,
					reserved_areas: JSON.stringify(reserveSeatData.area),
					status: ReservationStatusEnum.PENDING,
					type: exhibition.seat_layout[0].type,
					file_url: fileUrl
				});

				selectedSeat.set(null);
				setTimeout(() => {
					goto('/exhibition/1');
				}, 3000);
				await fetch('/api/seat/purchase', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						emailUser: data?.session?.user?.email,
						name: '',
						message: '',
						exhibition: exhibition,
						companyData: $currentUser,
						reserveSeatData: reserveSeatData
					})
				});

				console.log('email sent');
				defaultModal = true;
			} else {
				await data.supabase.from('seat_reservation').insert(reserveSeatData);

				selectedSeat.set(null);
				setTimeout(() => {
					goto('/exhibition/1');
				}, 3000);
			}
		} catch (error) {
			console.error('Error during reservation process:', error);
			alert('An error occurred while reserving the seat. Please try again.');
			seatReserved = false;
		}
	}

	onDestroy(() => {
		localStorage.removeItem('redirect');
	});

	function getDescriptionDependOnLanguage() {
		return exhibition?.seat_layout[0]?.seat_privacy_policy_lang.find(
			(x: any) => x.language == $locale
		)?.description;
	}

	async function getData() {
		if (exhibition) {
			try {
				let response = await data.supabase
					.from('required_company_fields_exhibition')
					.select('*')
					.eq('exhibition_id', exhibition.id);

				if (!response.data || response.data.length < 0) {
					goto(`/exhibition/detail/${exhibition.id}`);
					return;
				}

				let requiredFields: string[] = response.data[0]?.fields;

				setRequiredFields(requiredFields);
				setExhibitionID(response.data[0]?.exhibition_id);

				allFieldsPresent = requiredFields?.every((field: any) => {
					return $currentUser[field] && $currentUser[field].trim() !== '';
				});
				if (response.data[0]?.fields) {
					if (response.data[0]?.fields && !allFieldsPresent) {
						let uid = $currentUser.uid;
						//
						goto(`/exhibition/reserve/register/${uid}`);
					}
				} else {
					allFieldsPresent = true;
				}

				// if (exhibition.seat_layout.length == 0) {
				// 	goto(`/exhibition/detail/${exhibition.id}`);
				// }
			} catch (error) {}
		}
	}
</script>

{#if loaded}
	{#if allFieldsPresent}
		<div class="absolute w-full flex justify-end p-3" />
		{#if exhibition?.seat_layout[0]?.type == SeatsLayoutTypeEnum.AREAFIELDS}
			<section class="w-full flex-1 overflow-x-hidden">
				<div class="px-0 lg:px-32 3xl:px-72 w-full h-full">
					<div class="w-full h-full flex items-center 2xl:px-20 flex-wrap justify-center">
						<div class="bg-[#f5f5f5] min-h-3/4 mx-2 rounded-xl w-full max-w-[1500px] my-6">
							{#if exhibition?.seat_layout}
								<ReserveByFieldComponent
									data={exhibition}
									supabase={data.supabase}
									locale={$locale}
									on:reserveSeat={(reserveData) => {
										defaultModal = true;
										reserveSeatData = reserveData.detail;
									}}
								/>
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

				<Modal title={$LL.reservation.privacy_policy.title()} bind:open={defaultModal}>
					{#if seatReserved}
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
							<p class="font-bold">{$LL.reservation.reserved()}</p>
						</div>
					{:else}
						<div>
							<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
								{getDescriptionDependOnLanguage() ?? ''}
							</p>
							<div class="mt-4 flex">
								<Checkbox
									class="cursor-pointer"
									checked={acceptedPrivacyPolicy}
									on:change={() => {
										acceptedPrivacyPolicy = !acceptedPrivacyPolicy;
									}}
								/>
								<span class="text-sm mx-2"> {$LL.reservation.privacy_policy.checked()} </span>
							</div>
						</div>
					{/if}

					<svelte:fragment slot="footer">
						{#if seatReserved}
							<div class=" w-full flex justify-end items-center">
								<Button
									on:click={() => {
										goto('/exhibition/1');
									}}>Ok</Button
								>
							</div>
						{:else}
							<div class=" w-full flex justify-end items-center">
								<Button on:click={reserveSeat} disabled={!acceptedPrivacyPolicy}
									>{$LL.reservation.privacy_policy.accept()}</Button
								>
								<div class="w-[2px]" />
							</div>
						{/if}
					</svelte:fragment>
				</Modal>
			</section>
		{:else}
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

				<Modal title={$LL.reservation.privacy_policy.title()} bind:open={defaultModal}>
					{#if seatReserved}
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
							<p class="font-bold">The seat is reserved you have to wait until it will accepted</p>
						</div>
					{:else}
						<div>
							<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
								{getDescriptionDependOnLanguage() ??
									'lorem ipsum dolor sit a met consectetur adipisicing elit'}
							</p>
							<div class="mt-4 flex">
								<Checkbox
									class="cursor-pointer"
									checked={acceptedPrivacyPolicy}
									on:change={() => {
										acceptedPrivacyPolicy = !acceptedPrivacyPolicy;
									}}
								/>
								<span class="text-sm"> i've read the privacy and privacy policy </span>
							</div>
						</div>
					{/if}

					<svelte:fragment slot="footer">
						{#if seatReserved}
							<div class=" w-full flex justify-end items-center">
								<Button
									on:click={() => {
										goto('/exhibition/1');
									}}>Ok</Button
								>
							</div>
						{:else}
							<div class=" w-full flex justify-end items-center">
								<Button on:click={reserveSeat} disabled={!acceptedPrivacyPolicy}
									>{$LL.reservation.privacy_policy.accept()}</Button
								>
								<div class="w-[2px]" />
							</div>
						{/if}
					</svelte:fragment>
				</Modal>
			</section>
		{/if}
	{/if}
{:else}
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
{/if}
