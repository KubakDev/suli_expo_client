<script>
	import { onMount } from 'svelte';
	let isHovering = false;

	const handleMouseOver = () => {
		isHovering = true;
	};

	const handleMouseOut = () => {
		isHovering = false;
	};
</script>

<div class="card cursor-pointer" on:mouseover={handleMouseOver} on:mouseout={handleMouseOut}>
	<img class="card-img" src="images/suliexpo.jpg" alt="Image" />
	<div class="card-content">
		<h3 class="card-title">{isHovering ? 'New Title' : 'Original Title'}</h3>
		<p class="card-description">
			Some description about the image Some description about the image Some description about the
			image Some description about the image...
		</p>
	</div>
</div>

<style>
	.card {
		min-width: 200px;
		max-width: 400px;
		height: 350px;
		max-height: 400px;
		overflow: hidden;
		position: relative;
		border-radius: 25px;
		box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
	}

	.card-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: opacity 0.5s;
		border-radius: 25px;
	}

	.card-content {
		width: 100%;
		position: absolute;
		bottom: 0;
		background: linear-gradient(
			to top,
			rgba(255, 255, 255, 1) 10%,
			rgba(255, 255, 255, 0)
		); /* Fade gradient */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		transition: all 0.5s ease-in-out;
		overflow: hidden;
		padding: 20px;
		border-radius: 25px;
	}

	.card-title {
		transition: all 0.5s ease-in-out;
	}

	.card-description {
		max-height: 0;
		opacity: 0;
		transition: all 0.5s ease-in-out;
		overflow: hidden;
	}

	.card:hover .card-img {
		opacity: 0.5;
	}

	.card:hover .card-description {
		max-height: 100px;
		opacity: 1;
	}
</style>
