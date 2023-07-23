<script lang="ts">
	import { page } from "$app/stores";
	import { getNameRegex } from "../../utils/urlRegexName";

	export let text: string = 'Title Here';
	export let footerSize: boolean = false;
	export let textColor: string = `var(--${getNameRegex($page.url.pathname)}SecondaryColor)`;
</script>

<div>
	<div class="h-[1px]" style="background-color: var(--overlaySecondaryColor);" />
	<h1
		class="{footerSize
			? ' font-sans'
			: ' sm:text-4xl font-bold'} uppercase text-center my-1 px-4 ms:px-10 text-2xl"
		style="color: {textColor};"
	>
		{text}
	</h1>
	<div class="h-[1px]" style="background-color: var(--overlaySecondaryColor);" />
</div>
