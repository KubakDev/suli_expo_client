<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import { UiStore } from '../../../stores/ui/Ui';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../utils/constants';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import { stringToEnum } from '../../../utils/enumToString';
	import { galleryStore } from '../../../stores/galleryStore';
	import { getNameRegex } from '../../../utils/urlRegexName';
	import { page } from '$app/stores';
	import { getPageType } from '../../../utils/pageType';
	import type { UiModel } from '../../../models/uiModel';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	export let data:any;
	let CardComponent: any;
	let asc: boolean = false;

	$: {
		if ($locale) {
			const currentPage = $page.params.page;
			galleryStore.get($locale, data.supabase, currentPage, undefined, asc);
		}
	}

	onMount(async () => {
		let pageType = getNameRegex($page.url.pathname);
		
		let galleryUi = (await UiStore.get(data.supabase,getPageType(pageType))) as UiModel;
		let cardType =
			galleryUi?.component_type?.type?.charAt(0).toUpperCase() + galleryUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;	

		await galleryStore.get($locale, data.supabase, $page.params.page, undefined, asc);
	});

	// Navigate to newsDetail page
	function DetailsPage(itemId: any) {
		goto(`/gallery/detail/${itemId}`);
		//('news :', itemId);
	}

	function changePage(page: number) {
		goto(`/gallery/${page}`);
	}
</script>

<section class="py-12 {Constants.page_max_width} mx-auto flex-1 w-full h-full">
	<div class="flex justify-center items-start mb-12">
		<div>
			<TitleUi text={$LL.gallery()} />
		</div>
	</div>
	{#if $galleryStore}
		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $galleryStore.data as item, i}
				{#if CardComponent}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={() => DetailsPage(item.id)}>
						<ExpoCard
							primaryColor={Constants.page_theme.gallery.primary}
							overlayPrimaryColor={Constants.page_theme.gallery.overlayPrimary}
							imageClass={Constants.image_card_layout}
							cardType={CardComponent}
							title={item.title}
							thumbnail={item.thumbnail}
						/>
					</div>
				{/if}
			{/each}
		</div>
		<div dir="ltr" class="flex justify-center my-10">
			{#if $galleryStore.count > 9}
				<PaginationComponent
					total={$galleryStore.pages}
					page={parseInt($page.params.page)}
					on:changePage={(value) => changePage(value.detail.page)}
				/>
			{/if}
		</div>
	{/if}
</section>
