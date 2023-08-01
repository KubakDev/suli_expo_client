<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../utils/constants';
	import { page } from '$app/stores';
	import { getNameRegex } from '../../utils/urlRegexName';

	export let onBtnClick: any;
	let tailVarLight: string = 'light';
	let tailVarDark: string = 'dark';
	const routeRegex = /\/(news|exhibition|gallery|magazine|publishing|video)/;
	$: {
		if (routeRegex.test($page.url.pathname)) {
			let pageName = getNameRegex($page.url.pathname);
			console.log('Page Name ', pageName);

			tailVarLight = pageName + 'Light';
			tailVarDark = pageName + 'Dark';
		} else {
			tailVarLight = 'light';
			tailVarDark = 'dark';
		}
	}
</script>

<Button
	on:click={onBtnClick}
	color="primary"
	class=" sm:w-32 rounded-md text-{tailVarLight}OverlayPrimaryColor dark:text-{tailVarDark}OverlayPrimaryColor font-bold  w-20 px-[0px] sm:px-4 bg-{tailVarLight}PrimaryColor dark:bg-{tailVarDark}PrimaryColor hover:bg-transparent hover:text-{tailVarLight}PrimaryColor dark:hover:text-{tailVarDark}PrimaryColor hover:border-2 border-{tailVarLight}PrimaryColor dark:border-{tailVarDark}PrimaryColor"
	>{$LL.seeAll()}</Button
>
