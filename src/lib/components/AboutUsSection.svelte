<script lang="ts">
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { aboutSectionStore } from '../../stores/aboutSectionStore';
	import TitleUi from './TitleUi.svelte';
	import constants from '../../utils/constants';
	import Saos from '$lib/animate/Saos.svelte';
	import Constants from '../../utils/constants';
	import { onMount } from 'svelte';
	import { currentMainThemeColors } from '../../stores/darkMode';
	export let supabase: any;

	$: {
		if ($locale) {
			aboutSectionStore.get($locale, supabase);
		}
	}

	onMount(async () => {
		if ($locale) {
			aboutSectionStore.get($locale, supabase);
		}
	});
</script>

{#if $aboutSectionStore}
	<section
		class="{constants.section_padding_y} {constants.page_max_width} m-auto {constants.horizontal_padding} mb-96"
	>
		<div class="flex justify-center items-center aboutTitle">
			<TitleUi
				text={$LL.about()}
				borderColor={$currentMainThemeColors.primaryColor}
				textColor={$currentMainThemeColors.overlayBackgroundColor}
			/>
		</div>
		<div
			class=" flex items-center justify-center flex-col w-full {constants.section_margin_top} relative"
		>
			<p
				class="leading-relaxed pt-10 md:pb-20 pb-5 lg:px-8 px-4 text-base md:text-xl about_section rounded-2xl"
				style="background-color: {$currentMainThemeColors.primaryColor}; color:{$currentMainThemeColors.overlayPrimaryColor}"
			>
				{$aboutSectionStore.short_description}
			</p>
			<div class="w-full justify-center items-center flex py-2 lg:-mt-20">
				<div class=" lg:w-4/6 w-full h-96 object-cover object-center rounded-lg">
					<Saos animation="from-bottom 1.8s cubic-bezier(0.500, 0.5, 0.1, 1) both">
						<img class=" w-full rounded-lg" alt="aboutImage" src={$aboutSectionStore.image} />
					</Saos>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
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
