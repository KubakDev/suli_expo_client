<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';

	export let onBtnClick: any;
</script>

<Button
	on:click={onBtnClick}
	color="primary"
	class=" sm:w-32 rounded-md  w-20 px-[0px] sm:px-4 bg-[var(--primaryColor)] text-[var(--overlayPrimaryColor)] hover:text-[var(--primaryColor)] hover:bg-transparent hover:border-2 border-[var(--primaryColor)]"
	>{$LL.seeAll()}</Button
>
