<script lang="ts">
	import { Button } from 'flowbite-svelte';

	export let onBtnClick: any = () => {};
</script>

<Button
	on:click={onBtnClick}
	class="border-lightOverlaySecondaryColor dark:border-darkOverlaySecondaryColor text-lightOverlaySecondaryColor dark:text-darkOverlaySecondaryColor hover:bg-lightOverlaySecondaryColor dark:hover:bg-darkOverlaySecondaryColor hover:text-lightOverlayBackgroundColor dark:hover:text-darkOverlayBackgroundColor"
	dir="ltr"
	outline
>
	<slot />
</Button>
