<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../utils/constants';
	import { page } from '$app/stores';
	import { getNameRegex } from '../../utils/urlRegexName';
	import { themeToggle } from '../../stores/darkMode';

	export let onBtnClick: any;
	export let color: {
		backgroundColor: string;
		textColor: string;
	} = {
		backgroundColor: 'var(--{tailVar}PrimaryColor)',
		textColor: 'var(--{tailVar}OverlayPrimaryColor)'
	};
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
</script>

<Button
	on:click={onBtnClick}
	color="primary"
	style="color: {color.textColor}; border-color: {color.backgroundColor}; background-color: {color.backgroundColor}"
	class=" sm:w-32 rounded-md font-bold  w-20 px-[0px] sm:px-4   ">{$LL.seeAll()}</Button
>
