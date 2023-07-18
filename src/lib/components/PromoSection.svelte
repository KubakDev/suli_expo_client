<script lang="ts">
	import { onMount } from 'svelte';
	import constants from '../../utils/constants';
	import TitleUi from './TitleUi.svelte';
	import { videoSectionStore } from '../../stores/videoSectionStore';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import VideoPlayer from './VideoPlayer.svelte';
	import { promoStore } from '../../stores/promoStore';
	import type { PromoLanguagesModel, PromoModel } from '../../models/promoModel';
	import VideoSlider from './VideoSlider.svelte';

	export let supabase: any;
	let videos: string[] = [];
	$: {
		if ($locale) {
			promoStore.get(supabase, $locale);
		}
	}

	onMount(async () => {
		let data = await promoStore.get(supabase, $locale);

		if (data) {
			videos = data
				.map(function (item) {
					return item.video.map((video:PromoLanguagesModel) => video.video_link);
				})
				.flat();
		}
		console.log('videos', videos);
	});
</script>

{#if videos.length > 0}
	<section class="{constants.section_padding_y} {constants.page_max_width} mx-auto">
		<div class="flex justify-center items-center pb-8">
			<TitleUi text={$LL.promo()} />
		</div>
		<div class="w-full">
			{#if videos.length > 0}
				<VideoSlider {videos} />
			{/if}
		</div>
	</section>
{:else}
	<div />
{/if}
