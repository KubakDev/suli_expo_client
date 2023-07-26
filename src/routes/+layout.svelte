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
	import { activeThemeStore } from '../stores/ui/theme';
	import { pageBuilderStore } from '../stores/ui/page_layouts';
	import { page } from '$app/stores';
	import { getNameRegex } from '../utils/urlRegexName';
	import Constants from '../utils/constants';
	register();
	export let data;

	let backgroundColor: string =
		getNameRegex($page.url.pathname) &&
		!['about', 'contact', "undefined", ''].includes(getNameRegex($page.url.pathname))
			? `bg-${getNameRegex($page.url.pathname)}BackgroundColor`
			: 'bg-backgroundColor';

	let supabase: any;
	if ($locale && data.supabase) {
		contactInfoSectionStore.get($locale, data.supabase);
	}

	onMount(async () => {
		supabase = data.supabase;
		await activeThemeStore.getActiveTheme(supabase);
		changeLanguage(data.locale);
		await pageBuilderStore.get(data.supabase);

		console.log('pageBuilderStore', $page);
	});

	function scale(
		node: Element,
		{ delay = 0, duration = 300, easing = easeCubicIn },
		{ direction = 'both' } = {}
	) {
		const origin: any = {
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
		'/exhibition': ['/news', '/'],
		'/service': ['/exhibition', '/news', '/'],
		'/about': ['/service', '/exhibition', '/news', '/'],
		'/contact': ['/about', '/service', '/exhibition', '/news', '/'],
		'/gallery': ['/exhibition', '/news', '/'],
		'/magazine': ['/exhibition', '/news', '/'],
		'/publishing': ['/exhibition', '/news', '/'],
		'/video': ['/exhibition', '/news', '/']
	};

	// function for knowing which page go to which page
	export function inLeft() {
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
	<div class="app {backgroundColor}">
		<Headerbar />
		<Navbar {data} />
		<main class="h-full flex">
			{#key data.url.pathname}
				<div
					class=" flex-1 sm:flex"
					in:fly={{ x: inLeft() ? -300 : 300, duration: 800, delay: 600 }}
					out:fly={{ x: inLeft() ? 300 : -300, duration: 500 }}
				>
					<slot />
				</div>
			{/key}
		</main>
		<div>
			<Footer {data}/>
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
