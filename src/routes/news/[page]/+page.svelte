<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { getNewsUi } from '../../../stores/ui/newsUi';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import newsUiStore from '../../../stores/ui/newsUi';
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../../utils/constants';
	import { stringToEnum } from '../../../utils/enumToString';
	import PaginationComponent from '$lib/components/PaginationComponent.svelte';
	import { page } from '$app/stores';
	import { newsStore } from '../../../stores/newsStore';
	import { activeThemeStore } from '../../../stores/ui/theme';
	import { AcademicCap, ArrowDown, ArrowUp, ArrowsUpDown } from 'svelte-heros-v2';
	import { Button, Checkbox, Chevron, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { exhibitionStore } from '../../../stores/exhibtionStore';
	import { CardType, ExpoCard } from 'kubak-svelte-component';

	export let data;
	let CardComponent: any;

	let asc: boolean = false;
	let selectedExhibition: number[];

	$: {
		if ($locale || asc) {
			const currentPage = $page.params.page;
			newsStore.get($locale, data.supabase, currentPage, undefined ,asc);
		}
	}

	onMount(async () => {
		await getNewsUi(data.supabase).then(async (value) => {
			CardComponent = stringToEnum($newsUiStore?.component.title!, CardType);
		});

		await exhibitionStore.get($locale,data.supabase);
	});
	onDestroy(() => {
		activeThemeStore.reAddColors();
	});
	function changePage(page: number) {
		goto(`/news/${page}`);
	}
	function changeOrder() {
		asc = !asc;
	}
	async function filterByExhibition() {
		console.log(selectedExhibition);
		newsStore.get($locale, data.supabase, $page.params.page, undefined, asc, selectedExhibition);
	}
</script>

<section class=" py-12 {Constants.page_max_width} w-full mx-auto" id="newsSection">
	{#if $newsStore}
		<div class="flex justify-between items-center mb-12 w-full">
			<div
				class="bg-[var(--overlayPrimaryColor)] p-2 rounded-full text-center w-full"
			>
				{#if asc}
					<button on:click={changeOrder} class="flex flex-row items-center justify-center">
						<ArrowUp
							size="30"
							class="text-[var(--newsOverlaySecondaryColor)] transition-all hover:animate-pulse "
						/>
						<span class="text-[var(--newsSecondaryColor)] uppercase text-xs font-bold pl-2">Old - New</span>
					</button>
				{:else}
					<button on:click={changeOrder} class="flex flex-row items-center justify-center">
						<ArrowDown
							size="30"
							class="text-[var(--newsOverlaySecondaryColor)] transition-all hover:animate-pulse"
						/>
						<span class="text-[var(--newsSecondaryColor)] uppercase text-xs font-bold pl-2">New - Old</span>
					</button>
				{/if}
			</div>
			<!-- <DateRangePicker /> -->
			<div class="flex justify-center w-full px-2">
				<TitleUi text={$LL.news()} />
			</div>

			<div class="justify-end flex z-10 w-full">
				<Button class="bg-[var(--newsOverlayPrimaryColor)] hover:bg-[var(--newsOverlayPrimaryColor)] text-[var(--newsSecondaryColor)] text-xs sm:text-md"><Chevron>Filter By Exhibition</Chevron></Button>
				<Dropdown class="w-44 p-3 space-y-3 text-sm bg-[var(--overlayPrimaryColor)] max-h-32 overflow-y-auto {Constants.scrollbar_layout}">
					{#each $exhibitionStore as exhibition}
					<li>
						<Checkbox class="text-[var(--newsSecondaryColor)]" bind:group={selectedExhibition} value={exhibition.id}>{exhibition.title}</Checkbox>
					  </li>
					{/each}
					<DropdownItem class="bg-[var(--newsOverlayPrimaryColor)] hover:bg-[var(--newsOverlayPrimaryColor)] text-[var(--newsSecondaryColor)]" slot="footer" on:click={filterByExhibition}>Search</DropdownItem>
				</Dropdown>
			</div>
		</div>

		<div class="grid justify-around grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each $newsStore.data as item, i}
				<button
					on:click={() => {
						goto(`/news/detail/${item.id}`);
					}}
					class="no-underline"
				>
					<ExpoCard
						primaryColor={'var(--newsPrimaryColor)'}
						overlayPrimaryColor={'var(--newsOverlayPrimaryColor)'}
						imageClass={Constants.image_card_layout}
						cardType={$newsUiStore?.component_type.type ?? CardType.Main}
						title={item.title}
						thumbnail={item.thumbnail}
						date={item.news_date || '01-01-2000'}
						short_description={item.short_description}
					/>
				</button>
			{/each}
		</div>

		<div dir="ltr" class="flex justify-center my-10">
			{#if $newsStore.count > 9}
				<PaginationComponent
					total={$newsStore.count}
					page={parseInt($page.params.page)}
					on:changePage={(value) => changePage(value.detail.page)}
				/>
			{/if}
		</div>
	{/if}
</section>
