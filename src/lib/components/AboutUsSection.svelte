<script lang="ts">
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { aboutSectionStore } from '../../stores/aboutSectionStore';
	import TitleUi from './TitleUi.svelte';
	import constants from '../../utils/constants';
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
		class="{constants.section_padding_y} {constants.page_max_width} m-auto {constants.horizontal_padding}"
	>
		<div class="flex justify-center items-center">
			<TitleUi text={$LL.about()} customClass=" text-white dark:text-white " />
		</div>
		<div class=" flex items-center justify-center flex-col w-full {constants.section_margin_top}">
			<!-- short description  -->
			<div class="text-center w-full">
				<p
					class="leading-relaxed mb-8 pt-10 md:pb-20 pb-5 lg:px-8 px-4 text-base md:text-xl about_section rounded-2xl text-white"
				>
					{$aboutSectionStore.short_description}
				</p>
			</div>

			<img
				class="lg:-mt-20 lg:w-4/6 w-full mb-10 lg:h-96 object-cover object-center rounded-lg"
				alt="about image"
				src={`${$aboutSectionStore?.image}`}
			/>
		</div>
	</section>
{/if}

<style>
	.about_section {
		background: linear-gradient(90deg, #e1b168 0%, #bd7200 100%);
	}
</style>
