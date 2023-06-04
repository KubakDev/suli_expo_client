<script lang="ts">
	import { onMount } from 'svelte';
	import newsUiStore, { getNewsUi } from '../../../stores/ui/newsUi';
	import TitleUi from '../TitleUi.svelte';
	import { goto } from '$app/navigation';
	import constants from '../../../utils/constants';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { newsSectionStore } from '../../../stores/newsSectionStore';
	import NewsSectionShimmer from './NewsSectionShimmer.svelte';
	import SeeAllBtn from '../SeeAllBtn.svelte';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import { stringToEnum } from '../../../utils/enumToString';

	export let supabase: any;
	let CardComponent: any;

	$: {
		//.info('locale changed %%%%%%%%%%%%%%%%%%');
		if ($locale) {
			//.info('locale changed #########', $locale);
			newsSectionStore.get($locale, supabase);
		}
	}

	onMount(async () => {
		getNewsUi(supabase).then(async (value) => {
			CardComponent = stringToEnum($newsUiStore?.component.title!, CardType);
			//(card);
		});
	});

	function openNews() {
		goto('/news');
	}

	function DetailsPage(itemId: any) {
		goto(`/news/${itemId}`);
		//('news :', itemId);
	}
</script>

{#if $newsSectionStore && $newsSectionStore.length > 0}
	<section
		class="{constants.section_padding_y} {constants.page_max_width} m-auto {constants.horizontal_padding}"
	>
		<div class="flex justify-between items-center">
			<div class="h-10 w-32" />
			<div class="">
				<TitleUi textColorDark="text-white" textColorLight="text-white" text={$LL.news()} />
			</div>
			<div class="flex justify-end w-32">
				<SeeAllBtn onBtnClick={openNews} />
			</div>
		</div>
		<div
			class="grid grid-cols-1 md:grid-cols-3 gap-5 justify-items-center items-center {constants.section_margin_top}"
		>
			{#each $newsSectionStore as n, i}
				{#if CardComponent && $newsUiStore}
					<div on:click={() => DetailsPage(n.id)}>
						<ExpoCard
							cardType={CardType.Main}
							title={n.title}
							thumbnail={n.thumbnail}
							short_description={n.short_description}
							primaryColor={'bg-primary'}
						/>
					</div>
				{:else}
					<div />
				{/if}
			{/each}
		</div>
	</section>
{:else}
	<NewsSectionShimmer />
{/if}
