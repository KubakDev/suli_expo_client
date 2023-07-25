<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../utils/constants';

	export let onBtnClick: any;
</script>

<Button
	on:click={onBtnClick}
	color="primary"
	class=" sm:w-32 rounded-md  w-20 px-[0px] sm:px-4 bg-[{Constants.main_theme.primary}] text-[{Constants.main_theme.overlayPrimary}] hover:text-[{Constants.main_theme.primary}] hover:bg-transparent hover:border-2 border-[{Constants.main_theme.primary}]"
	>{$LL.seeAll()}</Button
>
