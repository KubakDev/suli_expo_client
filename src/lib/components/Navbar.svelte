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
		Toggle,
		DarkMode
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import type { PageData } from '../../routes/$types';
	import { setLocale } from '$lib/i18n/i18n-svelte';
	import { detectLocale } from '$lib/i18n/i18n-util';
	import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';
	import { changeLanguage } from '../../utils/language';
	export let data: PageData;
	let themeMode = 'light';
	let dropdownOpen = false;
	let selectedLang = data.locale === 'en' ? 'English' : data.locale === 'ar' ? 'العربية' : 'کورد';

	// acgtive on route
	let activeUrl: string;
	$: activeUrl = $page.url.pathname;
	onMount(() => {
		console.log($page.url);
	});

	function onThemeModeChange() {
		themeMode;
	}

	function updateActiveUrl(url: string) {
		activeUrl = url;
		console.log(activeUrl);
	}

	async function langSelect(lang: string) {
		// change language cookie
		// change language in i18n
		var locale = detectLocale(() => [lang]);
		await loadLocaleAsync(locale);
		setLocale(locale);
		selectedLang = lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'کورد';
		changeLanguage(locale);
		// set cookie
		fetch(`/?lang=${lang}`, { method: 'GET', credentials: 'include' });
		dropdownOpen = false;
	}
</script>

<Navbar
	navDivClass="  mx-auto flex flex-wrap items-center  max-w-full "
	navClass=" px-2 sm:px-4 py-2.5  w-full z-20 top-0 left-0 border-b max-w-full relative"
	let:hidden
	let:toggle
>
	<NavHamburger on:click={toggle} />
	<NavUl
		divClass="w-full md:block  justify-center max-w-full items-center "
		ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 justify-between md:justify-center md:mt-0 md:text-sm  items-center nav-ul font-bold	"
		{hidden}
	>
		<div class="flex-1 flex flex-col md:flex-row justify-start items-center md:left-0">
			<DarkMode class=" right-10" />
		</div>
		<NavLi
			on:click={() => updateActiveUrl('/')}
			class="mx-1 md:mx-2 cursor-pointer"
			href="/"
			active={activeUrl == '/'}>{$LL.home()}</NavLi
		>
		<NavLi
			on:click={() => updateActiveUrl('/news')}
			class="mx-1 md:mx-2  cursor-pointer"
			href="/news"
			active={activeUrl == '/news'}>{$LL.news()}</NavLi
		>
		<NavLi
			on:click={() => updateActiveUrl('/exhibition')}
			class="mx-1 md:mx-2 cursor-pointer"
			href="/exhibition"
			active={activeUrl == '/exhibition'}>Exhibition</NavLi
		>
		<NavLi
			on:click={() => updateActiveUrl('/services')}
			class="mx-1 md:mx-2 cursor-pointer"
			href="/services"
			active={activeUrl == '/services'}>{$LL.services()}</NavLi
		>
		<NavLi
			on:click={() => updateActiveUrl('/about')}
			class="mx-1 md:mx-2 cursor-pointer"
			href="/about"
			active={activeUrl == '/about'}>{$LL.about()}</NavLi
		>
		<NavLi
			on:click={() => updateActiveUrl('/contact')}
			active={activeUrl == '/contact'}
			class="mx-1 md:mx-2  cursor-pointer"
			href="/contact">{$LL.contact()}</NavLi
		>
		<div class="flex-1 flex flex-col md:flex-row justify-end items-center md:right-0">
			<Button class="mx-4 " dir="ltr" color="primary"><Chevron>{selectedLang}</Chevron></Button>

			<Dropdown bind:open={dropdownOpen} id="">
				<DropdownItem on:click={() => langSelect('ckb')}>کورد</DropdownItem>
				<DropdownItem on:click={() => langSelect('ar')}>العربية</DropdownItem>
				<DropdownItem on:click={() => langSelect('en')}>English</DropdownItem>
			</Dropdown>
		</div>
	</NavUl>
</Navbar>
