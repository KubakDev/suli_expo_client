<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import Constants from '../../utils/constants';
	import { onMount } from 'svelte';

	export let onBtnClick: any = () => {};

	let bg_color:string;

	onMount(() => {
		bg_color = Constants.main_theme.overlaySecondary;
	});
</script>

<Button
	on:click={onBtnClick}
	style="border-color:{Constants.main_theme.overlaySecondary}; color:{Constants.main_theme.overlaySecondary}"
	class="hover:bg-[{bg_color}] hover:text-[{Constants.main_theme.overlayPrimary}]"
	dir="ltr"
	outline
>
	<slot />
</Button>
