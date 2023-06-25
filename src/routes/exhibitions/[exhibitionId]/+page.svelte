<!-- import {(derived, get)} from 'svelte/store'; -->
<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { locale } from '$lib/i18n/i18n-svelte';
	import { exhibitionStore } from '../../../stores/exhibtionStore';
	import type { ExhibitionModel } from '../../../models/exhibitionModel';
	import Constants from '../../../utils/constants';
	import { register } from 'swiper/element';
	register();
	export let data;
	let exhibition: ExhibitionModel | undefined | null;

	async function getExhibition() {
		exhibition = await exhibitionStore.getSingle($locale, data.supabase, $page.params.exhibitionId);
		console.log(exhibition);
		exhibitionStore.get(data.supabase);
	}

	onMount(async () => {
		await getExhibition();

		const swiperEl = document.querySelector('swiper-container');
		const swiperParams = {
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
			autoplay: true,
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
</script>

<section class="w-full flex-1">
	<swiper-container
		slides-per-view={1}
		centered-slides={true}
		autoplay={{
			delay: 1000,
			reverseDirection: $locale === 'en' ? false : true
		}}
		init="false"
		class="w-full h-200"
	>
		{#if exhibition}
			{#each exhibition.images as c, i}
				<swiper-slide class="h-full">
					<div
						class="relative max-h-200 flex justify-start w-full"
						dir={$locale === 'en' ? 'ltr' : 'rtl'}
					>
						<img
							style="height: 100%;"
							class="object-cover w-full h-full max-h-200"
							src={c}
							alt="img"
						/>
					</div>
				</swiper-slide>
			{/each}
		{/if}
	</swiper-container>
	<div class=" {Constants.page_max_width} mx-auto w-full">
		<div class=" items-start flex flex-col 3xl:flex-row justify-around">
			<div class="m-auto w-full 3xl:w-96 4xl:w-142 block h-0 lg:mt-0 mt-5 rounded-lg" />
			<!-- <div class="w-full bg-gray-50 {Constants.page_max_width} m-auto flex-1 my-10">
				<DetailPage imagesCarousel={exhibition.imagesCarousel} long_description={exhibition.long_description} />
			</div> -->
		</div>
	</div>
</section>
