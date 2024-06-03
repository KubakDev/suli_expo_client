<script lang="ts">
	import { onMount } from 'svelte';
	import { Marquee } from 'flowbite-svelte'
	export let images: string[];

	let currentIndex = 0;
	let visibleImages: any = [];

	// // Initialize the visible images with the first three images
	// $: updateVisibleImages();

	function updateVisibleImages() {
		visibleImages = images.slice(currentIndex, currentIndex + 3);
		if (visibleImages.length < 3) {
			visibleImages = [...visibleImages, ...images.slice(0, 3 - visibleImages.length)];
		}
	}

	// function nextSlide() {
	// 	currentIndex = (currentIndex + 1) % images.length;
	// 	updateVisibleImages();
	// }

	onMount(() => {
		updateVisibleImages();
	});
</script>

{#if images.length > 0}
<Marquee speed={0.5} hoverSpeed={0.3} class="py-16 gap-2">
	{#each images as image}
		<img class="w-32 h-32 p-1" alt="flowbite-svelte icon logo" src="{image}" />
	{/each}
</Marquee>
{/if}
<!-- 
<style>
	.marquee {
overflow: hidden; 
}

.marquee-content {
  display: flex;
  animation: scrolling 10s linear infinite;
}

.marquee-item {
  flex: 0 0 16vw;
  margin: 0 1vw;
/*   flex: 0 0 20vw; */
/*   margin: 0 2vw; */
}

.marquee-item img {
  display: block;
  width: 100%;
/*   padding: 0 20px; */
}

@keyframes scrolling {
  0% { transform: translateX(0); }
  100% { transform: translatex(-144vw); }
}
</style> -->
