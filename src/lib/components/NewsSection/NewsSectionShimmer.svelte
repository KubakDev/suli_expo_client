<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import constants from '../../../utils/constants';
	import TitleUi from '../TitleUi.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';

	let news = [1, 2, 3];
</script>

<div>
	<section class="{constants.section_padding_y} {constants.page_max_width} m-auto">
		<div class="flex justify-between items-center">
			<div class="h-10 w-32" />
			<div class="">
				<TitleUi textColorDark="text-white" textColorLight="text-white" text={$LL.news()} />
			</div>
			<Button color="primary" class="w-32 rounded-md bg-primary text-black">See all</Button>
		</div>
		<div
			class="grid grid-cols-1 md:grid-cols-3 gap-5 justify-items-center items-center {constants.section_margin_top}"
		>
			{#each [1, 2, 3] as n, i}
				<div class="w-full h-96 bg-gray-300 rounded-md" />
			{/each}
		</div>
	</section>
</div>
