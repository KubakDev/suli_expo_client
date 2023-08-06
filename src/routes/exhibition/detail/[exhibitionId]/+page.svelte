<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, tick } from 'svelte';
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import { exhibitionStore } from '../../../../stores/exhibtionStore';
	import type { ExhibitionModel } from '../../../../models/exhibitionModel';
	import Constants from '../../../../utils/constants';
	import { fade } from 'svelte/transition'; // import the fade transition
	import { CollapsibleCard } from 'svelte-collapsible';
	import NewsSection from '$lib/components/NewsSection/NewsSection.svelte';
	import { MapPin, BuildingOffice2, GlobeAsiaAustralia, CloudArrowDown } from 'svelte-heros-v2';
	import moment from 'moment';
	import NumberAnimationIncrement from '$lib/components/NumberAnimationIncrement.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	//@ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { Card } from 'flowbite-svelte';
	import { FilePdfSolid, OpenBookSolid } from 'flowbite-svelte-icons';
	import SponsorSlider from '$lib/components/SponsorSlider.svelte';

	export let data: any;

	let exhibition: ExhibitionModel;
	async function getExhibition() {
		exhibition = (await exhibitionStore.getSingle(
			$locale,
			data.supabase,
			$page.params.exhibitionId
		)) as ExhibitionModel;
	}

	let currentImageIndex = 0;

	$: {
		if ($locale) {
			getExhibition();
		}
	}

	onMount(async () => {
		await getExhibition();
		if (exhibition!.images.length) {
			const interval = setInterval(() => {
				currentImageIndex = (currentImageIndex + 1) % exhibition!.images.length;
			}, 3000); // change image every 2 seconds

			() => clearInterval(interval); // clear interval on component unmount
		}

		console.log(exhibition);
	});

	function pdf_page(pdf_url: string) {
		window.open(pdf_url, '_blank');
	}
</script>

