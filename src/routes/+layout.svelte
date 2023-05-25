<script lang="ts">
	import Navbar from '../lib/components/Navbar.svelte';
	import '../app.css';
	import './styles.css';
	import Headerbar from '$lib/components/Headerbar.svelte';
	import { onMount } from 'svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { changeLanguage } from '../utils/language';
	export let data;

	let supabase: any;

	onMount(async () => {
		supabase = data.supabase;
		changeLanguage(data.locale);
	});
</script>

{#if supabase}
	<div class="dark:bg-black bg-white app">
		<Headerbar />
		<Navbar {data} />
		<main>
			<slot />
		</main>
		<div>
			<Footer />
		</div>
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
</style>
