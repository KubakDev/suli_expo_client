<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import Saos from 'saos';
	import { videoExhibitionStore } from '../../stores/videoExhibitionStore';
	import constants from '../../utils/constants';
	import TitleUi from './TitleUi.svelte';
	import SeeAllBtn from './SeeAllBtn.svelte';

	export let supabase: any;

	$: {
		//.info('locale changed %%%%%%%%%%%%%%%%%%');
		if ($locale) {
			//.info('locale changed #########', $locale);
			videoExhibitionStore.get($locale, supabase);
		}
	}

	onMount(async () => {
		videoExhibitionStore.get($locale, supabase);
	});

	function openNews() {
		goto('/news');
	}

	function DetailsPage(itemId: any) {
		goto(`/news/${itemId}`);
		//('news :', itemId);
	}
</script>

{#if $videoExhibitionStore && $videoExhibitionStore.length > 0}
	<section
		class="{constants.section_padding_y} {constants.page_max_width} m-auto {constants.horizontal_padding}"
	>
		<div class="flex flex-col items-center">
			<div>
				<TitleUi text={$LL.news()} />
			</div>
		</div>
		
		<div class="flex justify-end mb-4 mt-8">
			<SeeAllBtn onBtnClick={openNews} />
		</div>
		
		<div
			class="grid grid-cols-1 md:grid-cols-3 gap-5 justify-items-center items-center"
		>
			{#each $videoExhibitionStore as n, i}
				<a href="news/detail/{n.id}" class="w-full a-tag">
					<Saos
						animation="from-bottom {(i + 1) * 0.8 + 's'}  cubic-bezier(0.500, 0.5, 0.1, 1) both"
					>
						<ExpoCard
							cardType={CardType.Main}
							title={n.title}
							thumbnail={n.thumbnail}
							short_description={n.short_description}
						/>
					</Saos>
				</a>
			{/each}
		</div>
	</section>
{/if}

<style>
	@keyframes -global-from-bottom {
		0% {
			transform: translateY(100px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
