<script lang="ts">
	import { fade } from 'svelte/transition';
	import { locale } from '$lib/i18n/i18n-svelte';

	export let videos: Video[] = [];
	let videoIds: any = [];
	interface Video {
		title: string;
		video_link: string;
		thumbnail: string | null;
		element?: HTMLIFrameElement;
		playing?: boolean;
	}

	function nextVideo() {
		currentVideo++;
		if (currentVideo >= videos.length) {
			currentVideo = 0;
		}
	}

	function prevVideo() {
		currentVideo--;
		if (currentVideo < 0) {
			currentVideo = videos.length - 1;
		}
	}

	let currentVideo: number = 0;

	let dots: any = [];

	$: {
		// Generate dots
		dots = Array.from({ length: videos.length }, (_, i) => i);
	}

	$: {
		if ($locale) {
			// Map links to IDs
			videos.forEach((video, index) => {
				videoIds[index] = getVideoId(video.video_link);
			});
		}
	}

	function getVideoUrl(id: string) {
		return `https://www.youtube.com/embed/${id}`;
	}

	// Extract ID from link
	const getVideoId = (url: string) => {
		const regex =
			/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

		return url.match(regex)?.[1] ?? '';
	};

	const handleThumbnailClick = () => {
  // Show video iframe
  videos[currentVideo].playing = true;
  
  // Hide thumbnail
  videos[currentVideo].thumbnail = null; 
}
</script>

<div class="pt-10">
	<div class="video-container" in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>

		{#if videos[currentVideo].thumbnail}
	
			<button on:click={handleThumbnailClick}>
				<div
					class="video-thumbnail"
					style="background-image:url({videos[currentVideo].thumbnail})"
				>
		
					<div class="play-button">
						<svg class="play-icon" viewBox="0 0 24 24">
							<path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
						</svg>
					</div>
				</div>
			</button>
		{/if}

		<iframe
			class="video-player {videos[currentVideo].playing ? 'block' : 'hidden'}"
			src={getVideoUrl(videoIds[currentVideo]) + '?enablejsapi=1'}
			bind:this={videos[currentVideo].element}
			title={videos[currentVideo].title[currentVideo]}
			frameborder="0"
			allowfullscreen
		/>

		<div class="absolute inset-y-1/2 flex items-center justify-between px-4 w-full">
			<button
				on:click={prevVideo}
				class="p-2 bg-white rounded-full bg-opacity-75 hover:bg-opacity-100"
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
	
			<button
				on:click={nextVideo}
				class="p-2 bg-white rounded-full bg-opacity-75 hover:bg-opacity-100"
			>
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
		<div class="dots absolute bottom-4 left-1/2 -translate-x-1/2 flex">
			{#each dots as dot}
				<button
					class:bg-white={currentVideo === dot}
					class="bg-gray-500 rounded-full w-3 h-3 mx-1 {currentVideo === dot
						? 'bg-white'
						: 'bg-gray-500'}"
					on:click={() => (currentVideo = dot)}
				/>
			{/each}
		</div>
		
	</div>


	<!-- Video titles -->
	<!-- <div
			class="absolute top-0 w-full px-4 py-6 bg-gray-900 bg-opacity-50 text-white uppercase font-bold rounded-t-xl"
		>
			<p class="text-sm">{videos[currentVideo].title}</p>
		</div> -->

	<!-- Control buttons -->
</div>

<style>

	/* Use tailwind classes to style the component */
	.video-container {
		position: relative;
		width: 100%;
		padding-top: 56.25%; /* Aspect ratio of 16:9 */
	}

	.video-player,
	.video-thumbnail {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 0.5rem;
	}

	.video-thumbnail {
		display: flex;
		align-items: center;
		justify-content: center;
		background-size: cover;
		background-position: center;
		cursor: pointer;
	}

	.play-button {
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.play-icon {
		width: 2rem;
		height: 2rem;
		fill: #111111;
	}
</style>
