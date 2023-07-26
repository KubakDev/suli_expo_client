<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Constants from '../../utils/constants';

	export let onBtnClick: any;
</script>

<Button
	on:click={onBtnClick}
	color="primary"
	class=" sm:w-32 rounded-md text-overlayPrimaryColor font-bold  w-20 px-[0px] sm:px-4 bg-primaryColor hover:bg-transparent hover:text-primaryColor hover:border-2 border-primaryColor"
	>{$LL.seeAll()}</Button
>
