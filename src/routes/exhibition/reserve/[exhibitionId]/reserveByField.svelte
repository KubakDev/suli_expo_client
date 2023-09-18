<script lang="ts">
	import InputNumberButton from '$lib/components/inputNumberButton.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { createEventDispatcher, onMount } from 'svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { Textarea, Button, Modal, Fileupload } from 'flowbite-svelte';
	import UploadFile from './uploadFile.svelte';
	import imageCompression from 'browser-image-compression';

	export let data: any;
	export let supabase: SupabaseClient;
	export let locale: string;

	const dispatch = createEventDispatcher();
	let defaultModal = false;
	let areas: {
		area: string;
		quantity: number;
	}[] = [];

	let totalPrice = 0;
	let pricePerMeter: number = 0;
	let discountedPrice: number = 0;
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

	onMount(() => {
		preview_url = `${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${
			data.seat_layout[0]?.excel_preview_url
		}`;

		pricePerMeter = data.seat_layout[0]?.price_per_meter;
		discountedPrice = data.seat_layout[0]?.discounted_price;
		console.log(data.seat_layout[0]);

		if (data?.seat_layout[0]?.areas) {
			areas = JSON.parse(data?.seat_layout[0]?.areas);
		}
	});

	function reserveSeat() {
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
		totalPrice = 0;
		reservedSeatData.area.map((seatArea) => {
			totalPrice += +seatArea.quantity * +discountedPrice * +seatArea.area;
		});
	}

	function handleFileUpload(file: { detail: File }) {
		console.log(file.detail);
		reservedSeatData.file = file.detail;
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
			console.log('File added to reservedSeatData:', reservedSeatData);
			// Here you can add further logic if needed after adding the file to reservedSeatData
		} else {
			console.log('No file selected!');
		}
	}
</script>

<div class="w-full flex flex-col items-start p-10">
	<img
		src={import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL + '/' + data.image_map}
		alt="not found"
		class="w-full h-[500px] object-cover rounded-lg"
	/>
	<div>
		<div class="w-full flex items-center my-8 justify-between">
			<p class=" text-3xl">{$LL.reservation.available_area()}</p>
			<p class="mx-6 text-xl">{$LL.reservation.price_per_each_meter()}:{pricePerMeter}</p>
		</div>
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
					/>
				</div>
				<p class="min-w-[120px] text-start text-xl font-medium lg:justify-center flex my-2">
					{+pricePerMeter * +availableSeatArea.area} IQD
				</p>
				<p class="min-w-[120px] text-start text-xl font-medium justify-center flex my-2">
					{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
						(+pricePerMeter * +availableSeatArea.area)}IQD
				</p>
				<p class="min-w-[120px] text-start text-xl font-medium justify-center flex my-2">
					{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
						(+discountedPrice * +availableSeatArea.area)}IQD
				</p>
			</div>
		{/each}
		<div class="w-full mt-6 border-t-2 border-[#e5e7eb] p-2 flex justify-end">
			<p class="min-w-[120px] text-start text-xl font-medium justify-center flex">
				{$LL.reservation.total_price()} : {totalPrice}IQD
			</p>
		</div>
	</div>
	<p class="text-3xl font-bold mt-8" style="color: var(--lightPrimaryColor);">
		{$LL.reservation.comment()}
	</p>
	<Textarea
		id="textarea-id"
		placeholder={$LL.reservation.comment_placeholder()}
		rows="5"
		class="my-3"
		bind:value={reservedSeatData.comment}
	/>
	<div class="flex justify-end w-full mt-8">
		<div>
			<Button on:click={() => (defaultModal = true)}>Upload File</Button>
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
					<Button on:click={handleAddClick}>Add</Button>
					<Button color="alternative">Decline</Button>
				</svelte:fragment>
			</Modal>
		</div>

		<Button on:click={reserveSeat} class="mx-2">
			{$LL.reservation.reserve()}
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
