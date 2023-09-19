<script lang="ts">
	import InputNumberButton from '$lib/components/inputNumberButton.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { createEventDispatcher, onMount } from 'svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { Textarea, Button, NumberInput, Modal } from 'flowbite-svelte';
	import moment from 'moment';
	import { currentUser } from '../../stores/currentUser';
	import { generateDocx } from '../../utils/generateContract';
	import type { Reservation } from '../../models/reservationModel';
	import { ReservationStatus } from '../../models/reservationModel';

	export let data: any;
	export let supabase: SupabaseClient;
	export let locale: string;
	export let reservationData: Reservation;

	const dispatch = createEventDispatcher();
	let defaultModal = false;
	let areas: {
		area: string;
		quantity: number;
	}[] = [];

	let totalPrice = 0;
	let pricePerMeter: number = 0;
	let discountedPrice: number = 0;
	let discountedDescription = '';
	let customAreaMeter: number = 0;
	let customAreaQuantity: number = 0;
	let preview_url: string = '';

	let reservedSeatData: {
		area: {
			id: number;
			area: string;
			quantity: number;
		}[];
		comment: string;
		file?: File;
	} = {
		area: [],
		comment: ''
	};
	let reservedAreas: any[] = [];
	onMount(() => {
		preview_url = `${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${
			data.seat_layout[0]?.excel_preview_url
		}`;

		pricePerMeter = data.seat_layout[0]?.price_per_meter;
		discountedPrice = data.seat_layout[0]?.discounted_price;

		discountedDescription =
			data.seat_layout[0]?.seat_privacy_policy_lang.find(
				(privacyLang: any) => privacyLang.language == locale
			).discount_description ??
			data.seat_layout[0]?.seat_privacy_policy_lang.find(
				(privacyLang: any) => privacyLang.language == 'en'
			).discount_description ??
			'';
		if (data?.seat_layout[0]?.areas) {
			areas = JSON.parse(data?.seat_layout[0]?.areas);
		}
		getCompanyReservedData();
	});

	async function getCompanyReservedData() {
		reservedAreas = JSON.parse(reservationData.reserved_areas);
		reservedSeatData = {
			area: JSON.parse(reservationData.reserved_areas),
			comment: reservationData.comment
		};
		let allReservedArea = reservedAreas.map((reservedArea) => {
			return reservedArea.area;
		});

		allReservedArea.map((area) => {
			let result = areas.find((x) => +x.area == +area);

			if (!result) {
				customAreaMeter = +area;
				customAreaQuantity = reservedAreas.find((x) => x.area == area).quantity;
			}
		});
	}
	function reserveSeat() {
		reservedSeatData.area.push({
			id: areas.length,
			area: customAreaMeter.toString(),
			quantity: customAreaQuantity
		});
		customAreaQuantity = 0;
		customAreaMeter = 0;
		dispatch('updateReserveSeat', reservedSeatData);
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
		totalPrice = 0;
		reservedSeatData.area.map((seatArea) => {
			totalPrice += +seatArea.quantity * +(discountedPrice ?? pricePerMeter) * +seatArea.area;
		});
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
			email: $currentUser.email
		};
		await supabase
			.from('contract_decode_files')
			.select('*')
			.eq('exhibition_id', data.id)
			.then(async (Response: any) => {
				generateDocx(Response.data[0].decoded_file, docxData);
			});
	}
	async function addCustomArea(number: number) {
		customAreaQuantity = number;
	}
	let selectedFile: any = null;
	let fileName = '';
	let fileError = false;

	function handleFileChange(event: any) {
		const file = event.target.files[0];
		if (file) {
			fileError = false;
			selectedFile = file;
			fileName = file.name;
		} else {
			fileError = true;
			selectedFile = null;
		}
	}

	function handleAddClick() {
		if (selectedFile) {
			reservedSeatData.file = selectedFile;
		} else {
		}
	}
</script>

