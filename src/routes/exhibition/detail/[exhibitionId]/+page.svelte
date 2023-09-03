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
		console.log(completePdfLink);
		

		const newWindow = window.open();
		if (newWindow !== null) {
			newWindow.document.body.innerHTML = `<iframe src="${completePdfLink}" width="100%" height="100%"></iframe>`;
		}
	}
</script>

<section class="w-full flex-1 overflow-x-hidden">
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
						<TitleUi text={$LL.reservation.title()} />
					</div>
					{#if exhibition?.image_map}
						<ExhibitionMapImage {exhibition} />
					{/if}
				</div>
				<div class="w-full h-20" />
				<div class="w-full flex flex-col">
					<div class="grid md:grid-cols-3 md:justify-between w-full justify-center pb-6">
						<div class="flex h-20 items-center my-1">
							<div
								class="flex rounded-full justify-center items-center h-20 w-20 bg-exhibitionLightSecondaryColor dark:bg-exhibitionDarkSecondaryColor"
							>
								<GlobeAsiaAustralia
									class="text-exhibitionLightBackgroundColor dark:text-exhibitionDarkBackgroundColor"
									size="50"
								/>
							</div>
							<div class="h-full w-4" />
							<div class="flex flex-col w-40">
								{#if exhibition}
									<h2
										class="text-2xl text-exhibitionLightOverlayBackgroundColor dark:text-exhibitionDarkOverlayBackgroundColor font-bold"
									>
										<NumberAnimationIncrement value={exhibition.country_number} duration={3000} />
									</h2>
								{/if}
								<p
									class="text-exhibitionLightOverlayBackgroundColor dark:text-exhibitionDarkOverlayBackgroundColor text-lg"
								>
									{$LL.exhibition_mini_data.Countries()}
								</p>
							</div>
						</div>
						<div class="flex h-20 items-center my-1">
							<div
								class="flex rounded-full h-20 w-20 justify-center items-center bg-exhibitionLightSecondaryColor dark:bg-exhibitionDarkSecondaryColor"
							>
								<BuildingOffice2
									class="text-exhibitionLightBackgroundColor dark:text-exhibitionDarkBackgroundColor"
									size="50"
								/>
							</div>
							<div class="h-full w-4" />
							<div class="flex flex-col">
								<h2
									class="text-exhibitionLightOverlayBackgroundColor dark:text-exhibitionDarkOverlayBackgroundColor text-2xl font-bold"
								>
									{#if exhibition}
										<NumberAnimationIncrement value={exhibition?.company_number} duration={1000} />
									{/if}
								</h2>
								<p
									class="text-exhibitionLightOverlayBackgroundColor dark:text-exhibitionDarkOverlayBackgroundColor text-lg"
								>
									{$LL.exhibition_mini_data.Companies()}
								</p>
							</div>
						</div>
						<div class="flex h-20 items-center my-1">
							<div
								class="flex rounded-full h-20 w-20 justify-center items-center bg-exhibitionLightSecondaryColor dark:bg-exhibitionDarkSecondaryColor"
							>
								<MapPin
									size="50"
									class="text-exhibitionLightBackgroundColor dark:text-exhibitionDarkBackgroundColor"
								/>
							</div>
							<div class="h-full w-4" />
							<div class="flex flex-col dark:text-white">
								<h2
									class="text-exhibitionLightOverlayBackgroundColor dark:text-exhibitionDarkOverlayBackgroundColor text-2xl font-bold uppercase tracking-wide"
								>
									{exhibition?.location_title ?? 'Not Available'}
								</h2>
								<p
									class="text-exhibitionLightOverlayBackgroundColor dark:text-exhibitionDarkOverlayBackgroundColor text-lg"
								>
									{exhibition?.location ?? 'Not Available'}
								</p>
							</div>
						</div>
					</div>
					<div class="w-full flex flex-row justify-center">
						<h1
							class="text-exhibitionLightOverlayBackgroundColor dark:text-exhibitionDarkOverlayBackgroundColor text-2xl font-bold text-center pb-4 w-full"
						>
							{$LL.exhibition_mini_data.Brochure()}
						</h1>
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
						<div class="p-8 flex justify-between flex-col items-start">
							<div class="flex flex-col items-start">
								<p
									class="text-exhibitionLightOverlayBackgroundColor dark:text-exhibitionDarkOverlayBackgroundColor text-lg"
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
			<div class="{Constants.page_max_width} mx-auto">
				<VideoPlayer videoUrl={exhibition?.video_youtube_link} />
			</div>
		{/if}

		{#if exhibition && exhibition.sponsor_images && exhibition.sponsor_images.length > 0}
			<div class="flex justify-between items-center py-5">
				<div class="h-10 w-32" />
				<div class="">
					<TitleUi
						text={exhibition?.sponsor_title ?? $LL.exhibition_mini_data.Exhibition_Sponsors()}
					/>
				</div>
				<div class="flex justify-end w-32" />
			</div>
			<div class="{Constants.page_max_width} mx-auto">
				<SponsorSlider images={exhibition.sponsor_images} />
			</div>
		{/if}
	</div>
</section>
