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
	<p class="mt-8 text-3xl mb-4">{$LL.reservation.available_area()}</p>
	{#each areas as availableSeatArea, index}
		<div class="flex flex-wrap items-center my-2">
			<p class="min-w-[120px] text-start text-2xl font-medium">
				{availableSeatArea.area}
				{$LL.reservation.measure.m()}
			</p>
			<div class="mx-6">
				<InputNumberButton
					on:numberChanged={(number) => {
						addAreaToReservedSeatData(index, +number.detail);
					}}
					serviceQuantity={availableSeatArea.quantity}
					maxQuantityPerUser={availableSeatArea.quantity}
				/>
			</div>
		</div>
	{/each}
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
