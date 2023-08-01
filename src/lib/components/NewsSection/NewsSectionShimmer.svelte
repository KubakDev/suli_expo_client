<script lang="ts">
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
				<TitleUi text={$LL.news()} />
			</div>
			<Button color="primary" class="w-32 rounded-md bg-primary text-black">See all</Button>
		</div>
		<div
			class="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center items-center {constants.section_margin_top}"
		>
			{#each [1, 2, 3] as n, i}
				<div
					class="h-96 bg-gray-300 rounded-md animate-pulse flex-1 min-w-10 max-w-96 overflow-hidden"
				>
					<div class="h-40 bg-gray-400 rounded-t-md w-128" />
				</div>
			{/each}
		</div>
	</section>
</div>
