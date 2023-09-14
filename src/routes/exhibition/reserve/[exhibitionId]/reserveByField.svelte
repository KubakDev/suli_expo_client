<script lang="ts">
	import InputNumberButton from '$lib/components/inputNumberButton.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { createEventDispatcher, onMount } from 'svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { Textarea, Button } from 'flowbite-svelte';
	import UploadFile from './uploadFile.svelte';

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
		pricePerMeter = data.seat_layout[0].price_per_meter;
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
			totalPrice += +seatArea.quantity * +pricePerMeter * +seatArea.area;
		});
	}
	function handleFileUpload(file: { detail: File }) {
		reservedSeatData.file = file.detail;
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
			<p class="mx-6 text-xl">price per each meter :{pricePerMeter}</p>
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
					{+pricePerMeter * +availableSeatArea.area} $
				</p>
				<p class="min-w-[120px] text-start text-xl font-medium justify-center flex my-2">
					{(reservedSeatData.area.find((area) => area.id == index)?.quantity ?? 0) *
						(+pricePerMeter * +availableSeatArea.area)}$
				</p>
			</div>
		{/each}
		<div class="w-full mt-6 border-t-2 border-[#e5e7eb] p-2 flex justify-end">
			<p class="min-w-[120px] text-start text-xl font-medium justify-center flex">
				{$LL.reservation.total_price()} : {totalPrice}$
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
			<UploadFile on:fileUpload={handleFileUpload} />
		</div>
		<Button on:click={reserveSeat} class="mx-2">
			{$LL.reservation.reserve()}
		</Button>
	</div>
</div>
