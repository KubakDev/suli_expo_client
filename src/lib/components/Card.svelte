<script lang="ts">
	import { onMount } from 'svelte';
	let isHovering = false;

	export let title: string = 'Title';
	export let description: string = 'Description';
	export let image: string = 'images/suliexpo.jpg';
	export let service_color: {
		title: string;
		description: string;
	} = {title:'#000000', description:'#000000'};

	let gradientColor:any;

	const handleMouseOver = () => {
		isHovering = true;
	};

	const handleMouseOut = () => {
		isHovering = false;
	};

	onMount(() => {
		gradientColor = `background: linear-gradient(to top, ${service_color.description} 0%, rgba(15, 15, 15, 0)); Fade gradient`;
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class="card cursor-pointer" on:mouseover={handleMouseOver} on:mouseout={handleMouseOut}>
	<img class="card-img" src={image} alt="Image" />
<div class="card-content" style="{gradientColor}">
		<h3 class="card-title font-bold " style="color: {service_color.title};">{title}</h3>
		<p class="card-description" style="color: {service_color.title};">{description}</p>
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
		/* background: linear-gradient(to top, rgb(0, 0, 0) 0%, rgba(15, 15, 15, 0)); Fade gradient */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: white;
		transition: all 0.5s ease-in-out;
		overflow: hidden;
		padding: 20px;
		border-radius: 0px;
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
