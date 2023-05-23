<script lang="ts">
	import { onMount } from 'svelte';
	import { register } from 'swiper/element/bundle';
	import type { CarouselModel } from '../../models/CarouselModel';
	import { carouselStore } from '../../stores/carouselStore';
	import { Button } from 'flowbite-svelte';
	register();

	export let supabase: any;

	onMount(async () => {
		await carouselStore.get(supabase);

		const swiperEl = document.querySelector('swiper-container');
		const swiperParams = {
			// effect: 'creative',

			// creativeEffect: {
			// 	prev: {
			// 		// will set `translateZ(-400px)` on previous slides
			// 		translate: [0, 0, -400]
			// 	},
			// 	next: {
			// 		// will set `translateX(100%)` on next slides
			// 		translate: ['100%', 0, 0]
			// 	}
			// },

			a11y: {
				prevSlideMessage: 'Previous slide',
				nextSlideMessage: 'Next slide'
			},
			loop: true,
			controller: {
				inverse: true
			},
			speed: 1000,
			slidesPerView: 1,
			autoplay: {
				delay: 2000
			},
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
		console.log(progress);
	};

	const onSlideChange = (e: any) => {
		console.log('slide changed');
	};
</script>

<swiper-container
	slides-per-view={1}
	centered-slides={true}
	pagination={{
		hideOnClick: true
	}}
	on:progress={onProgress}
	on:slidechange={onSlideChange}
	init="false"
	class="w-full"
>
	{#if $carouselStore}
		{#each $carouselStore as c, i}
			<swiper-slide class="h-full">
				<div class="relative max-h-200 flex justify-start">
					<img
						style="height: 100%;"
						class="object-cover w-full h-full max-h-200"
						src={import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL + '/' + c.image}
					/>
					<div class="absolute bottom-0 w-full left-0 right-0 h-96 bg-gradient-black block" />
					<div
						class="absolute bottom-4 sm:bottom-10 md:bottom-20 lg:bottom-32 left-4 sm:left-10 md:left:20 lg:left-32 z-10"
					>
						<div
							class=" text-white text-xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-8xl slide-text duration-1000 ease-in-out opacity-0 translate-x-96 delay-100"
						>
							<p>{c.title}</p>
						</div>
						<div
							class="w-full md:w-1/2 text-white text-sm sm:text-base md:text-lg xl:text-2xl slide-text duration-1000 ease-in-out opacity-0 translate-x-96 delay-300"
							data-swiper-parallax="-300"
							data-swiper-parallax-duration="600"
						>
							<p>{c.subtitle}</p>
						</div>
						<div
							class="slide-text duration-1000 ease-in-out opacity-0 translate-x-96 delay-500 mt-4"
						>
							<Button outline color="primary">Read More</Button>
						</div>
					</div>
				</div>
			</swiper-slide>
		{/each}
	{:else}
		<swiper-slide>
			<img class="object-cover w-full h-full" src="/images/suliexpo.jpg" />
		</swiper-slide>
	{/if}
</swiper-container>

<style>
	.bg-gradient-black {
		background: linear-gradient(to top, black, transparent);
	}
</style>
