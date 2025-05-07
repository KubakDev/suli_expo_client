<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../utils/constants';
	import { page } from '$app/stores';
	import { getNameRegex } from '../../utils/urlRegexName';
	import { themeToggle } from '../../stores/darkMode';
	import { IconChevronRight, IconChevronLeft } from '@tabler/icons-svelte';

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
	let buttonHovered = false;

	$: {
		if (routeRegex.test($page.url.pathname)) {
			let pageName = getNameRegex($page.url.pathname);
			tailVar = $themeToggle === 'light' ? pageName + 'Light' : pageName + 'Dark';
		} else {
			tailVar = $themeToggle === 'light' ? 'light' : 'dark';
		}
	}
</script>

<button
	on:click={onBtnClick}
	on:mouseenter={() => buttonHovered = true}
	on:mouseleave={() => buttonHovered = false}
	class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all sm:w-32 w-20"
	style="
		color: {buttonHovered ? '#fff' : color.backgroundColor}; 
		border-color: {color.backgroundColor};
		background-color: {buttonHovered ? color.backgroundColor : 'transparent'};
	"
>
	{$LL.seeAll()}
	{#if $locale === 'en'}
		<IconChevronRight size={16} />
	{:else}
		<IconChevronLeft size={16} />
	{/if}
</button>
