<script lang="ts">
	import InputNumberButton from '$lib/components/inputNumberButton.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { createEventDispatcher, onMount } from 'svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { Textarea, Button, NumberInput, Modal, Checkbox } from 'flowbite-svelte';
	import moment from 'moment';
	import { currentUser } from '../../stores/currentUser';
	import { generateDocx } from '../../utils/generateContract';
	import type { Reservation } from '../../models/reservationModel';
	import { ReservationStatus } from '../../models/reservationModel';
	import { getRandomTextNumber } from '../../utils/getRandomText';
	import { convertNumberToWord } from '../../utils/numberToWordLang';
	import { currentMainThemeColors } from '../../stores/darkMode';
	export let data: any;
	export let supabase: SupabaseClient;
	export let locale: string;
	export let reservationData: Reservation;

	let totalRawPrice = 0;

	const dispatch = createEventDispatcher();
	let defaultModal = false;
	let areas: {
		area: string;
		quantity: number;
	}[] = [];
	let extraDiscount = {
		description: '',
		price: 0
	};
	let totalPrice = 0;
	let pricePerMeter: number = 0;
	let discountedPrice: number = 0;
	let discountedDescription = '';
	let customAreaMeter: number = 0;
	let customAreaQuantity: number = 1;
	let preview_url: string = '';
	let extraDiscountChecked = false;
	let reservedSeatData: {
		area: {
			id: number;
			area: string;
			quantity: number;
		}[];
		comment: string;
		file: string;
	} = {
		area: [],
		comment: '',
		file: ''
	};
	let reservedAreas: any[] = [];
	let currentActiveSeat = data.seat_layout.find((seat: any) => seat.is_active == true);

	onMount(() => {
		onMountData();
	});

	function onMountData() {
		preview_url = currentActiveSeat?.excel_preview_url;

		pricePerMeter = currentActiveSeat?.price_per_meter;
		discountedPrice = currentActiveSeat?.discounted_price;

		discountedDescription =
			currentActiveSeat?.seat_privacy_policy_lang.find(
				(privacyLang: any) => privacyLang.language == locale
			).discount_description ??
			currentActiveSeat?.seat_privacy_policy_lang.find(
				(privacyLang: any) => privacyLang.language == 'en'
			).discount_description ??
			'';
		extraDiscount.description =
			currentActiveSeat?.seat_privacy_policy_lang.find(
				(privacyLang: any) => privacyLang.language == locale
			).extra_discount_description ??
			currentActiveSeat?.seat_privacy_policy_lang.find(
				(privacyLang: any) => privacyLang.language == 'en'
			).extra_discount_description ??
			'';
		extraDiscount.price = currentActiveSeat?.extra_discount;
		extraDiscountChecked = reservationData.extra_discount_checked ?? false;
		if (extraDiscountChecked) {
			discountedPrice = extraDiscount.price;
		}
		areas = JSON.parse(currentActiveSeat.areas ?? '');

		getCompanyReservedData();
	}

	async function getCompanyReservedData() {
		reservedAreas = JSON.parse(reservationData.reserved_areas);
		reservedSeatData = {
			area: JSON.parse(reservationData.reserved_areas),
			comment: reservationData.comment,
			file: reservationData.file_url
		};

		let allReservedArea = reservedAreas.map((reservedArea) => {
			return reservedArea.area;
		});

		allReservedArea.map((area) => {
			let result = areas.find((x) => +x.area == +area);

			if (!result) {
				customAreaMeter = +area;
				customAreaQuantity = reservedAreas.find((x) => x.area == area).quantity;
				setTimeout(() => {
					reservedAreas = reservedAreas.filter((x) => x.area != area);
					reservedSeatData.area = reservedSeatData.area.filter((x) => x.area != area);
				}, 10);
			}
		});
		calculateTotalPrice();
	}
	function checkExtraDiscount() {
		extraDiscountChecked = !extraDiscountChecked;
		discountedPrice = extraDiscountChecked
			? extraDiscount.price
			: data.seat_layout[0]?.discounted_price;
		calculateTotalPrice();
	}
	type FileNameType = {
		lang: string;
		fileName: string;
	};

	let selectedFile: any = null;
	let fileName = '';
	let imageFile_excel: File | undefined;

	let fileName_excel: FileNameType[] | string = [];
	let fileError = false;
	let validFile = false;
	let errorMessage = '';

	// function handleFileChange(event: any) {
	// 	const file = event.target.files[0];

	// 	imageFile_excel = file;

	// 	const reader = new FileReader();

	// 	const randomText = getRandomTextNumber();
	// 	fileName_excel = `${randomText}_${file.name}`;

	// 	reader.readAsDataURL(file);
	// 	if (file) {
	// 		fileName = file.name;
	// 	} else {
	// 		selectedFile = null;
	// 	}
	// }

	function handleFileChange(event: any) {
		const file = event.target.files[0];
		fileError = true;
		validFile = false;
		selectedFile = null;
		errorMessage = 'File is required';

		if (file) {
			imageFile_excel = file;

			const fileExtension = file.name.split('.').pop().toLowerCase();
			const allowedExtensions = ['xls', 'xlsx', 'xlsm'];

			if (allowedExtensions.includes(fileExtension)) {
				const reader = new FileReader();

				const randomText = getRandomTextNumber();
				fileName_excel = `${randomText}_${file.name}`;
				reader.readAsDataURL(file);
				fileError = false;
				errorMessage = '';
				selectedFile = file;
				fileName = file.name;
				validFile = true;
			} else {
				selectedFile = null;
				errorMessage = 'Excel file required';
			}
		}
	}

	async function reserveSeat() {
		reservedSeatData.area.push({
			id: areas.length,
			area: customAreaMeter.toString(),
			quantity: customAreaQuantity
		});
		reservationData.extra_discount_checked = extraDiscountChecked;

		let reservedSeatArea = JSON.parse(reservationData.reserved_areas);

		reservedSeatArea.map((area: any) => {
			let existingSeatAreaIndex = areas.findIndex((x: any) => x.area == area.area);
			if (existingSeatAreaIndex > -1) {
				areas[existingSeatAreaIndex].quantity =
					+areas[existingSeatAreaIndex].quantity + +area.quantity;
			}
		});
		reservedSeatData.area.map((area: any) => {
			let existingSeatAreaIndex = areas.findIndex((x: any) => x.area == area.area);
			if (existingSeatAreaIndex > -1 && area.quantity > 0) {
				areas[existingSeatAreaIndex].quantity =
					areas[existingSeatAreaIndex].quantity - area.quantity;
			}
		});

		dispatch('updateReserveSeat', { reservedSeatData, reservationData, areas });

		setTimeout(() => {
			reservedSeatData.area.splice(reservedSeatData.area.length - 1, 1);
		}, 10);
	}

	async function handleAddClick() {
		try {
			const response = await supabase.storage
				.from('file')
				.upload(`reserve/${fileName_excel}`, imageFile_excel!);
			reservationData.file_url = response.data?.path ?? '';
		} catch (error) {}
	}

	function addAreaToReservedSeatData(index: number, number: number) {
		let reservedSeatArea = reservedSeatData.area.find((area) => area.id == index);
		if (reservedSeatArea) {
			if (number == 0) {
				reservedSeatData.area = reservedSeatData.area.filter((area) => area.id != index);
			} else {
				reservedSeatArea.quantity = number;
			}
		} else {
			reservedSeatData.area.push({
				id: index,
				area: areas[index].area,
				quantity: number
			});
		}
		reservedSeatData = { ...reservedSeatData };
		calculateTotalPrice();
	}

	async function contractPreview() {
		let reservedAreas = reservedSeatData.area?.map((data: any) => {
			let result = {
				id: data.id++,
				area: data.area,
				quantity: data.quantity,
				pricePerMeter: pricePerMeter,
				totalPrice: data.quantity * pricePerMeter,
				discountedPrice: +data.area * (discountedPrice ?? pricePerMeter)
			};
			return result;
		});
		if (customAreaQuantity) {
			reservedAreas.push({
				id: areas.length,
				area: customAreaMeter,
				quantity: customAreaQuantity,
				pricePerMeter: pricePerMeter,
				totalPrice: customAreaMeter * pricePerMeter,
				discountedPrice: customAreaMeter * (discountedPrice ?? pricePerMeter)
			});
		}
		let totalArea = 0;

		reservedAreas.map((area) => {
			totalArea += +area.area * +area.quantity;
		});
		let docxData = {
			company_name: $currentUser.company_name,
			address: $currentUser.address,
			phone_number: $currentUser.phone_number,
			manager_name: $currentUser.manager_name,
			passport_number: $currentUser.passport_number,
			working_field: $currentUser.working_field,
			areas: reservedAreas,
			date: moment(new Date()).format('DD/MM/YYYY'),
			id: $currentUser.id,
			email: $currentUser.email,
			pricePerMeter,
			totalArea,
			totalRawPrice,
			totalPrice,
			totalPriceText: convertNumberToWord(totalPrice, locale),
			totalRawPriceText: convertNumberToWord(totalRawPrice, locale),
			totalAreaText: convertNumberToWord(totalArea, locale)
		};
		await supabase
			.from('contract_decode_files')
			.select('*')
			.eq('exhibition_id', data.id)
			.eq('language', locale)
			.then(async (Response: any) => {
				generateDocx(Response.data[0].decoded_file, docxData);
			});
	}
	async function addCustomArea(number: number) {
		customAreaQuantity = number;
		calculateTotalPrice();
	}

	function calculateTotalPrice() {
		totalPrice = 0;
		reservedSeatData.area.map((seatArea) => {
			totalPrice += +seatArea.quantity * +(discountedPrice ?? pricePerMeter) * +seatArea.area;
		});
		totalPrice += customAreaMeter * customAreaQuantity * +(discountedPrice ?? pricePerMeter);
		totalRawPrice = 0;
		reservedSeatData.area.map((seatArea) => {
			totalRawPrice += +seatArea.quantity * pricePerMeter * +seatArea.area;
		});
		totalRawPrice += customAreaMeter * customAreaQuantity * pricePerMeter;
	}

	function exportFile(reservation: any) {
		window.open(
			import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_FILE_URL + '/' + reservation?.file_url
		);
	}
