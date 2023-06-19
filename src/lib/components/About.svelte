<script lang="ts">
	import type { AboutModel } from '../../models/aboutModel';
	export let aboutSection: AboutModel;
	import Saos from '$lib/saos/Saos.svelte';

	//  //('locale', $locale);
</script>

<div class="flex items-center justify-center flex-col px-4 lg:px-0">
	<!-- short description  -->
	<div class="text-center">
		<p
			class=" leading-relaxed mb-8 pt-10 md:pb-20 pb-5 lg:px-8 px-4 text-base md:text-xl about_section rounded-2xl text-white"
		>
			{aboutSection?.short_description}
		</p>
		<Saos animation={'slide-down 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}>
			<div class="lg:-mt-20 lg:w-5/6 mx-auto w-full mb-10 lg:h-96">
				<img
					class="image_section object-cover w-full h-full object-center rounded-lg"
					alt="about image"
					src={`${aboutSection?.image}`}
				/>
			</div>
		</Saos>
	</div>

	<!-- about section -->
	<section class="body-font overflow-hidden">
		<Saos animation={'from-bottom 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}>
			<div class="lg:py-20 py-10">
				{@html aboutSection?.long_description}
			</div>
		</Saos>
	</section>
</div>

<style>
	.about_section {
		background: linear-gradient(90deg, #e1b168 0%, #bd7200 100%);
	}

	@keyframes slide-up {
		from {
			transform: translateY(20%);
		}
		to {
			transform: translateY(0);
		}
	}
	.image_section {
		animation: slide-up 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both;
	}

	/* animate text */
	@keyframes -global-from-bottom {
		from {
			transform: translateY(10%);
		}
		to {
			transform: translateY(0);
		}
	}
</style>
