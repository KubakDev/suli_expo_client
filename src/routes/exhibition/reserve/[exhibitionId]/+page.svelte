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
	import { CloseCircleSolid, ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { IconChevronRight, IconChevronLeft } from '@tabler/icons-svelte';

	export let data: any;

	let allFieldsPresent = false;
	let acceptedPrivacyPolicy = false;
	let defaultModal = false;
	let reserveSeatData: any;
	let exhibition: ExhibitionModel;
	let seatReserved = false;
	let loaded = false;
	let excelFileName: string | undefined = '';
	let buttonHovered = false;
	let showWarningModal = false;
	let warningMessage = '';

	// Computed property to check if reserve button should be disabled
	$: isReserveButtonDisabled = !acceptedPrivacyPolicy || 
		(exhibition?.seat_layout[0]?.is_excel_required && (!reserveSeatData?.file || reserveSeatData?.file?.size === 0));
	


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



		// Check if file is required and validate file upload
		if (exhibition?.seat_layout[0]?.is_excel_required) {
			if (!reserveSeatData.file || reserveSeatData.file.size === 0) {
				warningMessage = $LL.Please_upload_excel_file();
				showWarningModal = true;
				return;
			}
		}

		let extension;
		if (reserveSeatData.file && reserveSeatData.file.size > 0) {
			extension = reserveSeatData.file.name.split('.').pop();
		}

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
			if (extension) {
				const response = await data.supabase.storage
					.from('file')
					.upload(`reserve/${getRandomTextNumber()}.${extension}`, reserveSeatData.file);

				fileUrl = response?.data?.path;
				// if (!fileUrl) {
				// 	alert('anUnknown error occurred while uploading the file. Please try again.');
				// 	return;
				// }
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
						extra_discount_checked: reserveSeatData.extraDiscountChecked,
						services: reserveSeatData.services,
						total_price: reserveSeatData.total_price
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
						file_url: fileUrl ?? '',
						services: reserveSeatData.services,
						total_price: reserveSeatData.total_price ? reserveSeatData.total_price : 0
					})
					.then(async (Response: any) => {
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
						}).then(() => {
							defaultModal = true;
						});
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
								<div class="flex flex-row">
									<div class="flex-1">
										{#if exhibition?.seat_layout}
											<ReserveByFieldComponent
												data={exhibition}
												supabase={data.supabase}
												locale={$locale}
												on:reserveSeat={(reserveData) => {
													defaultModal = true;
													reserveSeatData = reserveData.detail;
												}}
												on:showWarning={(warningData) => {
													warningMessage = warningData.detail.message;
													showWarningModal = true;
												}}
											/>
										{/if}
									</div>

									{#if $selectedSeat}
										<div
											class="pt-20 md:pt-0 2xl:hidden absolute bg-white rounded-xl h-screen w-screen md:w-full lg:w-5/6 right-0 top-0 md:top-auto md:right-auto"
											in:fly={{ x: 200, duration: 500 }}
											out:fly={{ x: -200, duration: 500 }}
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
								<p class="text-base font-medium">
									{$LL.reservation.reserved()}
								</p>
							</div>
						{:else}
							<div>
								<p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
									{getDescriptionDependOnLanguage() ?? ''}
								</p>
								<div class="mt-3 flex">
									<Checkbox
										class="cursor-pointer"
										checked={acceptedPrivacyPolicy}
										on:change={() => {
											acceptedPrivacyPolicy = !acceptedPrivacyPolicy;
										}}
									/>
									<span class="text-xs mx-2"> {$LL.reservation.afterUpload_message()}</span>
								</div>
							</div>
						{/if}

						<svelte:fragment slot="footer">
							{#if seatReserved}
								<div class=" w-full flex justify-end items-center">
									<button
										on:click={() => {
											goto('/exhibition/1');
										}}
										on:mouseenter={() => buttonHovered = true}
										on:mouseleave={() => buttonHovered = false}
										class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all"
										style="
											color: {buttonHovered ? '#fff' : 'var(--lightPrimaryColor)'}; 
											border-color: var(--lightPrimaryColor);
											background-color: {buttonHovered ? 'var(--lightPrimaryColor)' : 'transparent'};
										"
									>
										Ok
										{#if $locale === 'en'}
											<IconChevronRight size={16} />
										{:else}
											<IconChevronLeft size={16} />
										{/if}
									</button>
								</div>
							{:else}
								<div class=" w-full flex justify-end items-center">
									<button
										on:click={reserveSeat}
										disabled={isReserveButtonDisabled}
										on:mouseenter={() => buttonHovered = true}
										on:mouseleave={() => buttonHovered = false}
										class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all"
										style="
											color: {buttonHovered ? '#fff' : 'var(--lightPrimaryColor)'}; 
											border-color: var(--lightPrimaryColor);
											background-color: {buttonHovered ? 'var(--lightPrimaryColor)' : 'transparent'};
											opacity: {isReserveButtonDisabled ? '0.5' : '1'};
										"
									>
										{$LL.reservation.privacy_policy.accept()}
										{#if $locale === 'en'}
											<IconChevronRight size={16} />
										{:else}
											<IconChevronLeft size={16} />
										{/if}
									</button>
									<div class="w-[2px]" />
								</div>
							{/if}
						</svelte:fragment>
					</Modal>
				</section>
			{:else}
			 	<section class="w-full flex-1 overflow-x-hidden">
					<div class="px-0 lg:px-32 3xl:px-72 w-full">
						<div class="h-full w-full flex items-center flex-wrap bg-white p-4 mt-4 rounded">
							<div class="mx-2 rounded-xl w-full 2xl:w-[69%]">
								<div class="reservation-container">
									{#if exhibition?.seat_layout}
										<ReservationComponent
											data={exhibition?.seat_layout}
											supabase={data.supabase}
											locale={$locale}
										/>
									{/if}
								</div>
							</div>

							 <div class="hidden 2xl:flex h-[calc(100vh-200px)] rounded-xl py-4" style="width: 29%;">
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
									class="pt-20 md:pt-0 2xl:hidden absolute bg-white rounded-xl h-[calc(100vh-80px)] w-screen md:w-full lg:w-5/6 right-0 top-0 md:top-auto md:right-auto"
									in:fly={{ x: 200, duration: 500 }}
									out:fly={{ x: -200, duration: 500 }}
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
								<p class="text-base font-medium">
									{$LL.reservation.reserved()}
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
								<p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
									{getDescriptionDependOnLanguage() ?? 'Title'}
								</p>
								<div class="mt-3 flex">
									<Checkbox
										class="cursor-pointer"
										checked={acceptedPrivacyPolicy}
										on:change={() => {
											acceptedPrivacyPolicy = !acceptedPrivacyPolicy;
										}}
									/>
									<span class="text-xs mx-2"> {$LL.reservation.afterUpload_message()}</span>
								</div>
							</div>
						{/if}

						<svelte:fragment slot="footer">
							{#if seatReserved}
								<div class=" w-full flex justify-end items-center">
									<button
										on:click={() => {
											goto('/exhibition/1');
										}}
										on:mouseenter={() => buttonHovered = true}
										on:mouseleave={() => buttonHovered = false}
										class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all"
										style="
											color: {buttonHovered ? '#fff' : 'var(--lightPrimaryColor)'}; 
											border-color: var(--lightPrimaryColor);
											background-color: {buttonHovered ? 'var(--lightPrimaryColor)' : 'transparent'};
										"
									>
										Ok
										{#if $locale === 'en'}
											<IconChevronRight size={16} />
										{:else}
											<IconChevronLeft size={16} />
										{/if}
									</button>
								</div>
							{:else}
								<div class=" w-full flex justify-end items-center">
									<button
										on:click={reserveSeat}
										disabled={isReserveButtonDisabled}
										on:mouseenter={() => buttonHovered = true}
										on:mouseleave={() => buttonHovered = false}
										class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all"
										style="
											color: {buttonHovered ? '#fff' : 'var(--lightPrimaryColor)'}; 
											border-color: var(--lightPrimaryColor);
											background-color: {buttonHovered ? 'var(--lightPrimaryColor)' : 'transparent'};
											opacity: {isReserveButtonDisabled ? '0.5' : '1'};
										"
									>
										{$LL.reservation.privacy_policy.accept()}
										{#if $locale === 'en'}
											<IconChevronRight size={16} />
										{:else}
											<IconChevronLeft size={16} />
										{/if}
									</button>
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

{#if showWarningModal}
	<Modal bind:open={showWarningModal} size="xs" autoclose>
		<div class="text-center">
			<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				{warningMessage}
			</h3>
			<Button color="alternative" on:click={() => showWarningModal = false}>
				Ok
			</Button>
		</div>
	</Modal>
{/if}
<div />

<div class="my-10" />

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
		font-size: 12px;
		font-weight: 600;
		color: #fff;
		padding: 8px 10px;
		background-color: #e1b168;
		box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);
	}
	.file-input__label svg {
		height: 24px;
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

	.flex-1 {
		flex: 1;
		min-height: 0;
	}

	.file-input__label span.text-gray-600 {
		font-size: 14px;
	}

	.file-input__label span.text-gray-400 {
		font-size: 12px;
	}
</style>
