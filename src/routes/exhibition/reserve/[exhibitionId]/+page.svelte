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
	import { currentMainThemeColors } from '../../../../stores/darkMode';

	export let data: any;

	let allFieldsPresent = false;
	let acceptedPrivacyPolicy = false;
	let defaultModal = false;
	let reserveSeatData: any;
	let exhibition: ExhibitionModel;
	let seatReserved = false;
	let loaded = false;
	let excelFileName: string | undefined = '';

	async function getExhibition() {
		const response = await data.supabase
			.from('exhibition')
			.select(
				'*,languages:exhibition_languages(*),sections:exhibition_sections(*),seat_layout:seat_layout(*,seat_privacy_policy_lang(*))',
				{ count: 'exact' }
			)
			.eq('languages.language', $locale)
			.eq('id', $page.params.exhibitionId)
			.is('deleted_status', null)
			.single();
		let activeSeatLayout = response.data.seat_layout.find((x: any) => x.is_active == true);
		response.data.seat_layout[0] = activeSeatLayout;
		loaded = true;
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
	});

	async function reserveSeat() {
		let fileUrl = '';

		defaultModal = false;

		if (!reserveSeatData.file || reserveSeatData.file.size === 0) {
			alert('Please upload a non-empty Excel file before proceeding.');
			return;
		}
		let extention = reserveSeatData.file.name.split('.').pop();
		let existingSeatArea = JSON.parse(exhibition.seat_layout[0]?.areas);
		if (exhibition.seat_layout[0]?.type == SeatsLayoutTypeEnum.AREAFIELDS) {
			reserveSeatData.area.map((area: any) => {
				let existingSeatAreaIndex = existingSeatArea.findIndex((x: any) => x.area == area.area);
				if (existingSeatAreaIndex > -1) {
					existingSeatArea[existingSeatAreaIndex].quantity =
						existingSeatArea[existingSeatAreaIndex].quantity - area.quantity;
				}
			});
		}
		try {
			const response = await data.supabase.storage
				.from('file')
				.upload(`reserve/${getRandomTextNumber()}.${extention}`, reserveSeatData.file);

			fileUrl = response?.data?.path;
			if (!fileUrl) {
				alert('anUnknown error occurred while uploading the file. Please try again.');
				return;
			}

			if (exhibition.seat_layout[0].type == SeatsLayoutTypeEnum.AREAFIELDS) {
				await data.supabase
					.from('seat_reservation')
					.insert({
						exhibition_id: exhibition.id,
						company_id: $currentUser.id,
						object_id: new Date().getTime(),
						comment: reserveSeatData.comment,
						reserved_areas: JSON.stringify(reserveSeatData.area),
						status: ReservationStatusEnum.PENDING,
						type: exhibition.seat_layout[0].type,
						file_url: fileUrl,
						extra_discount_checked: reserveSeatData.extraDiscountChecked
					})
					.then(async () => {
						data.supabase
							.from('seat_layout')
							.update({
								areas: JSON.stringify(existingSeatArea)
							})
							.eq('id', exhibition.seat_layout[0].id)
							.then(async () => {
								defaultModal = true;
								seatReserved = true;
								selectedSeat.set(null);
								setTimeout(() => {
									goto('/exhibition/1');
								}, 3000);
								fetch('/api/seat/purchase', {
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
								}).then(() => {
									defaultModal = true;
								});
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
					});
			} else {
				await data.supabase
					.from('seat_reservation')
					.insert({
						exhibition_id: exhibition.id,
						company_id: $currentUser.id,
						object_id: reserveSeatData.object_id,
						comment: reserveSeatData.comment,
						status: ReservationStatusEnum.PENDING,
						type: exhibition.seat_layout[0].type,
						file_url: fileUrl,
						services: reserveSeatData.services
					})
					.then((Response: any) => {
						if (Response.error) {
							alert('unknown error occurred ');
							return;
						}
						defaultModal = true;
						seatReserved = true;
						selectedSeat.set(null);
						setTimeout(() => {
							goto('/exhibition/1');
						}, 3000);
					});
			}
		} catch (error) {
			alert('An error occurred while uploading the file. Please try again with difference file.');
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
			} catch (error) {}
		}
	}

	function onUploadExcelFile(event: any) {
		const file = event.target.files[0];
		// fileError = true;
		// validFile = false;
		// selectedFile = null;
		// errorMessage = 'File is required';

		if (file) {
			const fileExtension = file.name.split('.').pop().toLowerCase();
			const allowedExtensions = ['xls', 'xlsx', 'xlsm'];

			if (allowedExtensions.includes(fileExtension)) {
				reserveSeatData.file = file;
				excelFileName = file.name;
			} else {
				// errorMessage = 'Excel file required';
			}
		}
	}
</script>

{#if loaded}
	{#if exhibition && exhibition.seat_layout[0]}
		{#if allFieldsPresent}
			<div class="absolute w-full flex justify-end p-3" />
			{#if exhibition?.seat_layout[0]?.type == SeatsLayoutTypeEnum.AREAFIELDS}
				<section class="w-full flex-1 overflow-x-hidden">
					<div class="px-0 lg:px-32 3xl:px-72 w-full h-full">
						<div class="w-full h-full flex items-center 2xl:px-20 flex-wrap justify-center">
							<div
								class="min-h-3/4 mx-2 rounded-xl w-full max-w-[1500px] my-6"
								style="background-color: {$currentMainThemeColors.secondaryColor};color: {$currentMainThemeColors.overlaySecondaryColor}"
							>
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
										objectId={$selectedSeat.id}
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
										objectId={$selectedSeat.id}
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
										objectId={$selectedSeat.id}
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
								<p class="font-bold">
									The seat is reserved you have to wait until it will accepted
								</p>
							</div>
						{:else}
							{#if exhibition?.seat_layout[0]?.excel_preview_url}
								<div class="flex justify-center items-center">
									<img
										src={import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL +
											'/' +
											exhibition?.seat_layout[0]?.excel_preview_url}
										alt="preview"
										class="w-full lg:w-2/3 h-56 object-cover rounded"
									/>
								</div>
							{/if}
							<div class="file-input flex flex-col gap-2 w-full justify-center items-center">
								<input
									type="file"
									name="file-input"
									id="file-input"
									class="file-input__input"
									accept=".xlsx, .xls, .xlsm"
									on:change={onUploadExcelFile}
								/>
								<label
									class="file-input__label flex items-center gap-2 cursor-pointer"
									for="file-input"
								>
									<div class="flex flex-col gap-2 items-center justify-center w-full">
										<svg
											aria-hidden="true"
											focusable="false"
											data-prefix="fas"
											data-icon="upload"
											class="svg-inline--fa fa-upload fa-w-6"
											role="img"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 512 512"
										>
											<path
												fill="currentColor"
												d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
											/>
										</svg>
										<span class="text-gray-600">{$LL.reservation.upload_file()}</span>
										<span class="text-sm text-gray-400 font-normal"
											>{$LL.reservation.short_message()}</span
										>
										<span> {excelFileName}</span>
									</div>
								</label>
							</div>
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
									<Button on:click={reserveSeat} disabled={!acceptedPrivacyPolicy || !excelFileName}
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
		<div
			class="w-full flex justify-center items-center flex-col px-4 text-center"
			style="height: calc(100vh - 100px);"
		>
			<p class="text-2xl">
				{$LL.reservation.emptySeatMessage()}
			</p>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<p
				class="mt-2 cursor-pointer text-[#4b71fa]"
				on:click={() => {
					goto(`/exhibition/detail/${exhibition.id}`);
				}}
			>
				{$LL.reservation.gotoExhibition()}
			</p>
		</div>
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

<style>
	.file-input__input {
		width: 0.1px;
		height: 0.1px;
		opacity: 0;
		overflow: hidden;
		position: absolute;
		z-index: -1;
	}
	.file-input__label {
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		border-radius: 4px;
		font-size: 14px;
		font-weight: 600;
		color: #fff;
		font-size: 14px;
		padding: 10px 12px;
		background-color: #e1b168;
		box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);
	}
	.file-input__label svg {
		height: 30px;
		color: #ccc;
	}
	.file-display,
	.file-input__label {
		cursor: pointer;
		border: 2px dashed #ccc;
		border-radius: 4px;
		padding: 20px 22px;
		background-color: #cccccc60;
		text-align: center;
		color: #333;
		font-weight: 600;
		width: 100%;
		margin: 0 auto;
		transition: background-color 0.3s;
	}

	.file-input__label:hover {
		background-color: #f7f2f2;
	}

	@media (min-width: 640px) {
		.file-display,
		.file-input__label {
			width: 66.67%;
		}
	}
</style>
