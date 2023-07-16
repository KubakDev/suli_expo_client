<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';
	import Constants from '../../utils/constants';

	export let start_date: Date;
	export let end_date: Date;
    let result: number = 0;

	function countDays(start_date: Date, end_date: Date): number {

        start_date = new Date(start_date);
        end_date = new Date(end_date);

		// Get the number of milliseconds for each date
		let start_ms = start_date.getTime();
		let end_ms = end_date.getTime();

		// Calculate the difference in milliseconds
		let diff_ms = end_ms - start_ms;

		// Convert to days and return as an integer
		let diff_days = Math.floor(diff_ms / 86400000);
		return diff_days;
	}

	onMount(() => {
		console.log('start_date', start_date);
		console.log('end_date', end_date);
		console.log('countDays', countDays(start_date as Date, end_date as Date));
        result = countDays(start_date as Date, end_date as Date);
	});
</script>

<div class="dark:text-slate-300 flex sm:flex-row sm:justify-between flex-col justify-center items-center {Constants.page_max_width}">
	<span class="flex flex-col justify-center">
		<p class="text-center text-lg font-bold uppercase">Start Date</p>
        <p class="text-slate-800 font-bold text-lg">
            {moment(start_date).format('DD MMMM YYYY, h:mm:ss')}
        </p>
	</span>
	<span class="flex flex-col justify-center text-center text-2xl font-bold">
		<p class="text-center text-lg font-bold uppercase">Days</p>
        <p class="text-slate-900 font-extrabold text-3xl">
            {result}
        </p>
		</span
	>
	<span class="flex flex-col justify-center">
		<p class="text-center text-lg font-bold uppercase">End Date</p>
		<p class="text-slate-800 font-bold text-lg">
            {moment(start_date).format('DD MMMM YYYY, h:mm:ss')}
        </p>
        </span
	>
</div>
