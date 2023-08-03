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
	import type { ExhibitionModel } from '../../models/exhibitionModel';

	export let exhibition: any;
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

	onMount(async function () {
		console.log('exhibitionSlider', exhibition);

		const swiperEl = document.querySelector('#swiper-container1');
		// // now we need to assign all parameters to Swiper element
		// @ts-ignore
		Object.assign(swiperEl, {
			a11y: {
				prevSlideMessage: 'Previous slide',
				nextSlideMessage: 'Next slide'
			},
			breakpoints: {
				640: {
					slidesPerView: 2
				},
				1024: {
					slidesPerView: 3
				}
			},

			// If we need pagination
			pagination: {
				el: '.swiper-pagination'
			},

			// Navigation arrows
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},

			loop: true,
			controller: {
				inverse: true
			},
			autoplay: {
				delay: 3000
			},
			speed: 1000,
			slidesPerView: 4,
			centeredSlides: true,
			on: {
				init() {
					// ...
				}
			}
		});

		// and now initialize it
		// @ts-ignore
		swiperEl.initialize();
	});
	const onProgress = (e: any) => {
		const [swiper, progress] = e.detail;
	};

	const onSlideChange = (e: any) => {};
</script>

<div dir="ltr" in:fade={{ duration: 800 }}>
	<swiper-container

        slides-per-view={3}
        space-between={10}
		id="swiper-container1"
		on:progress={onProgress}
		on:slidechange={onSlideChange}
		init="false"
		class="w-full min-h-[24rem]"
	>
		{#if exhibition}
			{#each exhibition.sponsor_images as c, i}
				<swiper-slide>
					<div class="relative flex justify-start" dir={locale === 'en' ? 'ltr' : 'rtl'}>
						<img class="object-cover h-96" src={c} alt="Carasoul Image" />
						<div class="absolute bottom-0 w-full left-0 right-0 bg-gradient-black block" />
						<div
							class="absolute bottom-4 sm:bottom-10 md:bottom-20 lg:bottom-32 {locale === 'en'
								? 'left-4 sm:left-10 md:left:20 lg:left-32'
								: 'right-4 sm:right-10 md:right:20 lg:right-32'}  z-10"
						/>
					</div>
				</swiper-slide>
			{/each}
		{:else}
			<div class="animate-pulse w-full block h-200 bg-gray-500 opacity-80" />
		{/if}
	</swiper-container>
</div>

