<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { UiStore } from '../../stores/ui/Ui';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../utils/constants';
	import { stringToEnum } from '../../utils/enumToString';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import { magazineStore } from '../../stores/magazineStore';
	import { getNameRegex } from '../../utils/urlRegexName';
	import { page } from '$app/stores';
	import { getPageType } from '../../utils/pageType';
	import type { UiModel } from '../../models/uiModel';
	export let data;
	let CardComponent: any;

	$: {
		if ($locale) {
			magazineStore.get($locale, data.supabase);
		}
	}
	onMount(async function () {
		let pageType = getNameRegex($page.url.pathname);
		let magazineUi = (await UiStore.get(data.supabase, getPageType(pageType))) as UiModel;
		let cardType =
			magazineUi?.component_type?.type?.charAt(0).toUpperCase() +
			magazineUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;

		await magazineStore.get($locale, data.supabase);
	});

	// Navigate to newsDetail page
	function DetailsPage(itemId: any) {
		goto(`/magazine/detail/${itemId}`);
		//('news :', itemId);
	}
</script>

<section class="py-12 {Constants.page_max_width} mx-auto flex-1 w-full h-full">
	<div class="flex justify-center items-center mb-12">
		<div>
			<TitleUi text={$LL.magazine()} />
		</div>
	</div>
	{#if $magazineStore}
		<div class="grid justify-around grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
			{#each $magazineStore as item, i}
				<!-- {#if CardComponent} -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div on:click={() => DetailsPage(item.id)}>
					{#if CardComponent}
						<ExpoCard
							primaryColor={Constants.page_theme.magazine.primary ?? Constants.main_theme.primary}
							overlayPrimaryColor={Constants.page_theme.magazine.overlayPrimary ??
								Constants.main_theme.overlayPrimary}
							imageClass={Constants.image_card_layout}
							cardType={CardComponent || CardType.Main}
							title={item.title}
							date={item.created_at}
							thumbnail={item.thumbnail}
						/>
					{/if}
				</div>
				<!-- {/if} -->
			{/each}
		</div>
	{/if}
</section>
