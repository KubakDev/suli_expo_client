<script lang="ts">
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { aboutSectionStore } from '../../stores/aboutSectionStore';
	import TitleUi from './TitleUi.svelte';
	import constants from '../../utils/constants';
	import Saos from 'saos';
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
		<Saos animation="from-bottom 1s cubic-bezier(0.500, 0.5, 0.1, 1) both">
			<div class="flex justify-center items-center">
				<TitleUi text={$LL.about()} customClass=" text-white dark:text-white " />
			</div>
		</Saos>
		<div
			class=" flex items-center justify-center flex-col w-full {constants.section_margin_top} relative"
		>
			<!-- short description  -->
			<Saos animation="from-bottom 1.2s cubic-bezier(0.500, 0.5, 0.1, 1) both">
				<p
					class="leading-relaxed pt-10 md:pb-20 pb-5 lg:px-8 px-4 text-base md:text-xl about_section rounded-2xl text-white"
				>
					{$aboutSectionStore.short_description}
				</p>
			</Saos>
			<div class="w-full justify-center items-center flex absolute -bottom-80">
				<div class=" lg:w-4/6 w-full h-96 object-cover object-center rounded-lg">
					<Saos animation="from-bottom 1.8s cubic-bezier(0.500, 0.5, 0.1, 1) both">
						<img
							class=" w-full rounded-lg"
							alt="about image"
							src={`${$aboutSectionStore?.image}`}
						/>
					</Saos>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	.about_section {
		background: linear-gradient(90deg, #e1b168 0%, #bd7200 100%);
	}

	@keyframes -global-from-bottom {
		0% {
			transform: rotateY(10deg) translateY(10vw);
			opacity: 1;
		}
		100% {
			transform: rotateY(0deg) translateY(0);
			opacity: 1;
		}
	}

	@keyframes -global-from-right {
		0% {
			transform: rotateY(50deg) translateX(200vw);
			opacity: 1;
		}
		100% {
			transform: rotateX(0deg) translateX(0);
			opacity: 1;
		}
	}
</style>
