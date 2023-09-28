<script lang="ts">
	import type { AboutModel } from '../../models/aboutModel';
	export let aboutSection: AboutModel;
	import Saos from 'saos';
	import { currentMainThemeColors } from '../../stores/darkMode';
</script>

<div class="flex items-center justify-center flex-col px-4 lg:px-0 bbb">
	<!-- short description  -->
	<div class="text-center">
		<p
			class=" leading-relaxed mb-8 pt-10 md:pb-20 pb-5 lg:px-8 px-4 text-base md:text-xl about_section rounded-2xl text-lightOverlayPrimaryColor dark:text-darkOverlaySecondaryColor"
			style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
		>
			{aboutSection?.short_description}
		</p>
		<Saos animation={'slide-down 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}>
			<div class="lg:-mt-20 lg:w-5/6 mx-auto w-full mb-10 lg:h-96">
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img
					class="image_section object-cover w-full h-full object-center rounded-lg"
					alt="About Image"
					src={aboutSection?.image}
				/>
			</div>
		</Saos>
	</div>

	<!-- about section -->
	<section class="body-font overflow-hidden">
		<Saos animation={'from-bottom 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}>
			<div class="lg:py-20 py-10 px-5" dir="ltr">
				{@html aboutSection?.long_description}
			</div>
		</Saos>
	</section>
</div>

<style>
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
