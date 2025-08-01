<script lang="ts">
	import Navbar from '../lib/components/Navbar.svelte';
	import '../app.css';
	import './styles.css';
	import { onMount } from 'svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { locale } from '$lib/i18n/i18n-svelte';
	import { changeLanguage } from '../utils/language';
	import { contactInfoSectionStore } from '../stores/contactInfo';
	import { easeCubicIn } from 'd3';
	import { fly } from 'svelte/transition';
	import { previousPageStore } from '../stores/navigationStore';
	import { register } from 'swiper/element';
	import { activeThemeStore } from '../stores/ui/theme';
	import { pageBuilderStore } from '../stores/ui/page_layouts';
	import { page } from '$app/stores';
	import { getNameRegex } from '../utils/urlRegexName';
	import { themeToggle, setTheme } from '../stores/darkMode';
	import { currentUser } from '../stores/currentUser';
	import { invalidateAll } from '$app/navigation';
	import { currentMainThemeColors } from '../stores/darkMode';
	import BackToTop from '$lib/components/BackToTop.svelte';
 
	register();
	export let data;
	const routeRegex = /\/(news|exhibition|gallery|magazine|publishing|video)/;
	let tailVar: string = 'dark';

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
		await pageBuilderStore.get(data.supabase);
		await activeThemeStore.getActiveTheme(data.supabase);
		setTheme();
	});

	onMount(() => {
		supabase = data.supabase;
		changeLanguage(data.locale);

		const {
			data: { subscription }
		} = data.supabase.auth.onAuthStateChange(() => {
			invalidateAll();
		});

		if (data?.session?.user) {
			data.supabase
				.from('company')
				.select('*')
				.eq('uid', data?.session?.user.id)
				.single()
				.then((res) => {
					if (res.data) {
						currentUser.set(res.data);
					}
				});
		}
		checkAndRefreshToken();
		setInterval(checkAndRefreshToken, 30 * 60 * 1000);

		return () => {
			subscription.unsubscribe();
		};
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
	async function checkAndRefreshToken() {
		const currentTime = Math.floor(Date.now() / 1000);
		const response = data.supabase.auth.getSession();
		response.then(async (res) => {
			let user: any = res.data.session;
			const timeToExpiration = (user ? user.expires_at : 0 - currentTime);

			if (timeToExpiration <= 300) {
				await data.supabase.auth.refreshSession();
			}
		});
	}
</script>

<!-- comment -->

{#if supabase}
	{#if $page}
		<div class="app" use:applyTheme>
			<Navbar {data} />
			<main
				style="background-color:{$currentMainThemeColors.backgroundColor} "
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
			<BackToTop />
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
