<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';

	export let onBtnClick: any;
</script>

<Button
	on:click={onBtnClick}
	color="primary"
	class=" sm:w-32 rounded-md bg-primary text-black w-20 px-[0px] sm:px-4">{$LL.seeAll()}</Button
>