<section class="w-full flex-1 overflow-x-hidden">
	<div class="w-full h-200 relative">
		{#if exhibition?.images.length}
			{#key currentImageIndex}
				<img
					src={exhibition.images[currentImageIndex]}
					alt=""
					class="w-full object-cover absolute h-200 slide-img"
					in:fade={{ duration: 1000 }}
					out:fade={{ duration: 1000 }}
				/>
			{/key}
		{/if}
	</div>
	<div>
		<div class="{Constants.page_max_width} mx-auto w-full">
			<div class="items-start flex flex-col justify-around">
				<!-- <div class="flex flex-col w-full h-full bg-gradient-to-r from-rose-500  to-blue-300 my-2 py-2 px-4 rounded-3xl border-solid border-2 dark:border-slate-200 shadow-md hover:shadow-xl shadow-blue-500/50 hover:shadow-red-500/50 opacity-80 hover:opacity-100 transition-all">
					{#if exhibition}
						<ExhibitionDate
							start_date={exhibition?.start_date || new Date()}
							end_date={exhibition?.end_date || new Date()}
						/>
					{/if}
				</div> -->
				<div class="w-full h-20" />
				<div class="w-full flex flex-col">
					<div class="grid md:grid-cols-3 md:justify-between w-full justify-center">
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
									class="text-exhibitionLightOverlayBackgroundColor dark:text-exhibitionDarkOverlayBackgroundColor text-2xl font-bold"
								>
									{exhibition?.location_title ?? 'No Location Available'}
								</h2>
								<p
									class="text-exhibitionLightOverlayBackgroundColor dark:text-exhibitionDarkOverlayBackgroundColor text-lg"
								>
									{exhibition?.location ?? 'No Address Available'}
								</p>
							</div>
						</div>
					</div>
					<div class="w-full h-10">
						<h3
							class="text-xl pt-2 flex flex-row font-bold text-exhibitionLightPrimaryColor w-full"
						>
							<!--  format date to yyyy-mm-dd -->
							{moment(exhibition?.exhibition_date).format('DD MMMM YYYY')}
						</h3>
					</div>
					<div class="grid md:grid-cols-2">
						<div class="h-100 w-full relative">
							<img
								class="object-cover w-full h-100"
								src={exhibition?.thumbnail}
								alt={exhibition?.title}
							/>
							<div
								class="flex justify-center items-center absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent"
							/>
						</div>
						<div class="p-8 flex justify-between flex-col items-start">
							<div class="flex flex-col items-start">
								<!-- {#if exhibition?.pdf_files && exhibition.pdf_files.length > 0} -->
								<CollapsibleCard open={false} duration={1} easing="ease-in-out">
									<h2
										slot="header"
										class="text-blue-400 cursor-pointer flex flex-row w-full justify-start font-bold hover:underline"
									>
										<CloudArrowDown width="25" height="25" class="pr-[1px]" /> Download
									</h2>
									<p slot="body" class="flex flex-col">
										{#each exhibition?.pdf_files || [] as pdf, index}
											<a href={pdf} target="_blank" class="text-center text-blue-500 flex flex-row py-1 font-bold tracking-wide uppercase hover:no-underline hover:text-primary-500"><FilePdfSolid class="dark:text-red-500 mx-2" />{exhibition.title} {index+1}</a>
										{/each}
									</p>
								</CollapsibleCard>

								<!-- {/if} -->

								<h1
									class="text-exhibitionLightOverlayBackgroundColor dark:text-exhibitionDarkOverlayBackgroundColor text-4xl font-bold"
								>
									{$LL.exhibition_mini_data.Story()}
								</h1>

								<p
									class="text-exhibitionLightOverlayBackgroundColor dark:text-exhibitionDarkOverlayBackgroundColor text-lg"
								>
									{#if exhibition?.story && exhibition.story.length > 600}
										{exhibition?.story?.slice(0, 600) || 'No Story Available'}...
									{:else}
										{exhibition?.story ?? 'No Story Available'}
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

		<!-- <div
			class="bg-transparentSecondaryColor w-full h-48 flex-col justify-around items-center py-10 flex flex-wrap text-center"
			>
			<div class="mx-auto max-w-screen-lg">
				<div class="text-exhibitionSecondaryColor lg:text-3xl text-lg uppercase font-bold">
					{$LL.exhibition_mini_data.Fair()}
				</div>

				<div
					class="text-exhibitionOverlaySecondaryColor lg:text-xl text-base py-4 [word-spacing:5px]"
					>
					distribution of letters, as opposed to using 'Content here, content, makinlook like
					readable English. Many desktop publishing packages.
				</div>
			</div>
		</div> -->
		<!-- {#if exhibition?.pdf_files.length || [].length > 0}
			<div class="{Constants.page_max_width} mx-auto">
				<div class="flex justify-center w-full pt-12">
					<TitleUi text={$LL.exhibition_mini_data.Exhibition_PDF()} />
				</div>
				<div class="flex xl:flex-row flex-col py-12"> -->
		<!-- <div class="flex flex-col items-end py-5 w-full">
						<div
						class="xl:w-[45vh] w-full flex flex-col justify-center items-center overflow-x-hidden overflow-y-auto max-h-[26rem] {Constants.scrollbar_layout}"
						>
							{#each exhibition?.pdf_files || [] as pdf}
							<Card horizontal class="my-2 w-full">
									<div class="w-full h-full">
										<button
											class="flex justify-between flex-row items-center w-full h-full"
											on:click={() => {
												pdf_page(pdf);
											}}
										>
											<FilePdfSolid class="dark:text-red-500 mx-2" />
											<h5
												class="text-base font-bold tracking-tight text-gray-900 dark:text-white flex justify-end"
											>
												{exhibition?.title}
											</h5>
											<OpenBookSolid
											class="dark:text-blue-500 transition-all dark:hover:animate-pulse"
											/>
										</button>
									</div>
								</Card>
							{/each}
						</div> -->
		<!-- </div> -->
		<!-- <div class="flex flex-col justify-center items-center px-2 h-full">
						<h1 class="dark:text-slate-50 text-3xl py-5 font-bold">Exhibition Story</h1>
						<span class="dark:text-slate-200 px-4 text-justify flex flex-row">
							{exhibition?.story} -->
		<!-- <div class="relative w-0 h-0">
								<LottiePlayer
								class="flex justify-center items-center"
								src="../../../../lottie/PDF lottie Jason Done.json"
									autoplay={true}
									loop={true}
									height="{250}"
									width="{250}"
								/>
							</div> -->
		<!-- </span>
					</div> -->
		<!-- </div>
			</div> -->
		<!-- {/if} -->
		<div class="{Constants.page_max_width} mx-auto">
			<VideoPlayer videoUrl={exhibition?.video_youtube_link + ''} />
		</div>

		{#if exhibition && exhibition.sponsor_images && exhibition.sponsor_images.length > 0}
			<div class="{Constants.page_max_width} mx-auto">
				<SponsorSlider locale={$locale} {exhibition} />
			</div>
		{/if}
		<!-- {#if exhibition?.seat_layout.length > 0} -->
		<!-- <div class="{Constants.page_max_width} mx-auto py-8">
			<div class="flex justify-center w-full py-12">
				<TitleUi
					text={$LL.exhibition_mini_data.Exhibition_Seats()}
					customClass=" dark:text-white text-secondary text-center"
				/>
			</div>
			<div class="border-solid border-t-2 rounded-3xl border-opacity-100">
				<ReservationComponent data={exhibition?.seat_layout} />
			</div>
		</div> -->
		<!-- {/if} -->
	</div>
</section>
