<script lang="ts">
	import { page } from '$app/stores';
	import { getNameRegex } from '../../utils/urlRegexName';

	export let text: string = 'Title Here';
	export let footerSize: boolean = false;
	let tailVarLight:string = 'light';
	let tailVarDark:string = 'dark';
	$: {
		if (
			$page.url.pathname.includes(
				'news' || 'exhibition' || 'gallery' || 'magazine' || 'publishing' || 'video'
			)
		) {
			let pageName = getNameRegex($page.url.pathname);
			tailVarLight = pageName+'Light';
			tailVarDark = pageName+'Dark';
		}else{
			tailVarLight = 'light';
			tailVarDark = 'dark';
		}
	}
</script>

<div>
	<div class="h-[1px] bg-{tailVarLight}OverlaySecondaryColor dark:bg-{tailVarDark}OverlaySecondaryColor" />
	<h1
		class="{footerSize
			? ' font-sans'
			: ' sm:text-4xl font-bold'} uppercase text-center my-1 px-4 ms:px-10 text-2xl text-{tailVarLight}SecondaryColor dark:text-{tailVarDark}SecondaryColor"
	>
		{text}
	</h1>
	<div class="h-[1px] bg-{tailVarLight}OverlaySecondaryColor dark:bg-{tailVarDark}OverlaySecondaryColor" />
</div>
