<script lang="ts">
	import { onMount } from 'svelte';

	export let images: string[];

	let currentIndex = 0;
	let visibleImages: any = [];

	// Initialize the visible images with the first three images
	$: updateVisibleImages();

	function updateVisibleImages() {
		visibleImages = images.slice(currentIndex, currentIndex + 3);
		if (visibleImages.length < 3) {
			visibleImages = [...visibleImages, ...images.slice(0, 3 - visibleImages.length)];
		}
	}

	function nextSlide() {
		currentIndex = (currentIndex + 1) % images.length;
		updateVisibleImages();
	}

	onMount(() => {
		const interval = setInterval(nextSlide, 4000);
		return () => clearInterval(interval);
	});
</script>

<div class="slideshow-container">
	{#each visibleImages as image, index}
		<div class="slide">
			<img src={image} alt="Slideshow image" />
		</div>
	{/each}
</div>

<style>
	.slideshow-container {
		display: flex;
		overflow: hidden;
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		position: relative;
	}
	.slide {
		min-width: 33.33%;
		transition: transform 0.5s ease-in-out;
	}
	img {
		width: 100%;
		height: auto;
	}
</style>
