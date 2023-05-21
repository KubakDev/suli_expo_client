<script>
	import { onMount } from 'svelte';
	import { register } from 'swiper/element/bundle';
	register();

	onMount(() => {
		const swiperEl = document.querySelector('swiper-container');

		// swiper parameters
		const swiperParams = {
			slidesPerView: 1,
			breakpoints: {
				640: {
					slidesPerView: 1
				},
				1024: {
					slidesPerView: 1
				}
			},
			on: {
				init() {
					// ...
				}
			}
		};
		// now we need to assign all parameters to Swiper element
		// @ts-ignore
		Object.assign(swiperEl, swiperParams);

		// and now initialize it
		// @ts-ignore
		swiperEl.initialize();
	});
</script>

<swiper-container init="false" slides-per-view="1" class="w-full">
	<swiper-slide><img class="object-cover w-full h-full" src="/images/suliexpo.jpg" /></swiper-slide>
	<swiper-slide><img class="object-cover w-full h-full" src="/images/suliexpo.jpg" /></swiper-slide>
	<swiper-slide><img class="object-cover w-full h-full" src="/images/suliexpo.jpg" /></swiper-slide>
</swiper-container>
