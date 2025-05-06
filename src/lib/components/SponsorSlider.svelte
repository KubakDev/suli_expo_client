<script lang="ts">
	export let images: string[];

	let duplicatedImages: string[];

	$: {
		const sets = Math.ceil(window.innerWidth / (images.length * 200)) + 2;
		duplicatedImages = Array(sets).fill(images).flat();
	}
</script>

<section>
	<div class="slider">
		<!-- Removed gradient overlays -->
		<div class="slider-items">
			{#each duplicatedImages as image}
				<div class="image-wrapper">
					<img 
						src={image} 
						alt="Sponsor logo"
						loading="lazy"
					/>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	section {
		width: 100%;
		padding: 4rem 0;
		background: var(--background-color);
		border-radius: 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
		backdrop-filter: blur(12px);
	}

	.slider {
		position: relative;
		width: 100%;
		max-width: 1400px;
		overflow: hidden;
	}

	.slider-items {
		display: flex;
		align-items: center;
		gap: 3rem;
		padding: 0 3rem;
		animation: scroll 40s linear infinite;
	}

	.image-wrapper {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.3s ease;
	}

	img {
		height: 80px;
		max-width: 200px;
		object-fit: contain;
		transition: transform 0.3s ease, filter 0.3s ease;
		filter: grayscale(60%);
	}

	img:hover {
		transform: scale(1.1);
		filter: grayscale(0%);
	}

	/* Removed .gradient-overlay styles */

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-33.333%);
		}
	}

	@media (max-width: 768px) {
		.slider {
			padding: 1.5rem 0;
		}

		.slider-items {
			gap: 2rem;
			padding: 0 1.5rem;
		}

		img {
			height: 60px;
		}
	}
</style>
