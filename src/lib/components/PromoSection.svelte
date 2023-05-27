<script lang="ts">
	import { onMount } from 'svelte';
	import constants from '../../utils/constants';
	import TitleUi from './TitleUi.svelte';
	import { videoSectionStore } from '../../stores/videoSectionStore';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import VideoPlayer from './VideoPlayer.svelte';

	export let supabase: any;
	$: {
		if ($locale) {
			videoSectionStore.get($locale, supabase);
		}
	}
</script>

<section class="{constants.section_padding_y} {constants.page_max_width} m-auto">
	<div class="flex justify-center items-center">
		<TitleUi text={$LL.promo()} />
	</div>
	<div class="w-full {constants.section_margin_top}">
		{#if $videoSectionStore}
			<VideoPlayer
				videoUrl={$videoSectionStore.video}
				thumbnailUrl={$videoSectionStore.thumbnail}
			/>
		{:else}
			<div />
		{/if}
	</div>
</section>
