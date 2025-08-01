<script lang="ts">
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import DateRangePicker from 'svelte-daterangepicker/dist/components/DatePicker.svelte';
	import { Checkbox, Spinner } from 'flowbite-svelte';
	import { 
		IconArrowDown, 
		IconArrowUp, 
		IconChevronDown, 
		IconX,
		IconFilter,
		IconCalendar
	} from '@tabler/icons-svelte';
	import { newsStore } from '../../stores/newsStore';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { ExhibitionModel } from '../../models/exhibitionModel';
	import { currentMainThemeColors } from '../../stores/darkMode';

	let asc: boolean = false;
	export let supabase: SupabaseClient;
	export let page: string = '1';
	export let selectedExhibition: string[] = [];
	export let exhibitionData: ExhibitionModel[] = [];
	let calendarDate: any[] = [];
	let isDropdownOpen: boolean = false;

	let isLoading = true;
	let isFilterLoading = false;
	
	// Hover states for each button
	let sortHovered = false;
	let filterHovered = false;
	let dateHovered = false;
	let clearHovered = false;

	// Language-dependent direction
	let isRtl = false;
	$: isRtl = $locale === 'ar' || $locale === 'ckb';

	$: isLoading = exhibitionData.length === 0;

	let datePickerButtonClass = "flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold border rounded-md transition-all";
	$: datePickerButtonStyle = `
		--btn-hover-color: ${$currentMainThemeColors.primaryColor};
		color: ${$currentMainThemeColors.primaryColor}; 
		border-color: ${$currentMainThemeColors.primaryColor};
		background-color: transparent;
	`;
	$: datePickerSpinnerStyle = `color: ${$currentMainThemeColors.primaryColor};`;

	async function changeOrder() {
		isFilterLoading = true;
		asc = !asc;
		await newsStore.get($locale, supabase, page, undefined, asc, selectedExhibition);
		isFilterLoading = false;
	}

	async function filterByExhibition() {
		isFilterLoading = true;
		await newsStore.get($locale, supabase, page, undefined, asc, selectedExhibition);
		isFilterLoading = false;
	}

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	const filterByDate = async () => {
		if (calendarDate.length === 2) {
			isFilterLoading = true;
			let startDate = calendarDate[0].$d;
			let endDate = calendarDate[1].$d;

			await newsStore.get(
				$locale,
				supabase,
				page,
				undefined,
				asc,
				selectedExhibition,
				startDate.toISOString(),
				endDate.toISOString()
			);
			isFilterLoading = false;
		}
	};

	const clearFilters = async () => {
		isFilterLoading = true;
		selectedExhibition = [];
		calendarDate = [];
		await newsStore.get($locale, supabase, page);
		isFilterLoading = false;
	};
</script>


<!-- Filter UI -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-10" dir={isRtl ? 'rtl' : 'ltr'}>

	<!-- Sort Button -->
	<button
		on:click={changeOrder}
		on:mouseenter={() => sortHovered = true}
    	on:mouseleave={() => sortHovered = false}
		class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all"
		style="
        	color: {sortHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
        	border-color: {$currentMainThemeColors.primaryColor};
        	background-color: {sortHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
    	"
		title={asc ? $LL.ascending() : $LL.descending()}
		disabled={isFilterLoading}
	>
		{#if isFilterLoading}
			<Spinner size="4" style="color: {sortHovered ? '#fff' : $currentMainThemeColors.primaryColor};" />
		{:else if asc}
			<IconArrowUp size={16} />
		{:else}
			<IconArrowDown size={16} />
		{/if}
		<span>{$LL.sort()}</span>
	</button>

	<!-- Filter by Exhibition -->
	<div class="relative">
		<button
			on:click={toggleDropdown}
			on:mouseenter={() => filterHovered = true}
    		on:mouseleave={() => filterHovered = false}
			class="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold border rounded-md transition-all"
			style="
				color: {filterHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
				border-color: {$currentMainThemeColors.primaryColor};
				background-color: {filterHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
			"
			disabled={isFilterLoading}
		>
			{#if isFilterLoading}
				<Spinner size="4" style="color: {filterHovered ? '#fff' : $currentMainThemeColors.primaryColor};" />
			{:else}
				<IconFilter size={16} />
			{/if}
			<span>{$LL.filterByExhibition()}</span>
			<IconChevronDown size={16} />
		</button>

		<!-- Dropdown Panel -->
		{#if isDropdownOpen}
		<div class="absolute z-10 mt-2 w-full max-h-64 overflow-y-auto bg-white dark:bg-darkBackgroundColor border rounded-md shadow-lg p-2 space-y-1 text-sm" style="text-align: {isRtl ? 'right' : 'left'};">
			{#if isLoading}
				<div class="flex justify-center items-center h-20">
					<Spinner size="6" class="text-newsLightPrimaryColor dark:text-newsDarkPrimaryColor" />
				</div>
			{:else}
				{#each exhibitionData as exhibition}
					{#if exhibition.id !== undefined && exhibition.id !== null}
						<label class="flex items-center gap-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800" style="flex-direction: {isRtl ? 'row-reverse' : 'row'};">
							<input 
								type="checkbox"
								on:change={filterByExhibition}
								bind:group={selectedExhibition}
								value={exhibition.id.toString()}
								disabled={isFilterLoading}
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
							/>
							<span>{exhibition.title}</span>
						</label>
					{/if}
				{/each}
			{/if}
		</div>
		{/if}
	</div>

	<!-- Date Picker -->
	<div>
		<DateRangePicker
			bind:selected={calendarDate}
			range={true}
			format="DD-MM-YYYY"
			on:change={() => filterByDate()}
		>
			<button
				class="{datePickerButtonClass} date-picker-btn"
				style={datePickerButtonStyle}
				disabled={isFilterLoading}
			>
				{#if isFilterLoading}
					<Spinner size="4" style={datePickerSpinnerStyle} />
				{:else}
					<IconCalendar size={16} />
				{/if}
				<span>{$LL.filterByDate()}</span>
			</button>
		</DateRangePicker>
	</div>

	<!-- Clear Filters -->
	<button
		on:click={clearFilters}
		on:mouseenter={() => clearHovered = true}
    	on:mouseleave={() => clearHovered = false}
		class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all"
		style="
			color: {clearHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
			border-color: {$currentMainThemeColors.primaryColor};
			background-color: {clearHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
		"
		title="Clear Filters"
		disabled={isFilterLoading}
	>
		{#if isFilterLoading}
			<Spinner size="4" style="color: {clearHovered ? '#fff' : $currentMainThemeColors.primaryColor};" />
		{:else}
			<IconX size={16} />
		{/if}
		<span>{$LL.clearFilters()}</span>
	</button>
</div>

 <style>
	/* Custom hover style for date picker button */
	:global(.date-picker-btn:hover) {
		background-color: var(--btn-hover-color, var(--newsLightPrimaryColor)) !important;
		color: white !important;
	}
	:global(.date-picker-btn:hover svg), :global(.date-picker-btn:hover span) {
		color: white !important;
	}
</style>