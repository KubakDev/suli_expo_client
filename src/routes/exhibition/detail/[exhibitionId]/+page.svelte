<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import { exhibitionStore } from '../../../../stores/exhibtionStore';
	import type { ExhibitionModel } from '../../../../models/exhibitionModel';
	import Constants from '../../../../utils/constants';
	import NewsSection from '$lib/components/NewsSection/NewsSection.svelte';
	import { MapPin, BuildingOffice2, GlobeAsiaAustralia, CloudArrowDown } from 'svelte-heros-v2';
	import NumberAnimationIncrement from '$lib/components/NumberAnimationIncrement.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	//@ts-ignore
	// import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import SponsorSlider from '$lib/components/SponsorSlider.svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import ExhibitionMapImage from '$lib/components/exhibitionMapImage.svelte';
	import { Carousel } from 'flowbite-svelte';
	import 'pdfjs-dist/web/pdf_viewer.css';
	import {
		exhibitionCurrentMainThemeColors,
		currentMainThemeColors
	} from '../../../../stores/darkMode';

	export let data: any;
	const youtubeRegex =
		/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

	let exhibitionImage: { id: number; name: string; imgurl: string; attribution: string }[] = [];

	let exhibition: ExhibitionModel;
	async function getExhibition() {
		exhibition = (await exhibitionStore.getSingle(
			$locale,
			data.supabase,
			$page.params.exhibitionId
		)) as ExhibitionModel;
	}

	$: {
		if ($locale) {
			getExhibition();
		}
	}

	onMount(async () => {
		await getExhibition();

		if (exhibition!.images.length) {
			exhibitionImage = exhibition!.images.map((image, index) => {
				return {
					id: index,
					name: exhibition.title,
					imgurl: image,
					attribution: exhibition.description ?? ''
				};
			});
		}
	});

	function openPdfFile(pdfLink: string) {
		const completePdfLink = import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_PDF_URL + '/' + pdfLink;
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		const newWindow = window.open();
		if (newWindow !== null) {
			newWindow.document.body.innerHTML = `<iframe src="${completePdfLink}" width="100%" height="100%"></iframe>`;
		}
	}
</script>

