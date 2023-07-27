<script lang="ts">
	import { page } from '$app/stores';
	import { getNameRegex } from '../../utils/urlRegexName';

	export let text: string = 'Title Here';
	export let footerSize: boolean = false;
	let textColor: string =
		getNameRegex($page.url.pathname) &&
		!['about', 'contact', "undefined", ''].includes(getNameRegex($page.url.pathname))
			? `text-${getNameRegex($page.url.pathname)}OverlayBackgroundColor`
			: 'text-overlayBackgroundColor';

	let backgroundColor: string =
		getNameRegex($page.url.pathname) &&
		!['about', 'contact', "undefined", ''].includes(getNameRegex($page.url.pathname))
			? `bg-${getNameRegex($page.url.pathname)}OverlaySecondaryColor`
			: 'bg-overlaySecondaryColor';
</script>

<div>
	<div style="background-color: var(--overlaySecondaryColor);" class="h-[1px]" />
	<h1
		class="{footerSize
			? ' font-sans'
			: ' sm:text-4xl font-bold'} uppercase text-center my-1 px-4 ms:px-10 text-2xl"
			style="color: var(--overlayBackgroundColor);"
	>
		{text}
	</h1>
	<div style="background-color: var(--overlaySecondaryColor);" class="h-[1px]" />
</div>
