<script lang="ts">
	// import { exhibitionCurrentMainThemeColors } from "../../stores/darkMode";

	export let images: string[];
	// let backgroundColor = $exhibitionCurrentMainThemeColors.backgroundColor;

	// Calculate optimal number of duplicates based on viewport width
	let duplicatedImages: string[];
	
	$: {
		const sets = Math.ceil(window.innerWidth / (images.length * 200)) + 2;
		duplicatedImages = Array(sets).fill(images).flat();
	}
</script>

<section>
	<div class="slider">
		<div class="gradient-overlay left" />
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
		<div class="gradient-overlay right" />
	</div>
</section>

<style>
	section {
		display: grid;
		place-items: center;
		width: 100%;
		padding: 3rem 0;
		position: relative;
	}

	.title {
		font-size: 2.5rem;
		font-weight: 600;
		text-transform: uppercase;
		position: relative;
		padding-bottom: 1rem;
	}

	.title::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		height: 2px;
		background: currentColor;
	}

	.slider {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 90%;
		max-width: 1400px;
		overflow: hidden;
		border-radius: 20px;
		box-shadow: 
			0 4px 30px rgba(0, 0, 0, 0.1),
			0 10px 40px rgba(0, 0, 0, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		position: relative;
		padding: 2rem 0;
	}

	.slider-items {
		display: flex;
		align-items: center;
		gap: 4rem;
		animation: scroll 40s linear infinite; /* Increased duration for smoother effect */
		will-change: transform;
	}

	.slider-items img {
		height: 80px;
		width: auto;
		max-width: 200px;
		object-fit: contain;
		transition: all 0.3s ease;
	}

	.slider-items img:hover {
		transform: scale(1.1);
	}

	/* Hide duplicate images from screen readers */
	.duplicate {
		opacity: 0;
		animation: fadeIn 0.5s forwards;
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			/* Adjust the transform to match the number of sets */
			transform: translateX(calc(-33.333%)); /* For 3 sets */
		}
	}

	@keyframes fadeIn {
		to {
			opacity: 1;
		}
	}

	@media (max-width: 768px) {
		.slider {
			width: 95%;
			padding: 1.5rem;
		}

		.slider-items {
			gap: 3rem;
		}

		.slider-items img {
			height: 60px;
		}

		.title {
			font-size: 2rem;
		}
	}
</style>
