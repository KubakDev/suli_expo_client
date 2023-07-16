<script lang="ts">
	import { onMount } from 'svelte';
	import constants from '../../utils/constants';
	import TitleUi from './TitleUi.svelte';
	import { videoSectionStore } from '../../stores/videoSectionStore';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import VideoPlayer from './VideoPlayer.svelte';
	import { promoStore } from '../../stores/promoStore';
	import type { PromoModel } from '../../models/promoModel';

	export let supabase: any;
	$: {
		if ($locale) {
		 promoStore.get(supabase, $locale);
		}
	}

	onMount(async () => {
		await promoStore.get(supabase, $locale);
	});
</script>

{#if $promoStore && $promoStore.video.length > 0}
	<section class="{constants.section_padding_y} {constants.page_max_width} mx-auto">
		<div class="flex justify-center items-center pb-8">
			<TitleUi text={$LL.promo()} customClass=" dark:text-white text-secondary py-2" />
		</div>
		<div class="w-full">
			<VideoPlayer
				videoUrl={$promoStore.video[0].video_link || ''}
				thumbnailUrl={$promoStore.thumbnail || ''}
			/>
		</div>
	</section>
{:else}
	<div />
{/if}
