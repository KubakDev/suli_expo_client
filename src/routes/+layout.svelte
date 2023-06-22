<script lang="ts">
	import Navbar from '../lib/components/Navbar.svelte';
	import '../app.css';
	import './styles.css';
	import Headerbar from '$lib/components/Headerbar.svelte';
	import { onMount } from 'svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { changeLanguage } from '../utils/language';
	import { contactInfoSectionStore } from '../stores/contactInfo';
	import { easeCubicIn, transition } from 'd3';
	import { fly } from 'svelte/transition';
	export let data;

	let supabase: any;
	if ($locale && data.supabase) {
		contactInfoSectionStore.get($locale, data.supabase);
	}

	onMount(async () => {
		supabase = data.supabase;
		changeLanguage(data.locale);
	});

	function scale(
		node: Element,
		{ delay = 0, duration = 300, easing = easeCubicIn },
		{ direction = 'both' } = {}
	) {
		const origin = {
			in: 'bottom left',
			out: 'bottom right',
			both: 'center center'
		};
		return {
			delay,
			duration,
			easing,
			css: (t: any) => `
				scale: ${t};
				transform-origin: ${origin[direction]};
			`
		};
	}
</script>

{#if supabase}
	<div class="dark:bg-black bg-white app">
		<Headerbar />
		<Navbar {data} />
		<main>
			{#key data.url}
				<div in:fly={{ x: -200, duration: 500 }} out:fly={{ x: 200, duration: 300 }}>
					<slot />
				</div>
			{/key}
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
