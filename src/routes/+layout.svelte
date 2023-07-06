<script lang="ts">
	import Navbar from '../lib/components/Navbar.svelte';
	import '../app.css';
	import './styles.css';
	import Headerbar from '$lib/components/Headerbar.svelte';
	import { onMount } from 'svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { locale } from '$lib/i18n/i18n-svelte';
	import { changeLanguage } from '../utils/language';
	import { contactInfoSectionStore } from '../stores/contactInfo';
	import { easeCubicIn, transition } from 'd3';
	import { fly } from 'svelte/transition';
	import { previousPageStore } from '../stores/navigationStore';
	import { register } from 'swiper/element';
	import Constants from '../utils/constants';
	register();
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
		const origin:any = {
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

	const pageTransitions: any = {
		'/news': ['/'],
		'/exhibitions': ['/news', '/'],
		'/services': ['/exhibitions', '/news', '/'],
		'/about': ['/services', '/exhibitions', '/news', '/'],
		'/contact': ['/about', '/services', '/exhibitions', '/news', '/'],
		'/gallery': ['/exhibitions', '/news', '/'],
		'/magazine': ['/exhibitions', '/news', '/'],
		'/publishing': ['/exhibitions', '/news', '/'],
		'/videos': ['/exhibitions', '/news', '/']
	};

	// function for knowing which page go to which page
	export function inLeft() {
		console.log(data.url);
		console.log('&&&&&&&&&&&&&&&&&&');
		console.log($previousPageStore);
		if (
			$locale === 'en'
				? !pageTransitions[
						$previousPageStore.startsWith('/news') ? '/news' : $previousPageStore
				  ]?.includes(data.url.pathname)
				: pageTransitions[
						$previousPageStore.startsWith('/news') ? '/news' : $previousPageStore
				  ]?.includes(data.url.pathname)
		) {
			return false;
		} else {
			return true;
		}
	}
</script>

{#if supabase}
	<div class="dark:bg-black bg-white app overflow-hidden">
		<Headerbar />
		<Navbar {data} />
		<main class="h-full flex">
			{#key data.url.pathname}
				<div
					class="h-full block flex-1 flex "
					in:fly={{ x: inLeft() ? -300 : 300, duration: 800, delay: 600 }}
					out:fly={{ x: inLeft() ? 300 : -300, duration: 500 }}
				>
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
