<script lang="ts">
	import DateRangePicker from 'svelte-daterangepicker/dist/components/DatePicker.svelte';
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import { Checkbox, Dropdown } from 'flowbite-svelte';

	import { ArrowDown, ArrowUp, ChevronDown } from 'svelte-heros-v2';
	import Constants from '../../utils/constants';
	import { newsStore } from '../../stores/newsStore';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { ExhibitionModel } from '../../models/exhibitionModel';

	let asc: boolean = false;
	export let supabase: SupabaseClient;
	export let page: string = '1';
	export let selectedExhibition: number[] = [];
	export let exhibitionData: ExhibitionModel[] = [];
	let calendarDate: {
		$D: number;
		$H: number;
		$L: string;
		$M: number;
		$W: number;
		$d: Date;
		$m: number;
		$ms: number;
		$s: number;
		$x: {};
		$y: number;
	}[] = [];

	async function changeOrder() {
		asc = !asc;
		newsStore.get($locale, supabase, page, undefined, asc, selectedExhibition);
	}
	async function filterByExhibition() {
		newsStore.get($locale, supabase, page, undefined, asc, selectedExhibition);
	}
	const filterByDate = function () {
		let startDate = calendarDate[0].$d;
		let endDate = calendarDate[1].$d;

		newsStore.get(
			$locale,
			supabase,
			page,
			undefined,
			asc,
			selectedExhibition,
			startDate.toISOString(),
			endDate.toISOString()
		);
	};
</script>

<div class="flex lg:flex-row flex-col w-full justify-center items-center mb-10 gap-4" dir="ltr">
	<div class="py-2 text-center w-full">
		{#if asc}
			<button
				on:click={changeOrder}
				class="btn-three flex w-full flex-row items-center justify-center p-2 rounded-lg bg-newsLightPrimaryColor dark:bg-newsDarkPrimaryColor"
			>
				<ArrowUp
					size="15"
					class="transition-all hover:animate-pulse text-newsLightBackgroundColor dark:text-newsDarkBackgroundColor"
				/>

				<span
					class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1 text-newsLightBackgroundColor dark:text-newsDarkBackgroundColor"
					>{$LL.ascending()}</span
				>
			</button>
		{:else}
			<button
				on:click={changeOrder}
				class="flex w-full flex-row items-center justify-center p-2 rounded-lg bg-newsLightPrimaryColor dark:bg-newsDarkPrimaryColor"
			>
				<ArrowDown
					size="15"
					class="transition-all hover:animate-pulse text-newsLightBackgroundColor dark:text-newsDarkBackgroundColor"
				/>
				<span
					class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1 text-newsLightBackgroundColor dark:text-newsDarkBackgroundColor"
					>{$LL.descending()}</span
				>
			</button>
		{/if}
	</div>
	<div class="w-full z-10">
		<button
			class="flex w-full flex-row items-center justify-center p-2 rounded-lg bg-newsLightPrimaryColor dark:bg-newsDarkPrimaryColor"
		>
			<span
				class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1 text-newsLightBackgroundColor dark:text-newsDarkBackgroundColor flex flex-row justify-between items-center w-full"
				>{$LL.filterByExhibition()}<ChevronDown /></span
			>
		</button>
		<Dropdown class="w-80 text-sm bg-lightBackgroundColor dark:bg-darkBackgroundColor rounded-lg">
			<div class="max-h-64 overflow-y-auto p-2 rounded-sm {Constants.scrollbar_layout}">
				{#each exhibitionData as exhibition}
					<li>
						<Checkbox
							on:change={filterByExhibition}
							bind:group={selectedExhibition}
							value={exhibition.id}
							class="border-b border-solid border-gray-300 w-full flex justify-start p-1 text-xs min-h-[50px] hover:bg-lightTransparentPrimaryColor hover:text-lightOverlayPrimaryColor rounded-md transition-all dark:hover:bg-darkTransparentPrimaryColor dark:hover:text-darkOverlayPrimaryColor dark:bg-darkPrimaryColor dark:text-darkOverlayPrimaryColor"
							>{exhibition.title}</Checkbox
						>
					</li>
				{/each}
			</div>
		</Dropdown>
	</div>
	<div class="w-full">
		<DateRangePicker
			bind:selected={calendarDate}
			range={true}
			format="DD-MM-YYYY"
			on:change={() => {
				filterByDate();
			}}
		>
			<button
				class="flex w-full flex-row items-center justify-center p-2 rounded-lg bg-newsLightPrimaryColor dark:bg-newsDarkPrimaryColor"
				><span
					class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1 text-newsLightBackgroundColor dark:text-newsDarkBackgroundColor"
					>{$LL.filterByDate()}</span
				></button
			>
		</DateRangePicker>
	</div>
</div>
