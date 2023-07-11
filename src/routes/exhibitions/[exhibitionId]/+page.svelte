<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, tick } from 'svelte';
	import LL, { locale } from '$lib/i18n/i18n-svelte';
	import { exhibitionStore } from '../../../stores/exhibtionStore';
	import type { ExhibitionModel } from '../../../models/exhibitionModel';
	import Constants from '../../../utils/constants';
	import { fade } from 'svelte/transition'; // import the fade transition
	import NewsSection from '$lib/components/NewsSection/NewsSection.svelte';
	import { MapPin } from 'svelte-heros-v2';
	import moment from 'moment';
	import NumberAnimationIncrement from '$lib/components/NumberAnimationIncrement.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';
	import {
		Button,
		Card,
		CarouselTransition,
		Chevron,
		Dropdown,
		DropdownDivider,
		DropdownItem
	} from 'flowbite-svelte';
	import { FilePdfOutline, FilePdfSolid, OpenBookSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import ReservationComponent from '$lib/components/ReservationComponent.svelte';

	export let data;

	let exhibition: ExhibitionModel | undefined | null;
	async function getExhibition() {
		exhibition = await exhibitionStore.getSingle($locale, data.supabase, $page.params.exhibitionId);
		console.log('Exibition Data', exhibition);
		exhibitionStore.get($locale, data.supabase);
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

	function pdf_page(pdf_url: string) {
		window.open(pdf_url, '_blank');
	}
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
	<div>
		<!-- {#if exhibition?.seat_layout.length > 0} -->
		<div class="{Constants.page_max_width} mx-auto">
			<div class="flex justify-center w-full py-12">
				<TitleUi
					text="{$LL.exhibition_mini_data.Exhibition_Seats()}"
					customClass=" dark:text-white text-secondary text-center"
				/>
			</div>
			<div class="border-solid border-y-2 rounded-3xl">
				<ReservationComponent data={exhibition?.seat_layout} />
			</div>
		</div>
		<!-- {/if} -->
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
							<img
								class="object-cover w-full h-100"
								src={exhibition?.thumbnail}
								alt={exhibition?.title}
							/>
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
								<h1 class="text-4xl font-bold dark:text-white">
									{$LL.exhibition_mini_data.Story()}
								</h1>
								<p class="text-lg dark:text-white">
									Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
									opposed to using 'Content here, content gfshere', makinlook like readable English.
									Many desktop publishing packages.
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
			<div class="flex justify-center w-full pt-12">
				<TitleUi
					text="{$LL.exhibition_mini_data.Exhibition_PDF()}"
					customClass=" dark:text-white text-secondary text-center"
				/>
			</div>
			<div class="flex xl:flex-row flex-col pt-8 {Constants.page_max_width} mx-auto">
				<div class="flex flex-col items-end py-5 w-full">
					<div
						class="xl:w-[45vh] w-full flex flex-col justify-center mt-1 items-center overflow-x-hidden overflow-y-auto max-h-[26vh] {Constants.scrollbar_layout}"
					>
						{#each exhibition?.pdf_files || [] as pdf}
							<Card horizontal class="my-1 w-full p-2 ">
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
					</div>
				</div>
				<div class="flex flex-col justify-center items-center px-2 h-full">
					<h1 class="dark:text-slate-50 text-3xl py-5 font-bold">Hello There Adventure</h1>
					<span class="dark:text-slate-200 px-4 text-center">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore maiores nam
						perspiciatis recusandae labore dolorem eligendi iste laboriosam corporis aliquam ipsum
						porro et, eius iusto quo est molestias accusamus cumque. Lorem ipsum dolor sit amet
						consectetur adipisicing elit. Natus aliquid a fugit minus, cum repellendus eligendi
						saepe maiores voluptates reprehenderit esse quis. Temporibus maxime ipsam, accusamus
						rerum laboriosam odit cumque.
					</span>
				</div>
			</div>
		{/if}
		<div class="{Constants.page_max_width} mx-auto">
			{#if exhibition && exhibition.video_youtube_id}
				<VideoPlayer videoUrl={exhibition.video_youtube_id} />
			{/if}
		</div>
</section>
