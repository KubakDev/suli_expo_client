<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../utils/constants';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import { stringToEnum } from '../../utils/enumToString';
	import { videoStore } from '../../stores/videoStore';
	import { getNameRegex } from '../../utils/urlRegexName';
	import { page } from '$app/stores';
	import { UiStore } from '../../stores/ui/Ui';
	import { getPageType } from '../../utils/pageType';
	import type { UiModel } from '../../models/uiModel';
	export let data;
	let CardComponent: any;

	$: {
		if ($locale) {
			videoStore.get($locale, data.supabase);
		}
	}

	onMount(async () => {
		let pageType = getNameRegex($page.url.pathname);
		let videoUi = (await UiStore.get(data.supabase,getPageType(pageType))) as UiModel;
		let cardType =
			videoUi?.component_type?.type?.charAt(0).toUpperCase() + videoUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;

		videoStore.get($locale, data.supabase);
	});

	// Navigate to newsDetail page
	function DetailsPage(itemId: any) {
		goto(`/video/detail/${itemId}`);
		//('news :', itemId);
	}
</script>

<section class="py-12 {Constants.page_max_width} mx-auto flex-1 w-full h-full">
	<div class="flex justify-center items-center mb-12">
		<div>
			<TitleUi text={$LL.videos()} />
		</div>
	</div>
	{#if $videoStore}
		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $videoStore as item, i}
				{#if CardComponent}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={() => DetailsPage(item.id)}>
						<ExpoCard
							primaryColor={Constants.page_theme.video.primary ?? Constants.main_theme.primary}
							overlayPrimaryColor={Constants.page_theme.video.overlayPrimary ?? Constants.main_theme.overlayPrimary}
							cardType={CardComponent || CardType.Main}
							title={item.title}
							thumbnail={item?.thumbnail ?? "https://scontent.fisu6-2.fna.fbcdn.net/v/t39.30808-6/267549618_692154372169154_2449673849951386371_n.png?_nc_cat=105&cb=99be929b-59f725be&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=-9FJymvHNRIAX_RXdNE&_nc_ht=scontent.fisu6-2.fna&oh=00_AfCtYVAEqBRXNrcAdAUUEIqACXrGd0k7By5F5GfOSJ7pIg&oe=64C7618E"}
						/>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</section>
