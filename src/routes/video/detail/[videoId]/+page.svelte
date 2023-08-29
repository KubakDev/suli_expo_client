<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { page } from '$app/stores';
	import { DetailPage } from 'kubak-svelte-component';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import type { VideoModel } from '../../../../models/videoModel.js';
	import { videoStore } from '../../../../stores/videoStore.js';
	import Constants from '../../../../utils/constants.js';
	import { modelToItemModel } from '../../../../models/covertModel.js';

	export let data;
	let video: VideoModel | undefined | null;
	let thumbnailUrl: string[];

	const youtubeRegex =
		/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

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

	$:{
		if($videoStore?.data){
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
	class="dark:bg-slate-900 dark:text-white text-slate-950 {Constants.page_max_width} mx-auto w-full"
>
	{#if video}
		<div
			class="grid 3xl:grid-cols-3 grid-cols-2 mx-4 my-2 rounded-lg justify-center items-center content-center"
		>
			<div class="flex-1 my-10 mt-auto col-span-2 w-full h-full justify-start items-start">
				<VideoPlayer videoUrl={video.link} />
				<span class="flex justify-center">
					{video.title}
				</span>
				<span class="text-justify">
					{@html video.long_description}
				</span>
			</div>

			{#if $videoStore}
				<div class="3xl:col-span-1 p-2 col-span-2 ml-1 w-full">
					<RecentItems
						title={$LL.videos()}
						items={$videoStore.data.map((video) => modelToItemModel(video))}
						pageType={'video'}
						youtubeThumbnail={thumbnailUrl}
					/>
				</div>
			{/if}
		</div>
	{/if}
</section>
