<script lang="ts">
	import type { NewsModel } from '../../models/newsModel';
	import { ImgSourceEnum } from '../../models/imgSourceEnum';
	import { onMount } from 'svelte';
	import newsUiStore, { getNewsUi } from '../../stores/ui/newsUi';
	import TitleUi from './TitleUi.svelte';
	import { Button } from 'flowbite-svelte';
	import Exhibition from './Exhibition.svelte';
	// import { MainCard } from 'suli/suliexpo-cards/MainCard.svelte';
	import logger from '../../utils/logger';
	import { goto } from '$app/navigation';
	import type { ExhibitionModel } from '../../models/exhibitionModel';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import constants from '../../utils/constants';

	export let exhibitions: ExhibitionModel[];
	export let supabase: any;
	onMount(async () => {});
	function openNews() {
		goto('/exhibitions');
	}
</script>

<section class="{constants.section_padding_y} {constants.page_max_width} m-auto">
	<div class="flex justify-between items-center">
		<div class="h-10 w-32" />
		<div class="">
			<TitleUi text={$LL.exhibition()} />
		</div>
		<Button on:click={openNews} color="primary" class="w-32 rounded-md bg-primary text-black"
			>See all</Button
		>
	</div>
	<div
		class="grid grid-cols-1 lg:grid-cols-2 gap-5 justify-items-center items-center {constants.section_margin_top}"
	>
		{#each exhibitions as exhibition, i}
			<Exhibition {exhibition} />
		{/each}
	</div>
</section>
