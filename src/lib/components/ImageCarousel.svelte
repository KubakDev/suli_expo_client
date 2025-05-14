<script lang="ts">
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { Navigation, Pagination, Autoplay, EffectFade, Thumbs, Zoom } from 'swiper/modules';
	import { Spinner } from 'flowbite-svelte';
	
	// Import Swiper styles
	import 'swiper/css';
	import 'swiper/css/navigation';
	import 'swiper/css/pagination';
	import 'swiper/css/effect-fade';
	import 'swiper/css/thumbs';
	import 'swiper/css/zoom';
	import Constants from '../../utils/constants';
	import { currentMainThemeColors } from '../../stores/darkMode';
	// Register Swiper modules
	Swiper.use([Navigation, Pagination, Autoplay, EffectFade, Thumbs, Zoom]);

	export let images: { imgurl: string; name: string; attribution?: string }[] = [];
	export let showThumbs: boolean = true;
	export let autoplay: boolean = true;
	export let effect: 'fade' | 'slide' = 'fade';
	export let zoom: boolean = true;
	export let height: string = '400px';
	export let theme: 'news' | 'exhibition' | 'gallery' | 'magazine' | 'video' | 'publishing' = 'news';

	let thumbsSwiper: any = null;
	let mainSwiper: Swiper | null = null;
	let loadedImages = 0;
	let imagesLoading = true;
	let containerHeight = height;

	$: primaryColor = Constants.page_theme[theme].lightPrimary;

	$: if (images && loadedImages === images.length) {
		imagesLoading = false;
	}

	function handleImageLoad(event: Event) {
		const img = event.target as HTMLImageElement;
		loadedImages++;
	}

	function initMainSwiper(node: HTMLElement) {
		if (images?.length) {
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
				autoplay: autoplay ? { delay: 5000, disableOnInteraction: false } : false,
				effect: effect,
				fadeEffect: {
					crossFade: true
				},
				loop: true,
				thumbs: { swiper: thumbsSwiper },
				zoom: zoom ? {
					maxRatio: 3,
					minRatio: 1
				} : false,
				speed: 500
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
		if (images?.length && images.length > 1 && showThumbs) {
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

	// Responsive height adjustment
	function updateContainerHeight() {
		const screenWidth = window.innerWidth;
		if (screenWidth < 640) {
			containerHeight = '250px';
		} else if (screenWidth < 768) {
			containerHeight = '300px';
		} else {
			containerHeight = height;
		}
	}

	onMount(() => {
		updateContainerHeight();
		window.addEventListener('resize', updateContainerHeight);
		return () => {
			window.removeEventListener('resize', updateContainerHeight);
		};
	});
</script>

<div class="relative w-full" style="background-color: {$currentMainThemeColors.secondaryColor};">
	{#if images && images.length > 0}
		<!-- Loading Spinner -->
		{#if imagesLoading}
			<div class="absolute inset-0 flex items-center justify-center z-10" style="background-color: {$currentMainThemeColors.backgroundColor};">
				<div class="flex items-center justify-center w-full h-full">
					<Spinner color="primary" size="12" />
				</div>
			</div>
		{/if}
		
		<div class="swiper main-carousel" use:initMainSwiper>
			<div class="swiper-wrapper">
				{#each images as image, index}
					<div class="swiper-slide">
						<div class="swiper-zoom-container">
							<div class="relative w-full h-full" style="height: {containerHeight};">
								<img 
									src={image.imgurl} 
									alt={image.name} 
									class="w-full h-full object-contain md:object-cover cursor-zoom-in"
									on:load={handleImageLoad}
								/>
								{#if image.attribution}
									<div class="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white p-1 md:p-2 text-xs md:text-sm rounded-tl-md">
										{image.attribution}
									</div>
								{/if}
								<div class="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-1 md:p-2 text-xs md:text-sm rounded-br-md">
									{index + 1}/{images.length}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="swiper-button-next"></div>
			<div class="swiper-button-prev"></div>
			<div class="swiper-pagination"></div>
		</div>
		
		<!-- Thumbnails -->
		{#if showThumbs && images.length > 1}
			<div class="mt-2 md:mt-4 px-2 md:px-3">
				<div class="swiper thumbs-carousel" use:initThumbsSwiper>
					<div class="swiper-wrapper">
						{#each images as image}
							<div class="swiper-slide">
								<div class="cursor-pointer h-[40px] sm:h-[60px] md:h-[80px] overflow-hidden rounded-md border-2 border-transparent hover:border-[{primaryColor}] transition-all duration-200">
									<img 
										src={image.imgurl}
										alt={image.name}
										class="w-full h-full object-cover"
										loading="lazy"
									/>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	:global(.main-carousel .swiper-button-next),
	:global(.main-carousel .swiper-button-prev) {
		color: white;
		background-color: var(--newsLightPrimaryColor);
		width: 30px;
		height: 30px;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 0.3s ease;
		opacity: 0.7;
	}
	
	@media (min-width: 640px) {
		:global(.main-carousel .swiper-button-next),
		:global(.main-carousel .swiper-button-prev) {
			width: 44px;
			height: 44px;
		}
	}
	
	:global(.main-carousel .swiper-button-next:hover),
	:global(.main-carousel .swiper-button-prev:hover) {
		background-color: var(--newsLightPrimaryColor);
		transform: scale(1.1);
		opacity: 1;
	}

	:global(.main-carousel .swiper-button-next::after),
	:global(.main-carousel .swiper-button-prev::after) {
		font-size: 12px;
	}
	
	@media (min-width: 640px) {
		:global(.main-carousel .swiper-button-next::after),
		:global(.main-carousel .swiper-button-prev::after) {
			font-size: 18px;
		}
	}

	:global(.main-carousel .swiper-pagination-bullet) {
		background-color: white;
		opacity: 0.7;
		width: 8px;
		height: 8px;
		transition: all 0.3s ease;
	}
	
	@media (min-width: 640px) {
		:global(.main-carousel .swiper-pagination-bullet) {
			width: 10px;
			height: 10px;
		}
	}

	:global(.main-carousel .swiper-pagination-bullet-active) {
		background-color: white;
		opacity: 1;
		width: 10px;
		height: 10px;
	}
	
	@media (min-width: 640px) {
		:global(.main-carousel .swiper-pagination-bullet-active) {
			width: 12px;
			height: 12px;
		}
	}
	
	:global(.thumbs-carousel .swiper-slide-thumb-active div) {
		border-color: var(--newsLightPrimaryColor) !important;
		transform: scale(1.05);
	}
	
	:global(.swiper-zoom-container) {
		width: 100%;
		height: 100%;
	}

	:global(.swiper-slide) {
		opacity: 0;
		transition: opacity 0.5s ease;
	}

	:global(.swiper-slide-active) {
		opacity: 1;
	}

	:global(.swiper-slide-prev),
	:global(.swiper-slide-next) {
		opacity: 0;
	}

	:global(.thumbs-carousel .swiper-slide) {
		opacity: 1;
	}

	:global(.thumbs-carousel .swiper-slide img) {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style> 