<section class="w-full flex-1 overflow-x-hidden">
	<a
		href={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_PDF_URL}/${exhibition?.pdf_files}`}
		target="_blank"
		class="btn btn-primary"
	>
		Open PDF
	</a>

	{#if exhibitionImage.length > 0}
		<Carousel
			slideClass="w-full"
			divClass="w-full"
			images={exhibitionImage}
			loop
			transitionType="fade"
			transitionParams={{ duration: 2000 }}
			showCaptions={false}
			showThumbs={false}
			slideControls={false}
			showIndicators={false}
			duration={5000}
		/>
	{/if}
	<div>
		<div class="{Constants.page_max_width} mx-auto w-full">
			<div class=" items-start flex flex-col justify-around">
				<div class="w-full">
					<div class="py-8 flex justify-center">
						<TitleUi
							text={$LL.reservation.title()}
							borderColor={$exhibitionCurrentMainThemeColors.primaryColor}
							textColor={$exhibitionCurrentMainThemeColors.overlayBackgroundColor}
						/>
					</div>
					{#if exhibition?.image_map}
						<ExhibitionMapImage {exhibition} />
					{/if}
				</div>
				<div class="w-full h-20" />
				<div class="w-full flex flex-col">
					<div
						style="background-color: {$exhibitionCurrentMainThemeColors.secondaryColor};"
						class="px-5 py-16 rounded-lg grid md:grid-cols-3 md:justify-between w-full justify-center"
					>
						<div class="flex h-20 items-center my-1">
							<div
								style="background-color :{$currentMainThemeColors.primaryColor};color: {$currentMainThemeColors.overlayPrimaryColor}"
								class="flex rounded-full justify-center items-center h-20 w-20"
							>
								<GlobeAsiaAustralia size="50" />
							</div>
							<div class="h-full w-4" />
							<div class="flex flex-col w-40">
								{#if exhibition}
									<h2
										style="color: {$currentMainThemeColors.overlayPrimaryColor}"
										class="text-2xl font-bold"
									>
										<NumberAnimationIncrement value={exhibition.country_number} duration={3000} />
									</h2>
								{/if}
								<p style="color: {$currentMainThemeColors.overlayPrimaryColor}" class="text-lg">
									{$LL.exhibition_mini_data.Countries()}
								</p>
							</div>
						</div>
						<div class="flex h-20 items-center my-1">
							<div
								style="background-color :{$currentMainThemeColors.primaryColor};color: {$currentMainThemeColors.overlayPrimaryColor}"
								class="flex rounded-full h-20 w-20 justify-center items-center"
							>
								<BuildingOffice2 size="50" />
							</div>
							<div class="h-full w-4" />
							<div class="flex flex-col">
								<h2
									style="color: {$currentMainThemeColors.overlayPrimaryColor}"
									class=" text-2xl font-bold"
								>
									{#if exhibition}
										<NumberAnimationIncrement value={exhibition?.company_number} duration={1000} />
									{/if}
								</h2>
								<p style="color: {$currentMainThemeColors.overlayPrimaryColor}" class=" text-lg">
									{$LL.exhibition_mini_data.Companies()}
								</p>
							</div>
						</div>
						<div class="flex h-20 items-center my-1">
							<div
								style="background-color :{$currentMainThemeColors.primaryColor};color: {$currentMainThemeColors.overlayPrimaryColor}"
								class="flex rounded-full h-20 w-20 justify-center items-center"
							>
								<MapPin size="50" />
							</div>
							<div class="h-full w-4" />
							<div class="flex flex-col dark:text-white">
								<h2
									style="color: {$currentMainThemeColors.overlayPrimaryColor}"
									class=" text-2xl font-bold uppercase tracking-wide"
								>
									{exhibition?.location_title ?? 'Not Available'}
								</h2>
								<p style="color: {$currentMainThemeColors.overlayPrimaryColor}" class=" text-lg">
									{exhibition?.location ?? 'Not Available'}
								</p>
							</div>
						</div>
					</div>
					<div class="w-full flex flex-row justify-center pt-16 pb-10">
						<TitleUi
							text={$LL.exhibition_mini_data.Brochure()}
							borderColor={$exhibitionCurrentMainThemeColors.primaryColor}
							textColor={$exhibitionCurrentMainThemeColors.overlayBackgroundColor}
						/>
					</div>
					<div class="grid">
						<div class="w-full relative mx-auto">
							{#if exhibition?.pdf_files}
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
								<img
									class="w-full rounded-xl hover:shadow-2xl shadow-lg transition-all cursor-pointer"
									on:click={() => {
										openPdfFile(exhibition?.pdf_files);
									}}
									src={exhibition?.brochure ?? exhibition?.thumbnail}
									alt={exhibition?.title}
								/>
							{:else}
								<img
									class="w-full h-100 rounded-xl shadow-lg transition-all"
									src={exhibition?.brochure ?? exhibition?.thumbnail}
									alt={exhibition?.title}
								/>
							{/if}
						</div>
						<div class="px-2 py-4 flex justify-between flex-col items-start">
							<div class="flex flex-col items-start">
								<p
									class="text-lg"
									style="color: {$exhibitionCurrentMainThemeColors.overlaySecondaryColor}"
								>
									{#if exhibition?.story && exhibition.story.length > 600}
										{exhibition?.story?.slice(0, 600) || 'No Story Available'}...
									{:else}
										{exhibition?.story ?? 'No Story Available'}.
									{/if}
								</p>
							</div>
						</div>
					</div>
					<NewsSection supabase={data.supabase} exhibitionId={$page.params.exhibitionId} />
					<div class="w-full h-10" />
				</div>
				<div class="w-full h-10" />
			</div>
		</div>
		{#if youtubeRegex.exec(exhibition?.video_youtube_link)}
			<div class="{Constants.page_max_width} mx-auto w-full">
				<VideoPlayer videoUrl={exhibition?.video_youtube_link} />
			</div>
		{/if}

		{#if exhibition && exhibition.sponsor_images && exhibition.sponsor_images.length > 0}
			<div class="flex justify-between items-center pt-14 pb-5">
				<div class="h-10 w-32" />
				<div class="">
					<TitleUi
						text={exhibition?.sponsor_title ?? $LL.exhibition_mini_data.Exhibition_Sponsors()}
						borderColor={$exhibitionCurrentMainThemeColors.primaryColor}
						textColor={$exhibitionCurrentMainThemeColors.overlayBackgroundColor}
					/>
				</div>
				<div class="flex justify-end w-32" />
			</div>
			<div class="{Constants.page_max_width} mx-auto pb-10">
				<SponsorSlider images={exhibition.sponsor_images} />
			</div>
		{/if}
	</div>
</section>
