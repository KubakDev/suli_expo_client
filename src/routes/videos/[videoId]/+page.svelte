<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { page } from '$app/stores';
	import { DetailPage } from 'kubak-svelte-component';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../utils/constants';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import type { VideoModel } from '../../../models/videoModel';
	import { videoStore } from '../../../stores/videoStore';
	import { modelToItemModel } from '../../../models/covertModel';

	export let data;
	let video: VideoModel | undefined | null;

	async function getVideos() {
		video = await videoStore.getSingle($locale, data.supabase, $page.params.videoId);
		videoStore.get($locale, data.supabase);
	}

	onMount(() => {
		getVideos();
	});
</script>

<section class="dark:bg-slate-900 dark:text-white text-slate-950">
	{#if video}
		<div class=" items-start flex flex-col 3xl:flex-row justify-around">
			<div class="m-auto w-full 3xl:w-96 4xl:w-142 block h-0 lg:mt-0 mt-5 rounded-lg" />
			<div class="w-full bg-gray-50 {Constants.page_max_width} m-auto flex-1 my-10">
				<DetailPage videoId={video.link} long_description={video.long_description} />
			</div>

			{#if $videoStore}
				<RecentItems
					title={$LL.videos()}
					items={$videoStore.map((video) => modelToItemModel(video))}
					pageType={'videos'}
				/>
			{/if}
		</div>
	{/if}
</section>
