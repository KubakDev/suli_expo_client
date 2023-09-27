<script lang="ts">
	import { onMount } from 'svelte';
	import constants from '../../utils/constants';
	import TitleUi from './TitleUi.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { promoStore } from '../../stores/promoStore';
	import type { PromoLanguagesModel, PromoModel } from '../../models/promoModel';
	import VideoSlider from './VideoSlider.svelte';
	import { currentMainThemeColors } from '../../stores/darkMode';

	export let supabase: any;

	interface Video {
		title: string;
		video_link: string;
		thumbnail: string;
		element?: HTMLIFrameElement;
		playing?: boolean;
	}

	let videos: Video[] = [];
	$: {
		if ($locale) {
			getVideosData();
		}
	}

	onMount(async () => {
		await getVideosData();
	});

	const getVideosData = async function () {
		let data = await promoStore.get(supabase, $locale);

		if (data) {
			videos = data.map((video: any) => {
				return {
					title: video.title,
					video_link: video.video_link,
					thumbnail: video.thumbnail
				};
			});
		}
	};
</script>

{#if videos.length > 0}
	<section class="{constants.section_padding_y} {constants.page_max_width} mx-auto" dir="ltr">
		<div class="flex justify-center items-center pb-4">
			<TitleUi
				text={$LL.promo()}
				borderColor={$currentMainThemeColors.primaryColor}
				textColor={$currentMainThemeColors.overlayBackgroundColor}
			/>
		</div>
		<div class="w-full h-full">
			{#if videos.length > 0}
				<VideoSlider {videos} />
			{/if}
		</div>
	</section>
{:else}
	<div />
{/if}
