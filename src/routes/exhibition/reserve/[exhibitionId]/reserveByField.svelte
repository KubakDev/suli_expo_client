<script lang="ts">
	import InputNumberButton from '$lib/components/inputNumberButton.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { createEventDispatcher, onMount } from 'svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { Textarea, Button, NumberInput } from 'flowbite-svelte';
	import UploadFile from './uploadFile.svelte';
	import { currentUser } from '../../../../stores/currentUser';
	import { generateDocx } from '../../../../utils/generateContract';
	import moment from 'moment';

	export let data: any;
	export let supabase: SupabaseClient;
	export let locale: string;

	const dispatch = createEventDispatcher();

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
	});

	function reserveSeat() {
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
		totalPrice = 0;
		reservedSeatData.area.map((seatArea) => {
			totalPrice += +seatArea.quantity * +discountedPrice * +seatArea.area;
		});
	}
	function handleFileUpload(file: { detail: File }) {
		reservedSeatData.file = file.detail;
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
			id: $currentUser.id
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
							/>
						</div>
						<p class="min-w-[120px] text-start text-xl font-medium lg:justify-center flex my-2">
							{+pricePerMeter * +availableSeatArea.area} IQD
						</p>
						<div class="lg:mx-4">
							<p
								class={`min-w-[120px] text-start text-xl font-medium justify-center flex my-2 ${
									discountedPrice ? 'line-through' : ''
								}`}
							>
								{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
									(+pricePerMeter * +availableSeatArea.area)}IQD
							</p>
							{#if discountedPrice}
								<p class="min-w-[120px] text-start text-xl font-medium justify-center flex my-2">
									{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
										(+discountedPrice * +availableSeatArea.area)}IQD
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
						/>
					</div>
					<p class="min-w-[120px] text-start text-xl font-medium lg:justify-center flex my-2">
						{+pricePerMeter * customAreaMeter} IQD
					</p>
					<div class="lg:mx-4">
						<p
							class={`min-w-[120px] text-start text-xl font-medium justify-center flex my-2 ${
								discountedPrice ? 'line-through' : ''
							}`}
						>
							{customAreaQuantity * (+pricePerMeter * +customAreaMeter)}IQD
						</p>
						{#if discountedPrice}
							<p class="min-w-[120px] text-start text-xl font-medium justify-center flex my-2">
								{customAreaQuantity * (+discountedPrice * +customAreaMeter)}IQD
							</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="w-full mt-6 border-t-2 border-[#e5e7eb] p-2 flex justify-end">
				<p class="min-w-[120px] text-start text-xl font-medium justify-center flex">
					{$LL.reservation.total_price()} : {totalPrice}IQD
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
	/>
	<div class="flex justify-end w-full mt-8">
		<div>
			<UploadFile on:fileUpload={handleFileUpload} />
		</div>
		<Button on:click={reserveSeat} class="mx-2">
			{$LL.reservation.reserve()}
		</Button>
		<Button on:click={contractPreview} class="mx-2" color="alternative">
			{$LL.reservation.preview_contract()}
		</Button>
	</div>
</div>
