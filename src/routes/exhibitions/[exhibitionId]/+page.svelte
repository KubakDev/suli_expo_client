<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, tick } from 'svelte';
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import { exhibitionStore } from '../../../stores/exhibtionStore';
	import type { ExhibitionModel } from '../../../models/exhibitionModel';
	import Constants from '../../../utils/constants';
	import { fade } from 'svelte/transition'; // import the fade transition
	import NewsSection from '$lib/components/NewsSection/NewsSection.svelte';
	import { AcademicCap, MapPin, Plus } from 'svelte-heros-v2';
	import VideoSection from '$lib/components/VideoSection.svelte';
	import moment from 'moment';
	import NumberAnimationIncrement from '$lib/components/NumberAnimationIncrement.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import PdfViewer from 'svelte-pdf';

	export let data;

	let exhibition: ExhibitionModel | undefined | null;
	async function getExhibition() {
		exhibition = await exhibitionStore.getSingle($locale, data.supabase, $page.params.exhibitionId);
		console.log("Exibition Data",exhibition);
		exhibitionStore.get(data.supabase);
		
	}

	let currentImageIndex = 0;

	onMount(async () => {
		await getExhibition();
		if (exhibition!.images.length) {
			const interval = setInterval(() => {
				currentImageIndex = (currentImageIndex + 1) % exhibition!.images.length;
			}, 3000); // change image every 2 seconds

			() => clearInterval(interval); // clear interval on component unmount
		}
	});
</script>

<section class="w-full flex-1">
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

	<div class=" {Constants.page_max_width} mx-auto w-full">
		<div class=" items-start flex flex-col justify-around">
			<NewsSection supabase={data.supabase} />
			<div class="w-full h-20" />
			<div class="w-full flex flex-col">
				<div class="grid grid-cols-3 justify-between w-full">
					<div class="flex h-20 items-center">
						<div class="flex bg-white rounded-full justify-center items-center h-20 w-20 bloc">
							<img src="/icons/earth.png" alt="" class="w-10 h-10" />
						</div>
						<div class="h-full w-4" />
						<div class="flex flex-col w-40 dark:text-white">
							{#if exhibition}
								<h2 class="text-2xl font-bold">
									<NumberAnimationIncrement value={exhibition.country_number} duration={3000} />
								</h2>
							{/if}
							<p class="text-lg">{$LL.exhibition_mini_data.Countries()}</p>
						</div>
					</div>
					<div class="flex h-20 items-center">
						<div class="flex bg-white rounded-full h-20 w-20 justify-center items-center bloc">
							<img src="/icons/company.png" alt="" class="w-10 h-10" />
						</div>
						<div class="h-full w-4" />
						<div class="flex flex-col dark:text-white">
							<h2 class="text-2xl font-bold">
								{#if exhibition}
								<NumberAnimationIncrement value={exhibition?.company_number} duration={1000} />
								{/if}
							</h2>
							<p class="text-lg">{$LL.exhibition_mini_data.Companies()}</p>
						</div>
					</div>
					<div class="flex h-20 items-center">
						<div class="flex bg-white rounded-full h-20 w-20 justify-center items-center bloc">
							<MapPin size="50" color="black" />
						</div>
						<div class="h-full w-4" />
						<div class="flex flex-col dark:text-white">
							<h2 class="text-2xl font-bold">{$LL.exhibition_mini_data.Reservation.title()}</h2>
							<p class="text-lg">{$LL.exhibition_mini_data.Reservation.place()}</p>
						</div>
					</div>
				</div>
				<div class="w-full h-10" />
				<div class="grid grid-cols-2">
					<div class="  h-100 w-full relative">
						<img class="object-cover w-full h-100" src={exhibition?.thumbnail} alt="{exhibition?.title}" />
						<div
							class="flex justify-center items-center absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent"
						>
							<h1 class="text-4xl font-bold text-white bg-black opacity-75 w-full text-center">
								<!--  format date to yyyy-mm-dd -->
								{moment(exhibition?.exhibition_date).format('DD MMMM YYYY')}
							</h1>
						</div>
					</div>
					<div class="p-8 flex justify-between flex-col items-start">
						<div class="flex flex-col items-start">
							<h1 class="text-4xl font-bold dark:text-white">{$LL.exhibition_mini_data.Story()}</h1>
							<p class="text-lg dark:text-white">
								Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed
								to using 'Content here, content gfshere', makinlook like readable English. Many
								desktop publishing packages.
							</p>
						</div>
					</div>
				</div>
				<div class="w-full h-10" />
			</div>
			<div class="w-full h-10" />
		</div>
	</div>
	<div class="w-full h-48 bg-white flex flex-col justify-around items-center py-10">
		<div class="text-3xl uppercase">{$LL.exhibition_mini_data.Fair()}</div>

		<div class="text-xl">
			distribution of letters, as opposed to using 'Content here, content, makinlook like readable
			English. Many desktop publishing packages.
		</div>
	</div>
	{#if exhibition?.pdf_files.length || [].length > 0}
	<div class="w-full max-h-[50vh] flex flex-col justify-start items-center py-2">
		<TitleUi text="Exhibition PDF's" customClass=" dark:text-white text-secondary " />
		<div class="flex flex-row justify-around overflow-x-auto overflow-y">
			{#each exhibition?.pdf_files || [] as pdf}
			<div class="pb-5 hover:dark:bg-slate-700 bg-opacity-20 rounded-lg m-2 transition-all w-full">
				<PdfViewer url={pdf} showButtons={["download"]} scale={0.55} data={""} downloadFileName="{exhibition?.title}"  />
			</div>
			{/each}
		</div>
	</div>
	{/if}
	<div class="{Constants.page_max_width} mx-auto">
	{#if exhibition && exhibition.video_youtube_id}
		<VideoPlayer  videoUrl={exhibition.video_youtube_id} />
	{/if}
	</div>
</section>
