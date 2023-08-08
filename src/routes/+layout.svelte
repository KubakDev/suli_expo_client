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
	import { color, easeCubicIn, transition } from 'd3';
	import { fade, fly } from 'svelte/transition';
	import { previousPageStore } from '../stores/navigationStore';
	import { register } from 'swiper/element';
	import { activeThemeStore } from '../stores/ui/theme';
	import { pageBuilderStore } from '../stores/ui/page_layouts';
	import { page } from '$app/stores';
	import { getNameRegex } from '../utils/urlRegexName';
	import { themeToggle, setTheme } from '../stores/darkMode';
	import { currentUser } from '../stores/currentUser';
	register();
	export let data;
	const routeRegex = /\/(news|exhibition|gallery|magazine|publishing|video)/;
	let tailVar: string = 'light';

	$: {
		if (routeRegex.test($page.url.pathname)) {
			let pageName = getNameRegex($page.url.pathname);
			tailVar = $themeToggle === 'light' ? pageName + 'Light' : pageName + 'Dark';
		} else {
			tailVar = $themeToggle === 'light' ? 'light' : 'dark';
		}
	}

	let supabase: any;
	if ($locale && data.supabase) {
		contactInfoSectionStore.get($locale, data.supabase);
	}

	onMount(async () => {
		setTheme();
		supabase = data.supabase;

		const response: any = await data.supabase.auth.getUser();
		console.log(response);
		if (response?.data?.user) {
			data.supabase
				.from('company')
				.select('*')
				.eq('uid', response.data.user.id)
				.single()
				.then((res) => {
					if (res.data) {
						currentUser.set(res.data);
					}
				});
		}

		await activeThemeStore.getActiveTheme(supabase);
		changeLanguage(data.locale);
		await pageBuilderStore.get(data.supabase);
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

	function applyTheme(node: HTMLElement) {
		let unsubscribe = themeToggle.subscribe((value) => {
			node.className = value;
		});

		return {
			destroy() {
				unsubscribe();
			}
		};
	}
</script>

{#if supabase}
	{#if $page}
		<div class="app" use:applyTheme>
			<Headerbar />
			<Navbar {data} />
			<main
				style="background-color: var(--{tailVar}BackgroundColor);"
				class="h-full flex min-h-screen"
			>
				{#key data.url.pathname}
					<div
						class=" flex-1 sm:flex"
						in:fly={{ duration: 500, delay: 300 }}
						out:fly={{ duration: 300 }}
					>
						<slot />
					</div>
				{/key}
			</main>
			<div>
				<Footer {data} />
			</div>
		</div>
	{/if}
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
