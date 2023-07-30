<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../utils/constants';
	import { stringToEnum } from '../../../utils/enumToString';
	import { CardType, ExpoCard } from 'kubak-svelte-component';
	import { publishingStore } from '../../../stores/publishingStore';
	import { getNameRegex } from '../../../utils/urlRegexName';
	import { page } from '$app/stores';
	import { UiStore } from '../../../stores/ui/Ui';
	import { getPageType } from '../../../utils/pageType';
	import type { UiModel } from '../../../models/uiModel';
	import { ArrowDown, ArrowUp } from 'svelte-heros-v2';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	export let data: any;
	let CardComponent: any;
	let asc: boolean = false;
	$: {
		if ($locale) {
			const currentPage = $page.params.page;
			publishingStore.get($locale, data.supabase, currentPage, undefined, asc);
		}
	}

	onMount(async () => {
		let pageType = getNameRegex($page.url.pathname);
		let publishingUi = (await UiStore.get(data.supabase, getPageType(pageType))) as UiModel;
		let cardType =
			publishingUi?.component_type?.type?.charAt(0).toUpperCase() +
			publishingUi?.component_type?.type?.slice(1);
		CardComponent = stringToEnum(cardType, CardType) ?? CardType.Main;

		await publishingStore.get($locale, data.supabase, $page.params.page, undefined, asc);
	});

	// Navigate to newsDetail page
	function DetailsPage(publishingId: number) {
		goto(`/publishing/detail/${publishingId}`);
	}

	function changePage(page: number) {
		goto(`/publishing/${page}`);
	}

	async function changeOrder() {
		asc = !asc;
		publishingStore.get($locale, data?.supabase, $page.params.page, undefined, asc);
	}
</script>

<section class="py-12 {Constants.page_max_width} mx-auto flex-1 w-full h-full">
	<div class="flex justify-center items-center mb-12">
		<div class="p-2 text-center w-full">
			{#if asc}
				<button
					on:click={changeOrder}
					class="flex flex-row items-center justify-center p-2 rounded-full bg-newsPrimaryColor"
				>
					<ArrowUp size="30" class="transition-all hover:animate-pulse text-newsBackgroundColor" />

					<span
						class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1 text-newsOverlayPrimaryColor"
						>Old - New</span
					>
				</button>
			{:else}
				<button
					on:click={changeOrder}
					class="flex flex-row items-center justify-center p-2 rounded-full bg-newsPrimaryColor"
				>
					<ArrowDown
						size="30"
						class="transition-all hover:animate-pulse text-newsBackgroundColor"
					/>
					<span
						class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1 text-newsBackgroundColor"
						>New - Old</span
					>
				</button>
			{/if}
		</div>
		<div
			in:fade={{ duration: 800 }}
			out:fade={{ duration: 400 }}
			class="flex justify-center w-full px-2"
		>
			<TitleUi text={$LL.publishing()} />
		</div>
		<div class="justify-end flex z-10 w-full" />
	</div>
	{#if $publishingStore}
		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $publishingStore.data as item, i}
				{#if CardComponent}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={() => DetailsPage(item.id || 1)}>
						<ExpoCard
							primaryColor={Constants.page_theme.publishing.primary ?? Constants.main_theme.primary}
							overlayPrimaryColor={Constants.page_theme.publishing.overlayPrimary ??
								Constants.main_theme.overlayPrimary}
							imageClass={Constants.image_card_layout}
							cardType={CardComponent || CardType.Main}
							title={item.title}
							thumbnail={item.thumbnail}
						/>
					</div>
				{/if}
			{/each}
		</div>
		<div dir="ltr" class="flex justify-center my-10">
			{#if $publishingStore.count > 9}
				<PaginationComponent
					total={$publishingStore.pages}
					page={parseInt($page.params.page)}
					on:changePage={(value) => changePage(value.detail.page)}
				/>
			{/if}
		</div>
	{/if}
</section>
