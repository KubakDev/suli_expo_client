<script lang="ts">
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { aboutSectionStore } from '../../stores/aboutSectionStore';
	import TitleUi from './TitleUi.svelte';
	import constants from '../../utils/constants';
	import Saos from '$lib/animate/Saos.svelte';
	import Constants from '../../utils/constants';
	export let supabase: any;

	$: {
		//.info('locale changed %%%%%%%%%%%%%%%%%%');
		if ($locale) {
			//.info('locale changed #########', $locale);
			aboutSectionStore.get($locale, supabase);
		}
	}
</script>

{#if $aboutSectionStore}
	<section
		class="{constants.section_padding_y} {constants.page_max_width} m-auto {constants.horizontal_padding} mb-96"
	>
		<!-- <Saos animation="from-bottom 1s cubic-bezier(0.500, 0.5, 0.1, 1) both"> -->
		<div class="flex justify-center items-center aboutTitle">
			<TitleUi text={$LL.about()} />
		</div>
		<!-- </Saos> -->
		<div
			class=" flex items-center justify-center flex-col w-full {constants.section_margin_top} relative"
		>
			<!-- short description  -->
			<!-- <Saos animation="from-bottom 1.2s cubic-bezier(0.500, 0.5, 0.1, 1) both"> -->
			<p
				class="leading-relaxed pt-10 md:pb-20 pb-5 lg:px-8 px-4 text-base md:text-xl about_section rounded-2xl text-[{Constants.main_theme.overlaySecondary}]"
			>
				{$aboutSectionStore.short_description}
			</p>
			<!-- </Saos> -->
			<div class="w-full justify-center items-center flex py-2 lg:-mt-20">
				<div class=" lg:w-4/6 w-full h-96 object-cover object-center rounded-lg">
					<Saos animation="from-bottom 1.8s cubic-bezier(0.500, 0.5, 0.1, 1) both">
						<!-- svelte-ignore a11y-img-redundant-alt -->
						<img
							class=" w-full rounded-lg"
							alt="about image"
							src="{$aboutSectionStore.image}"
						/>
					</Saos>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	.about_section {
		background: linear-gradient(
			90deg,
			var(--transparentPrimaryColor) 0%,
			var(--primaryColor) 100%
		);
	}
	.aboutTitle {
		will-change: transform, opacity;
	}

	@keyframes -global-from-bottom {
		0% {
			transform: translateY(10vw);
			opacity: 1;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
