<script lang="ts">
	import { page } from '$app/stores';
	import { themeToggle } from '../../stores/darkMode';
	import { getNameRegex } from '../../utils/urlRegexName';

	export let text: string = 'Title Here';
	export let footerSize: boolean = false;
	const routeRegex = /\/(news|exhibition|gallery|magazine|publishing|video)/;
	let tailVar: string = 'light';

	$: {
		if (routeRegex.test($page.url.pathname)) {
			let pageName = getNameRegex($page.url.pathname);
			tailVar = $themeToggle === "light" ? pageName + 'Light' : pageName + 'Dark';
		} else {
			tailVar = $themeToggle === "light" ? 'light' : 'dark';
		}
	}
</script>

<div>
	<div class="h-[1px] bg-primary-500" />
	<h1
	style="color:var(--{tailVar}OverlaySecondaryColor)"
		class="{footerSize
			? ' font-sans'
			: ' sm:text-4xl font-bold'} uppercase text-center my-1 px-4 ms:px-10 text-2xl"
	>
		{text}
	</h1>
	<div class="h-[1px] bg-primary-500" />
</div>
