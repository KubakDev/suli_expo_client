<script lang="ts">
	import type { AboutModel } from '../../models/aboutModel';
	export let aboutSection: AboutModel;
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Saos from 'saos';

	//  //('locale', $locale);
</script>

<div class=" flex items-center justify-center flex-col">
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
			<div class="lg:my-8">
				<h1 class="flex item-start font-bold">
					{#if $locale === 'ckb' || $locale === 'ar'}
						{$LL.mission()}&nbsp;<span class="text-[#e1b168]">{$LL.our()}</span>
					{:else}
						{$LL.our()}&nbsp;<span class="text-[#e1b168]">{$LL.mission()}</span>
					{/if}
				</h1>
				<div class="w-1/6 pb-2 border-t-2 border-[#D0D5DD]" />

				<div class="py-4 flex flex-wrap md:flex-nowrap">
					<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
						<span class="font-semibold title-font">{$LL.unmatchedServices()}</span>
					</div>
					<div class="md:flex-grow">
						<p class="leading-relaxed">
							{aboutSection?.unmatched_service}
						</p>
					</div>
				</div>

				<div class="py-4 flex flex-wrap md:flex-nowrap">
					<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
						<span class="font-semibold title-font">{$LL.specific()}</span>
					</div>
					<div class="md:flex-grow">
						<p class="leading-relaxed">
							{aboutSection?.specific}
						</p>
					</div>
				</div>

				<div class="py-4 flex flex-wrap md:flex-nowrap">
					<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
						<span class="font-semibold title-font">{$LL.experience()}</span>
					</div>
					<div class="md:flex-grow">
						<p class="leading-relaxed">
							{aboutSection?.experience}
						</p>
					</div>
				</div>

				<div class="py-4 flex flex-wrap md:flex-nowrap">
					<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
						<span class="font-semibold title-font">{$LL.technology()}</span>
					</div>
					<div class="md:flex-grow">
						<p class="leading-relaxed">
							{aboutSection?.technology}
						</p>
					</div>
				</div>
			</div>
		</Saos>

		<Saos animation={'from-bottom 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}>
			<div class="lg:my-8">
				<h1 class="flex item-start font-bold">
					{#if $locale === 'ckb' || $locale === 'ar'}
						{$LL.commitment()}&nbsp;<span class="text-[#e1b168]">{$LL.our()}</span>
					{:else}
						{$LL.our()}&nbsp;<span class="text-[#e1b168]">{$LL.commitment()}</span>
					{/if}
				</h1>
				<div class="w-1/5 pb-2 border-t-2 border-[#D0D5DD]" />

				<div class="py-4 flex flex-wrap md:flex-nowrap">
					<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
						<span class="font-semibold title-font">{$LL.quality()}</span>
					</div>
					<div class="md:flex-grow">
						<p class="leading-relaxed">
							{aboutSection?.ethics}
						</p>
					</div>
				</div>

				<div class="py-4 flex flex-wrap md:flex-nowrap">
					<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
						<span class="font-semibold title-font">{$LL.continuity()}</span>
					</div>
					<div class="md:flex-grow">
						<p class="leading-relaxed">
							{aboutSection?.quality}
						</p>
					</div>
				</div>

				<div class="py-4 flex flex-wrap md:flex-nowrap">
					<div class="md:w-64 md:mb-0 mb-2 flex-shrink-0 flex flex-col">
						<span class="font-semibold title-font">{$LL.specific()}</span>
					</div>
					<div class="md:flex-grow">
						<p class="leading-relaxed">
							{aboutSection?.continuity}
						</p>
					</div>
				</div>
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