</script>

<div class="w-full flex flex-col items-start p-10">
	<img
		src={import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL + '/' + data.image_map}
		alt="not found"
		class="w-full h-[200px] md:h-[500px] object-cover rounded-lg"
	/>
	<div class="border-[1px] w-full my-6" />
	<div class="w-full flex justify-center">
		<div class="w-full lg:w-8/12">
			<div class="w-full flex items-center my-2 justify-between">
				<p class="text-sm md:text-3xl">{$LL.reservation.available_area()}</p>
				<p class="mx-6 text-sm md:text-xl">
					{$LL.reservation.price_per_each_meter()}:{pricePerMeter}$
				</p>
			</div>
			<div>
				{#each areas as availableSeatArea, index}
					{#if availableSeatArea.quantity && +availableSeatArea.quantity > 0}
						<div class="flex gap-2 justify-between items-center my-2">
							<p class=" text-start text-md md:text-2xl font-medium my-2">
								{availableSeatArea.area}
								{$LL.reservation.measure.m()}
							</p>
							<div class="mx-6 my-2">
								<InputNumberButton
									on:numberChanged={(number) => {
										addAreaToReservedSeatData(index, +number.detail);
									}}
									serviceQuantity={availableSeatArea.quantity}
									maxQuantityPerUser={availableSeatArea.quantity}
									number={reservedAreas.find((area) => area.id == index)?.quantity ?? 0}
									disabled={reservationData.status != ReservationStatus.PENDING}
								/>
							</div>
							<p
								class=" text-start text-sm md:text-xl font-medium lg:justify-center hidden md:flex my-2"
							>
								{+pricePerMeter * +availableSeatArea.area} $
							</p>
							<div class="lg:mx-4">
								<p
									class={` text-start text-sm md:text-xl justify-center flex my-2 ${
										discountedPrice ? 'line-through text-xs md:text-xl' : 'font-medium '
									}`}
								>
									{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
										(+pricePerMeter * +availableSeatArea.area)}$
								</p>
								{#if discountedPrice}
									<p
										class=" text-start text-md md:text-xl font-medium justify-center flex my-2"
										style="color:{$currentMainThemeColors.primaryColor}"
									>
										{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
											(+discountedPrice * +availableSeatArea.area)}$
									</p>
								{/if}
							</div>
						</div>
					{/if}
				{/each}
				<div class="w-full mt-6 border-t-2 p-2 flex justify-end" />
				<h2 class="text-sm md:text-lg">{$LL.reservation.manual_area()}</h2>
				<div class="flex gap-2 justify-between items-center my-2">
					<div class=" text-start text-2xl font-medium my-2">
						<div class="flex items-center">
							<NumberInput
								bind:value={customAreaMeter}
								class="max-w-[100px]"
								on:input={() => {
									if (customAreaMeter < 0) {
										customAreaMeter = 0;
									}
									calculateTotalPrice();
								}}
							/>
						</div>
					</div>
					<div class="my-2">
						<InputNumberButton
							unlimited={true}
							on:numberChanged={(number) => {
								addCustomArea(+number.detail);
							}}
							number={customAreaQuantity}
							disabled={reservationData.status != ReservationStatus.PENDING}
						/>
					</div>
					<p
						class=" text-start text-sm md:text-xl font-medium lg:justify-center hidden md:flex my-2"
					>
						{+pricePerMeter * customAreaMeter} $
					</p>
					<div class="lg:mx-4">
						<p
							class={` text-start text-sm md:text-xl justify-center flex my-2 ${
								discountedPrice ? 'line-through text-xs md:text-xl' : 'font-medium '
							}`}
						>
							{customAreaQuantity * (+pricePerMeter * +customAreaMeter)}$
						</p>
						{#if discountedPrice}
							<p
								class=" text-start text-md md:text-xl font-medium justify-center flex my-2"
								style="color:{$currentMainThemeColors.primaryColor}"
							>
								{customAreaQuantity * (+discountedPrice * +customAreaMeter)}$
							</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="w-full mt-6 border-t-2 p-2 flex justify-end">
				<div class=" text-start text-md md:text-xl font-medium justify-center flex items-center">
					<p class="min-w-[120px] text-start text-xl font-medium justify-center flex">
						{$LL.reservation.total_price()} :
					</p>
					<div class="mx-4">
						{#if discountedPrice}
							<p
								class="text-start justify-center flex my-2 line-through text-xs md:text-xl
							"
							>
								{totalRawPrice}$
							</p>
						{/if}

						<p
							class=" text-start text-md md:text-xl font-medium justify-center flex my-2"
							style="color:{$currentMainThemeColors.primaryColor}"
						>
							{totalPrice}$
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	{#if extraDiscount.description}
		<div class="flex items-center mb-8">
			<Checkbox
				class="cursor-pointer mx-1"
				on:change={checkExtraDiscount}
				checked={extraDiscountChecked}
			/>
			<p style="color: var(--lightPrimaryColor);">
				{extraDiscount.description}
			</p>
		</div>
	{/if}
	{#if discountedDescription}
		<p style="color: var(--lightPrimaryColor);">
			<span class="text-2xl mx-2 text-red-600">*</span>{discountedDescription}
		</p>
	{/if}
	<p
		class="text-md md:text-2xl font-bold mt-8"
		style="color:{$currentMainThemeColors.primaryColor}"
	>
		{$LL.reservation.comment()}
	</p>
	<Textarea
		id="textarea-id"
		placeholder={$LL.reservation.comment_placeholder()}
		rows="5"
		class="my-3"
		bind:value={reservedSeatData.comment}
	/>
	<div class="block md:flex justify-end w-full mt-8">
		<div class="w-full md:w-auto">
			<Button
				class="w-full md:w-auto md:my-0 my-1"
				on:click={() => (defaultModal = true)}
				style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
				disabled={reservationData.status != ReservationStatus.PENDING}
				>{$LL.reservation.upload_file()}</Button
			>
			<Modal title={$LL.reservation.upload_file()} bind:open={defaultModal} autoclose>
				<div class="flex justify-center items-center">
					{#if currentActiveSeat?.excel_preview_url}
						<img
							src={import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL +
								'/' +
								currentActiveSeat?.excel_preview_url}
							alt="thumbnail"
							class=" w-2/3 h-56 object-cover rounded"
						/>
					{:else}{/if}
				</div>

				<div class="file-input flex flex-col gap-2 w-full justify-center items-center">
					<input
						type="file"
						name="file-input"
						id="file-input"
						class="file-input__input"
						on:change={handleFileChange}
						accept=".xlsx, .xls, .xlsm"
					/>
					<label class="file-input__label flex items-center gap-2 cursor-pointer" for="file-input">
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
							<span> {fileName}</span>
						</div>
					</label>

					{#if reservationData.file_url === null}
						<span class="text-red-600">{$LL.reservation.required_file()}</span>
					{/if}

					{#if fileError}
						<span class="text-red-600">{$LL.reservation.short_message()}</span>
					{/if}

					<button
						class="mx-2 gap-2 bg-[#76BC58] p-2 rounded-xl flex justify-center items-center text-xs text-white"
						on:click={() => exportFile(reservationData)}
						style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
					>
						Download

						<svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white"
							><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
								id="SVGRepo_tracerCarrier"
								stroke-linecap="round"
								stroke-linejoin="round"
							/><g id="SVGRepo_iconCarrier"
								><path
									d="M24 12a5 5 0 0 1-5 5h-2v-1h2a3.99 3.99 0 0 0 .623-7.934l-.79-.124-.052-.798a5.293 5.293 0 0 0-10.214-1.57L8.17 6.59l-.977-.483A2.277 2.277 0 0 0 6.19 5.87a2.18 2.18 0 0 0-1.167.339 2.206 2.206 0 0 0-.98 1.395l-.113.505-.476.2A4 4 0 0 0 5 16h3v1H5a5 5 0 0 1-1.934-9.611 3.21 3.21 0 0 1 1.422-2.025 3.17 3.17 0 0 1 1.702-.493 3.268 3.268 0 0 1 1.446.34 6.293 6.293 0 0 1 12.143 1.867A4.988 4.988 0 0 1 24 12zm-11-1h-1v10.292l-2.646-2.646-.707.707 3.854 3.854 3.853-3.852-.707-.707L13 21.294z"
								/><path fill="none" d="M0 0h24v24H0z" /></g
							></svg
						>
					</button>
				</div>

				<svelte:fragment slot="footer">
					<div class="flex gap-2">
						<Button on:click={handleAddClick} disabled={!validFile}>
							{$LL.reservation.add_file()}
						</Button>
						<Button color="alternative">{$LL.reservation.cancel_file()}</Button>
					</div>
				</svelte:fragment>
			</Modal>
		</div>

		<Button
			on:click={reserveSeat}
			class="w-full md:w-auto md:mx-2 md:my-0 my-1"
			style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
			disabled={reservationData.status != ReservationStatus.PENDING}
		>
			{$LL.buttons.update()}
		</Button>
		<!-- <Button
			on:click={contractPreview}
			class="w-full md:w-auto md:mx-2 md:my-0 my-1"
			color="alternative"
		>
			{$LL.reservation.preview_contract()}
		</Button> -->
	</div>
</div>

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
