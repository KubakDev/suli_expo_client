<script lang="ts">
	import '@splidejs/splide/css'; 
	import { onMount } from 'svelte';
	import Splide from '@splidejs/splide';
	import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
	export let images: string[];

	onMount(() => {
		const splide = new Splide('.splide', {
			type: 'loop',
			drag: 'free',
			focus: 'center',
			perPage: 5,  // Show 5 sponsors at once
			gap: '1rem', // Space between sponsors
			arrows: false, // Hide navigation arrows
			pagination: false, // Hide pagination dots
			autoScroll: {
				speed: 1,
				pauseOnHover: true,
			},
		});

		splide.mount({ AutoScroll });

		return () => {
			splide.destroy();
		};
	});
</script>

{#if images.length > 0}
	<div class="splide">
		<div class="splide__track">
			<ul class="splide__list">
				{#each images as image}
					<li class="splide__slide">
						<img
							class="w-32 h-32  p-1 object-contain"
							alt="sponsor logo"
							src={image}
							loading="eager"
						/>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}

<style>
	/* Optional: Add any custom styles here */
	:global(.splide__slide) {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