<div class="w-full flex flex-col items-start p-10">
	<img
		src={import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL + '/' + data.image_map}
		alt="not found"
		class="w-full h-[500px] object-cover rounded-lg"
	/>
	<div class="border-[1px] border-[#787e89] w-full my-6" />
	<div class="w-full flex justify-center">
		<div class="w-full lg:w-8/12">
			<div class="w-full flex items-center my-8 justify-between">
				<p class=" text-3xl">{$LL.reservation.available_area()}</p>
				<p class="mx-6 text-xl">{$LL.reservation.price_per_each_meter()}:{pricePerMeter}</p>
			</div>
			<div>
				{#each areas as availableSeatArea, index}
					<div class="flex flex-wrap items-center my-2">
						<p class="min-w-[120px] text-start text-2xl font-medium my-2">
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
								disabled={true}
							/>
						</div>
						<p class="min-w-[120px] text-start text-xl font-medium lg:justify-center flex my-2">
							{+pricePerMeter * +availableSeatArea.area} $
						</p>
						<div class="lg:mx-4">
							<p
								class={`min-w-[120px] text-start text-xl font-medium justify-center flex my-2 ${
									discountedPrice ? 'line-through' : ''
								}`}
							>
								{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
									(+pricePerMeter * +availableSeatArea.area)}$
							</p>
							{#if discountedPrice}
								<p class="min-w-[120px] text-start text-xl font-medium justify-center flex my-2">
									{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
										(+discountedPrice * +availableSeatArea.area)}$
								</p>
							{/if}
						</div>
					</div>
				{/each}
				<div class="w-full mt-6 border-t-2 border-[#e5e7eb] p-2 flex justify-end" />
				<h2 class="text-lg">{$LL.reservation.manual_area()}</h2>
				<div class="flex flex-wrap items-center my-2">
					<div class="min-w-[120px] text-start text-2xl font-medium my-2">
						<div class="flex items-center">
							<NumberInput bind:value={customAreaMeter} class="max-w-[100px]" />
						</div>
					</div>
					<div class="mx-6 my-2">
						<InputNumberButton
							unlimited={true}
							on:numberChanged={(number) => {
								addCustomArea(+number.detail);
							}}
							disabled={true}
							number={customAreaQuantity}
						/>
					</div>
					<p class="min-w-[120px] text-start text-xl font-medium lg:justify-center flex my-2">
						{+pricePerMeter * customAreaMeter} $
					</p>
					<div class="lg:mx-4">
						<p
							class={`min-w-[120px] text-start text-xl font-medium justify-center flex my-2 ${
								discountedPrice ? 'line-through' : ''
							}`}
						>
							{customAreaQuantity * (+pricePerMeter * +customAreaMeter)}$
						</p>
						{#if discountedPrice}
							<p class="min-w-[120px] text-start text-xl font-medium justify-center flex my-2">
								{customAreaQuantity * (+discountedPrice * +customAreaMeter)}$
							</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="w-full mt-6 border-t-2 border-[#e5e7eb] p-2 flex justify-end">
				<p class="min-w-[120px] text-start text-xl font-medium justify-center flex">
					{$LL.reservation.total_price()} : {totalPrice}$
				</p>
			</div>
		</div>
	</div>
	<p class=" mt-8" style="color: var(--lightPrimaryColor);">
		<span class="text-2xl mx-2 text-red-600">*</span>{discountedDescription}
	</p>
	<p class="text-3xl font-bold mt-8" style="color: var(--lightPrimaryColor);">
		{$LL.reservation.comment()}
	</p>
	<Textarea
		id="textarea-id"
		placeholder={$LL.reservation.comment_placeholder()}
		rows="5"
		class="my-3"
		bind:value={reservedSeatData.comment}
		disabled={true}
	/>
	<div class="flex justify-end w-full mt-8">
		<div>
			<Button on:click={() => (defaultModal = true)} disabled={true}>Upload File</Button>
			<Modal title="Upload File" bind:open={defaultModal} autoclose>
				<div class="flex justify-center items-center">
					<img src={preview_url} alt="preview" class="bg-red-400 w-44 h-44 object-cover" />
				</div>
				<div>
					<!-- <UploadFile on:fileUpload={handleFileUpload} /> -->
					<div class="file-input flex flex-col gap-2 w-full justify-center items-center">
						<input
							type="file"
							name="file-input"
							id="file-input"
							class="file-input__input"
							accept=".xlsx, .xls, .xlsm"
							on:change={handleFileChange}
						/>
						<label class="file-input__label" for="file-input">
							<svg
								aria-hidden="true"
								focusable="false"
								data-prefix="fas"
								data-icon="upload"
								class="svg-inline--fa fa-upload fa-w-16"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
							>
								<path
									fill="currentColor"
									d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
								/>
							</svg>
							<span>Upload excel file</span></label
						>
						{#if !reservedSeatData?.file}
							<span class="text-red-600">required</span>
						{/if}

						<span> {fileName}</span>
					</div>
				</div>
				<svelte:fragment slot="footer">
					<Button on:click={handleAddClick} disabled={true}>Add</Button>
					<Button color="alternative" disabled={true}>Decline</Button>
				</svelte:fragment>
			</Modal>
		</div>

		<Button on:click={reserveSeat} class="mx-2" disabled={true}>
			{$LL.buttons.update()}
		</Button>
		<Button on:click={contractPreview} class="mx-2" color="alternative">
			{$LL.reservation.preview_contract()}
		</Button>
	</div>
</div>

<style>
	body {
		font-family: sans-serif;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
	}

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
		height: 16px;
		margin-right: 4px;
	}
</style>
