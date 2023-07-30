<script lang="ts">
	import { page } from '$app/stores';
	import Cookies from 'js-cookie';
	import { LL, locale } from '$lib/i18n/i18n-svelte';

	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownItem,
		Chevron,
		DropdownDivider,
		Button,
		DarkMode
	} from 'flowbite-svelte';
	import type { PageData } from '../../routes/$types';
	import { setLocale } from '$lib/i18n/i18n-svelte';
	import { detectLocale } from '$lib/i18n/i18n-util';
	import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';
	import { changeLanguage } from '../../utils/language';
	import Constants from '../../utils/constants';
	import { previousPageStore } from '../../stores/navigationStore';
	import { getNameRegex } from '../../utils/urlRegexName';
	import { onMount } from 'svelte';
	import { pageBuilderStore } from '../../stores/ui/page_layouts';
	import type { PageLayout } from '../../models/pageModel';

	export let data: PageData;
	let themeMode = 'light';
	let dropdownOpen = false;
	let selectedLang = data.locale === 'en' ? 'English' : data.locale === 'ar' ? 'العربية' : 'کوردی';
	let navTextColor: string | undefined;
	let textColor: string =
		getNameRegex($page.url.pathname) &&
		!['about', 'contact', "undefined", ''].includes(getNameRegex($page.url.pathname))
			? `text-${getNameRegex($page.url.pathname)}OverlayBackgroundColor`
			: 'text-overlayBackgroundColor';

	let backgroundColor: string =
		getNameRegex($page.url.pathname) &&
		!['about', 'contact', "undefined", ''].includes(getNameRegex($page.url.pathname))
			? `bg-${getNameRegex($page.url.pathname)}OverlayBackgroundColor`
			: 'bg-overlayBackgroundColor';

	// acgtive on route
	let activeUrl: string;
	$: {
		activeUrl = $page.url.pathname;
	}

	function onThemeModeChange() {
		themeMode;
	}

	function updateActiveUrl(url: string) {
		activeUrl = url;
		previousPageStore.set($page.url.pathname);

		// navigate to other page using href
	}

	async function langSelect(lang: string) {
		// change language cookie
		// change language in i18n
		var locale = detectLocale(() => [lang]);
		await loadLocaleAsync(locale);
		setLocale(locale);
		selectedLang = lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'کوردی';
		changeLanguage(locale);
		// set cookie
		fetch(`/?lang=${lang}`, { method: 'GET', credentials: 'include' });
		dropdownOpen = false;
	}

	onMount(async function () {
		await pageBuilderStore.get(data.supabase);
	});
</script>

<div class=" w-full border-b border-b-neutral-800">
	<!-- <div class="flex flex-row justify-center items-center dark:bg-black bg-white h-20">
		<img src="/images/logo.png" class=" h-full" />
	</div> -->

	<Navbar
		navDivClass="  mx-auto flex flex-wrap items-center  max-w-full "
		style="background-color: {Constants.main_theme.secondary};"
		navClass=" px-2 sm:px-4 py-2.5   w-full z-20 top-0 left-0 border-b max-w-full relative bg-transparent"
		let:hidden
		let:toggle
	>
		<NavHamburger on:click={toggle} />
		
		<NavUl
			divClass="w-full md:block  justify-center max-w-full items-center  p-0"
			ulClass=" {Constants.page_max_width} m-auto flex flex-col p-1 lg:py-4 lg:px-0 mt-4 md:flex-row md:space-x-8 justify-between md:justify-center md:mt-0 md:text-sm  items-center nav-ul"
			activeClass="text-white bg-primary-700 md:bg-transparent md:text-primary-700 md:dark:text-white dark:bg-primary-600 md:dark:bg-transparent"
			nonActiveClass="text-gray-400 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
			style="color:blue"
			{hidden}
		>
			<!-- <div class="flex-1 flex flex-col md:flex-row justify-start items-center md:left-0">
				<DarkMode class=" right-10" />
			</div> -->
			<NavLi
				on:click={() => updateActiveUrl('/')}
				href="/"
				class="  cursor-pointer text-sm  lg:text-lg"
				active={activeUrl == '/'}>{$LL.home()}</NavLi
			>
			<NavLi
				on:click={() => updateActiveUrl('/news/1')}
				href="/news/1"
				class="  cursor-pointer text-sm  lg:text-lg "
				active={activeUrl.startsWith('/news')}>{$LL.news()}</NavLi
			>
			<NavLi
				on:click={() => updateActiveUrl('/exhibition/1')}
				href="/exhibition/1"
				class="  cursor-pointer text-sm  lg:text-lg"
				active={activeUrl.startsWith('/exhibition')}>{$LL.exhibition()}</NavLi
			>
			<NavLi id="media" class="cursor-pointer text-sm  lg:text-lg"
				><Chevron aligned>{$LL.media()}</Chevron></NavLi
			>
			<Dropdown triggeredBy="#media" class="w-32 z-20 p-2 ">
				<DropdownItem
					defaultClass="dark:text-white text-secondary mb-1 text-base"
					href="/gallery/1"
					on:click={() => updateActiveUrl('/gallery/1')}>{$LL.gallery()}</DropdownItem
				>
				<DropdownItem
					defaultClass="dark:text-white text-secondary mb-1 text-base"
					href="/magazine/1"
					on:click={() => updateActiveUrl('/magazine/1')}>{$LL.magazine()}</DropdownItem
				>
				<DropdownItem
					defaultClass="dark:text-white text-secondary mb-1 text-base"
					href="/publishing/1"
					on:click={() => updateActiveUrl('/publishing/1')}>{$LL.publishing()}</DropdownItem
				>
				<DropdownItem
					defaultClass="dark:text-white text-secondary mb-1 text-base"
					href="/video/1"
					on:click={() => updateActiveUrl('/video/1')}>{$LL.videos()}</DropdownItem
				>
			</Dropdown>
			<NavLi
				on:click={() => updateActiveUrl('/service')}
				class="  cursor-pointer text-sm  lg:text-lg"
				href="/service"
				active={activeUrl == '/service'}>{$LL.services()}</NavLi
			>
			<NavLi
				on:click={() => updateActiveUrl('/about')}
				class=" cursor-pointer text-sm  lg:text-lg"
				href="/about"
				active={activeUrl == '/about'}>{$LL.about()}</NavLi
			>
			<NavLi
				on:click={() => updateActiveUrl('/contact')}
				active={activeUrl == '/contact'}
				href="/contact"
				class="   cursor-pointer text-sm mr-0 ml-0 lg:text-lg">{$LL.contact()}</NavLi
			>
			<div
				class="w-full flex-1 flex flex-col md:flex-row justify-end items-center md:left-0"
				style="margin:0 ;"
			>
				<Button
					class="px-1  w-full md:w-24 rounded-3xl focus:outline-none focus:ring-0"
					style="color: {Constants.main_theme.overlayPrimary}"
					dir="ltr"
					pill
					outline><Chevron>{selectedLang}</Chevron></Button
				>

				<Dropdown bind:open={dropdownOpen} id="">
					<DropdownItem on:click={() => langSelect('ckb')}>کوردی</DropdownItem>
					<DropdownItem on:click={() => langSelect('ar')}>العربية</DropdownItem>
					<DropdownItem on:click={() => langSelect('en')}>English</DropdownItem>
				</Dropdown>
			</div>
		</NavUl>
	</Navbar>
</div>

<style>
	.nav-bar {
		background: linear-gradient(to bottom, #ff7f00, #ff5500);
	}
</style>
