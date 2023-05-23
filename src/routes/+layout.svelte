<script lang="ts">
	import Navbar from '../lib/components/Navbar.svelte';
	import '../app.css';
	import './styles.css';
	import Headerbar from '$lib/components/Headerbar.svelte';
	import { onMount } from 'svelte';
	export let data;

	let supabase: any;

	onMount(async () => {
		supabase = data.supabase;
	});
</script>

{#if supabase}
	<div class="dark:bg-slate-900 app">
		<Headerbar />
		<Navbar />
		<main>
			<slot />
		</main>
		<footer>
			<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
		</footer>
	</div>
{/if}

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
