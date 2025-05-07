<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import type { NewsModel } from '../../../../models/newsModel';
	import { modelToItemModel } from '../../../../models/covertModel';
	import Constants from '../../../../utils/constants';
	import RecentItems from '$lib/components/RecentItems.svelte';
	import { newsStore } from '../../../../stores/newsStore';
	import { Spinner } from 'flowbite-svelte';
	import { newsCurrentThemeColors } from '../../../../stores/darkMode';
	import ImageCarousel from '$lib/components/ImageCarousel.svelte';
	
	// Import Swiper and modules
	import Swiper from 'swiper';
	import { Navigation, Pagination, Autoplay, EffectFade, Thumbs, Zoom } from 'swiper/modules';
	
	// Import Swiper styles
	import 'swiper/css';
	import 'swiper/css/navigation';
	import 'swiper/css/pagination';
	import 'swiper/css/effect-fade';
	import 'swiper/css/thumbs';
	import 'swiper/css/zoom';
	
	// Register Swiper modules
	Swiper.use([Navigation, Pagination, Autoplay, EffectFade, Thumbs, Zoom]);

	export let data;
	let news: NewsModel | undefined | null;
	let thumbsSwiper: any = null;
	let mainSwiper: Swiper | null = null;
	let loadedImages = 0;
	let imagesLoading = true;

	$: {
		if ($locale) {
			getNews();
		}
	}

	$: if (news?.imagesCarousel && loadedImages === news.imagesCarousel.length) {
		imagesLoading = false;
	}

	async function getNews() {
		loadedImages = 0;
		imagesLoading = true;
		news = await newsStore.getSingle($locale, data.supabase, $page.params.newsId);
	 
		newsStore.get($locale, data.supabase, '1', 7);
	}

	function handleImageLoad(event: Event) {
		const img = event.target as HTMLImageElement;
		loadedImages++;
	}

	onMount(() => {
		getNews();
	});
	
	function initMainSwiper(node: HTMLElement) {
		if (news?.imagesCarousel?.length) {
			mainSwiper = new Swiper(node, {
				modules: [Navigation, Pagination, Autoplay, EffectFade, Thumbs, Zoom],
				spaceBetween: 0,
				slidesPerView: 1,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				pagination: { 
					el: '.swiper-pagination',
					clickable: true,
					dynamicBullets: true
				},
				autoplay: { delay: 5000, disableOnInteraction: false },
				effect: 'fade',
				loop: true,
				thumbs: { swiper: thumbsSwiper },
				zoom: {
					maxRatio: 3,
					minRatio: 1
				}
			});
		}
		
		return {
			destroy() {
				if (mainSwiper) {
					mainSwiper.destroy();
					mainSwiper = null;
				}
			}
		};
	}
	
	function initThumbsSwiper(node: HTMLElement) {
		if (news?.imagesCarousel?.length && news.imagesCarousel.length > 1) {
			thumbsSwiper = new Swiper(node, {
				modules: [Thumbs],
				watchSlidesProgress: true,
				slidesPerView: 4,
				spaceBetween: 10,
				breakpoints: {
					640: { slidesPerView: 5 },
					768: { slidesPerView: 6 },
					1024: { slidesPerView: 8 }
				}
			});
		}
		
		return {
			destroy() {
				if (thumbsSwiper) {
					thumbsSwiper.destroy();
					thumbsSwiper = null;
				}
			}
		};
	}
</script>

<section
	style="background-color: {$newsCurrentThemeColors.backgroundColor}; color: {$newsCurrentThemeColors.overlayBackgroundColor}"
	class="w-full"
>
	<div class="{Constants.page_max_width} mx-auto">
		{#if news}
			<div
				class="grid 3xl:grid-cols-3 xl:grid-cols-3 grid-cols-1 my-2 rounded-lg justify-center items-start content-center w-full gap-6 px-4 py-8"
			>
				<div class="flex-1 xl:col-span-2 col-span-1 w-full h-full z-0 xl:mt-10">
					<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
						<!-- News Gallery Carousel -->
						<div class="relative">
							{#if news.imagesCarousel && news.imagesCarousel.length > 0}
								<ImageCarousel 
									images={news.imagesCarousel}
									height="600px"
									showThumbs={true}
									autoplay={true}
									effect="fade"
									zoom={true}
								/>
							{/if}
						</div>

						<!-- News Content -->
						<div class="p-6" style="background-color: {$newsCurrentThemeColors.secondaryColor}; color: {$newsCurrentThemeColors.overlaySecondaryColor}">
							<h1 class="text-2xl md:text-3xl font-bold mb-4" style="color: {$newsCurrentThemeColors.primaryColor}">{news.title}</h1>
						 	{#if news.long_description}
								<div class="mt-4 prose max-w-none dark:prose-invert">
									{@html news.long_description}
								</div>
							{/if}
						</div>
					</div>
				</div>
				
				{#if $newsStore && $newsStore.data.length > 0}
					<div class="xl:col-span-1 col-span-1 xl:p-2 w-full h-full xl:mt-10">
						<div class="sticky top-4 w-full">
							<RecentItems
								title={$LL.recentNews()}
								items={$newsStore.data
									.filter(item => item.id?.toString() !== $page.params.newsId)
									.map((news) => modelToItemModel(news))}
								pageType={'news'}
							/>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<div class="w-full min-h-screen flex justify-center items-center">
				<Spinner size="12" />
			</div>
		{/if}
	</div>
</section>

<style>
	:global(.news-carousel .swiper-button-next),
	:global(.news-carousel .swiper-button-prev) {
		color: white;
		background-color: rgba(0, 0, 0, 0.5);
		width: 44px;
		height: 44px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 0.3s ease;
	}
	
	:global(.news-carousel .swiper-button-next:hover),
	:global(.news-carousel .swiper-button-prev:hover) {
		background-color: rgba(0, 0, 0, 0.7);
		transform: scale(1.1);
	}

	:global(.news-carousel .swiper-button-next::after),
	:global(.news-carousel .swiper-button-prev::after) {
		font-size: 18px;
	}

	:global(.news-carousel .swiper-pagination-bullet) {
		background-color: white;
		opacity: 0.7;
		width: 10px;
		height: 10px;
		transition: all 0.3s ease;
	}

	:global(.news-carousel .swiper-pagination-bullet-active) {
		background-color: white;
		opacity: 1;
		width: 12px;
		height: 12px;
	}
	
	:global(.thumbs-carousel .swiper-slide-thumb-active div) {
		border-color: #3b82f6 !important;
		transform: scale(1.05);
	}
	
	:global(.swiper-zoom-container) {
		width: 100%;
		height: 100%;
	}
</style>
