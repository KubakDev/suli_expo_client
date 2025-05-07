<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import type { VideoModel } from '../../../../models/videoModel.js';
	import { videoStore } from '../../../../stores/videoStore.js';
	import Constants from '../../../../utils/constants.js';
	import { modelToItemModel } from '../../../../models/covertModel.js';
	import { videoCurrentThemeColors } from '../../../../stores/darkMode';
	import { Spinner } from 'flowbite-svelte';

	export let data;
	let video: VideoModel | undefined | null;
	let thumbnailUrl: string[];

	const youtubeRegex =
		/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

	async function getVideos() {
		video = await videoStore.getSingle($locale, data.supabase, $page.params.videoId);
		videoStore.get($locale, data.supabase, '1', 8, false);

		await thumbnailChanging();
	}

	$: {
		if ($locale) {
			getVideos();
		}
	}

	$: {
		if ($videoStore?.data) {
			thumbnailChanging();
		}
	}

	onMount(() => {
		getVideos();
	});

	async function thumbnailChanging() {
		if ($videoStore?.data) {
			thumbnailUrl = $videoStore.data.map((item) => {
				return `https://img.youtube.com/vi/${getYouTubeId(item?.link ?? '')}/hqdefault.jpg`;
			});
		}
	}

	// get the YouTube ID from the URL
	function getYouTubeId(url: string): string | null {
		const match = youtubeRegex.exec(url);

		return match ? match[1] : null;
	}
</script>

<section
	style="background-color: {$videoCurrentThemeColors.backgroundColor}; color: {$videoCurrentThemeColors.overlayBackgroundColor}"
	class="w-full"
>
	<div class="{Constants.page_max_width} mx-auto">
		{#if video}
			<div
				class="grid 3xl:grid-cols-3 xl:grid-cols-3 grid-cols-1 my-2 rounded-lg justify-center items-start content-center w-full gap-6 px-4 py-8"
			>
				<div class="flex-1 xl:col-span-2 col-span-1 w-full h-full z-0 xl:mt-10">
					<div class="rounded-lg shadow-lg overflow-hidden" 
					style="background-color: {$videoCurrentThemeColors.secondaryColor}; color: {$videoCurrentThemeColors.overlaySecondaryColor}">
						<!-- Video Player Section -->
						<div class="relative">
							<div class="w-full aspect-video lg:px-8 px-4">
								<VideoPlayer videoUrl={video.link} />
							</div>
						</div>

						<!-- Video Content -->
						<div class="lg:px-10 px-4 lg:pb-10 pb-4" style="background-color: {$videoCurrentThemeColors.secondaryColor}; color: {$videoCurrentThemeColors.overlaySecondaryColor}">
							<h1 class="text-2xl md:text-3xl font-bold mb-4" style="color: {$videoCurrentThemeColors.primaryColor}">{video.title}</h1>
							{#if video.long_description}
								<div class="mt-4 prose max-w-none dark:prose-invert">
									{@html video.long_description}
								</div>
							{/if}
						</div>
					</div>
				</div>
				
				{#if $videoStore && $videoStore.data.length > 0}
					<div class="xl:col-span-1 col-span-1 xl:p-2 w-full h-full xl:mt-10">
						<div class="sticky top-4 w-full">
							<RecentItems
								title={$LL.videos()}
								items={$videoStore.data
									.filter(item => item.id?.toString() !== $page.params.videoId)
									.map((video) => modelToItemModel(video))}
								pageType={'video'}
								youtubeThumbnail={thumbnailUrl}
							/>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<div class="w-full min-h-screen flex justify-center items-center">
				<Spinner size="12" />
			</div>
		{/if}
	</div>
</section>
