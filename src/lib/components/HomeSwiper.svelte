<script lang="ts">
	import { onMount } from 'svelte';
	import { register } from 'swiper/element/bundle';
	import { carouselStore } from '../../stores/carouselStore';
	import { Button } from 'flowbite-svelte';
	import type { Locale } from 'typesafe-i18n/types/runtime/src/core.mjs';
	import { fade } from 'svelte/transition';
	import type { SwiperOptions } from 'swiper/types';
	import SulyButton from './sulyButton.svelte';
	import Constants from '../../utils/constants';

	export let supabase: any;
	export let locale: Locale;

	// function toggleDirection() {
	// 	const swiperEl = document.querySelector('swiper-container');
	// 	if (swiperEl) {
	// 		if (locale === 'en') {
	// 			swiperEl!.setAttribute('dir', 'ltr');
	// 		} else {
	// 			swiperEl!.setAttribute('dir', 'rtl');
	// 		}
	// 	}
	// }

	onMount(async () => {
		await carouselStore.get(supabase);
		const swiperEl = document.querySelector('#swiper-container1');
		const swiperParams: SwiperOptions = {
			a11y: {
				prevSlideMessage: 'Previous slide',
				nextSlideMessage: 'Next slide'
			},
			loop: true,
			controller: {
				inverse: true
			},
			autoplay: {
				delay: 3000,
				reverseDirection: locale === 'en' ? false : true
			},
			speed: 1000,
			slidesPerView: 1,
			centeredSlides: true,
			on: {
				init() {
					// ...
				}
			}
		};
		// // now we need to assign all parameters to Swiper element
		// @ts-ignore
		Object.assign(swiperEl, swiperParams);

		// and now initialize it
		// @ts-ignore
		swiperEl.initialize();
	});
	const onProgress = (e: any) => {
		const [swiper, progress] = e.detail;
	};

	const onSlideChange = (e: any) => {};
</script>

<div dir="ltr" class="min-h-[200px]" in:fade={{ duration: 800 }}>
	<swiper-container
		id="swiper-container1"
		on:progress={onProgress}
		on:slidechange={onSlideChange}
		init="false"
		class="w-full h-full"
	>
		{#if $carouselStore}
			{#each $carouselStore as c, i}
				<swiper-slide class="h-full">
					<div class="relative flex justify-start" dir={locale === 'en' ? 'ltr' : 'rtl'}>
						<img class="object-cover w-full h-full" src={c.image} alt="Carasoul Image" />
						<div class="absolute bottom-0 w-full left-0 right-0 h-96 bg-gradient-black block" />
						<div
							class="absolute bottom-4 sm:bottom-10 md:bottom-20 lg:bottom-32 {locale === 'en'
								? 'left-4 sm:left-10 md:left:20 lg:left-32'
								: 'right-4 sm:right-10 md:right:20 lg:right-32'}  z-10"
						>
							<div
								class="text-lightBackgroundColor dark:text-darkBackgroundColor text-xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-8xl slide-text duration-1000 ease-in-out opacity-0 {locale ===
								'en'
									? 'translate-x-96'
									: '-translate-x-96'} delay-100"
							>
								<p>{c.title}</p>
							</div>
							<div
								class="text-lightBackgroundColor dark:text-darkBackgroundColor w-full md:w-1/2 text-sm sm:text-base md:text-lg xl:text-2xl slide-text duration-1000 ease-in-out opacity-0 {locale ===
								'en'
									? 'translate-x-96'
									: '-translate-x-96'} delay-300"
								data-swiper-parallax="-300"
								data-swiper-parallax-duration="600"
							>
								<p>{c.subtitle}</p>
							</div>
							<div
								class="slide-text duration-1000 ease-in-out opacity-0 {locale === 'en'
									? 'translate-x-96'
									: '-translate-x-96'} delay-500 mt-4"
							>
								<SulyButton>ReadMore</SulyButton>
							</div>
						</div>
					</div>
				</swiper-slide>
			{/each}
		{:else}
			<div class="animate-pulse w-full block h-200 bg-gray-500 opacity-80" />
		{/if}
	</swiper-container>
</div>

<style>
	.bg-gradient-black {
		background: linear-gradient(to top, black, transparent);
	}
</style>
