<script lang="ts">
	import InputNumberButton from '$lib/components/inputNumberButton.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { createEventDispatcher, onMount } from 'svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { Textarea, Button, NumberInput, Modal, Checkbox } from 'flowbite-svelte';
	import { currentUser } from '../../../../stores/currentUser';
	import { generateDocx } from '../../../../utils/generateContract';
	import moment from 'moment';
	export let data: any;
	export let supabase: SupabaseClient;
	export let locale: string;
	const dispatch = createEventDispatcher();
	import { Toast } from 'flowbite-svelte';
	import { CloseCircleSolid, FireOutline } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';

	let showNotification = false;
	let defaultModal = false;
	let areas: {
		area: string;
		quantity: number;
	}[] = [];
	let totalPrice = 0;
	let totalRawPrice = 0;
	let pricePerMeter: number = 0;
	let discountedPrice: number = 0;
	let discountedDescription = '';
	let extraDiscount = {
		description: '',
		price: 0
	};
	let customAreaMeter: number = 0;
	let customAreaQuantity: number = 0;
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
		extraDiscount.description =
			data.seat_layout[0]?.seat_privacy_policy_lang.find(
				(privacyLang: any) => privacyLang.language == locale
			).extra_discount_description ??
			data.seat_layout[0]?.seat_privacy_policy_lang.find(
				(privacyLang: any) => privacyLang.language == 'en'
			).extra_discount_description ??
			'';

		extraDiscount.price = data.seat_layout[0]?.extra_discount;

		if (data?.seat_layout[0]?.areas) {
			areas = JSON.parse(data?.seat_layout[0]?.areas);
		}
	});
	function reserveSeat() {
		if (!reservedSeatData?.file) {
			showNotification = true;
			setTimeout(() => {
				showNotification = false;
			}, 3000);
			return;
		}
		reservedSeatData.area.push({
			id: areas.length,
			area: customAreaMeter.toString(),
			quantity: customAreaQuantity
		});

		customAreaQuantity = 0;
		customAreaMeter = 0;
		dispatch('reserveSeat', reservedSeatData);
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
		calculateTotalPrice();
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
	function checkExtraDiscount() {
		extraDiscountChecked = !extraDiscountChecked;
		discountedPrice = extraDiscountChecked
			? extraDiscount.price
			: data.seat_layout[0]?.discounted_price;
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
</script>

<div class="w-full flex flex-col items-start p-10">
	<img
		src={import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL + '/' + data.image_map}
		alt="not found"
		class="w-full h-[200px] md:h-[500px] object-cover rounded-lg"
	/>
	<div class="border-[1px] border-[#787e89] w-full my-6" />
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
									class=" text-start text-md text-[#e1b168] md:text-xl font-medium justify-center flex my-2"
								>
									{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
										(+discountedPrice * +availableSeatArea.area)}$
								</p>
							{/if}
						</div>
					</div>
				{/each}
				<div class="w-full mt-6 border-t-2 border-[#e5e7eb] p-2 flex justify-end" />
				<h2 class="text-sm md:text-lg">{$LL.reservation.manual_area()}</h2>
				<p class="text-sm md:text-lg mt-1">
					زیاتر لە 36 مەتر ( پێویستە ڕوبەری دیاریکراو چەندجارەی 9 بێت بۆ نمونە 45م ، 54م ، 63م هتد..
					)
				</p>
				<div class="flex gap-2 justify-between items-center my-2">
					<div class=" text-start text-2xl font-medium my-2">
						<div class="flex items-center">
							<NumberInput
								bind:value={customAreaMeter}
								class="max-w-[60px] md:max-w-[100px]"
								on:input={() => {
									if (customAreaMeter < 0) {
										customAreaMeter = 0;
									}
									calculateTotalPrice();
								}}
							/>
						</div>
					</div>
					<div class=" my-2">
						<InputNumberButton
							unlimited={true}
							on:numberChanged={(number) => {
								addCustomArea(+number.detail);
							}}
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
								class=" text-start text-md text-[#e1b168] md:text-xl font-medium justify-center flex my-2"
							>
								{customAreaQuantity * (+discountedPrice * +customAreaMeter)}$
							</p>
						{/if}
					</div>
				</div>
			</div>
			<div class="w-full mt-6 border-t-2 border-[#e5e7eb] p-2 flex justify-end">
				<div class=" text-start text-md md:text-xl font-medium justify-center flex items-center">
					<div class="w-full mt-6 border-t-2 border-[#e5e7eb] p-2 flex justify-end">
						<p class="min-w-[120px] text-start text-xl font-medium justify-center flex">
							{$LL.reservation.total_price()} : {totalPrice}$
						</p>
					</div>
					<div class="mx-4">
						{#if discountedPrice || extraDiscountChecked}
							<p
								class="text-start justify-center flex my-2 line-through text-xs md:text-xl
							"
							>
								{totalRawPrice}$
							</p>
						{/if}

						<p
							class=" text-start text-md text-[#e1b168] md:text-xl font-medium justify-center flex my-2"
						>
							{totalPrice}$
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="w-full flex justify-center items-center">
		<div class="w-full lg:w-8/12 my-8">
			{#if extraDiscount.description}
				<div class="flex items-center mb-8">
					<Checkbox
						class="cursor-pointer"
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
		</div>
	</div>
	<p class="text-md md:text-2xl font-bold mt-8" style="color: var(--lightPrimaryColor);">
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
			<Button on:click={() => (defaultModal = true)} class="w-full md:w-auto md:my-0 my-1"
				>{$LL.reservation.upload_file()}</Button
			>
			<Modal title={$LL.reservation.upload_file()} bind:open={defaultModal} autoclose>
				<div class="flex justify-center items-center">
					{#if preview_url.length > 0}
						<img
							src={preview_url}
							alt="preview"
							class="bg-red-400 w-2/3 h-56 object-cover rounded"
						/>
					{:else}{/if}
				</div>

				<div class="file-input flex flex-col gap-2 w-full justify-center items-center">
					<input
						type="file"
						name="file-input"
						id="file-input"
						class="file-input__input"
						accept=".xlsx, .xls, .xlsm"
						on:change={handleFileChange}
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

					{#if selectedFile === null}
						<span class="text-red-600">{$LL.reservation.required_file()}</span>
					{/if}
				</div>

				<svelte:fragment slot="footer">
					<div class="flex gap-2">
						<Button on:click={handleAddClick}>
							{$LL.reservation.add_file()}
						</Button>
						<Button color="alternative">{$LL.reservation.cancel_file()}</Button>
					</div>
				</svelte:fragment>
			</Modal>
		</div>
		<Button on:click={reserveSeat} class="w-full md:w-auto md:mx-2 md:my-0 my-1">
			{$LL.reservation.reserve()}
		</Button>
		<Button
			on:click={contractPreview}
			class="w-full md:w-auto md:mx-2 md:my-0 my-1"
			color="alternative"
		>
			{$LL.reservation.preview_contract()}
		</Button>
	</div>
</div>

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
		color: #333; /* Adjust as needed */
		font-weight: 600;
		width: 66.67%; /* 2/3 of parent width */
		margin: 0 auto;
		transition: background-color 0.3s;
	}

	.file-input__label:hover {
		background-color: #f7f2f2;
	}
</style>
