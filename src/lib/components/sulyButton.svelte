<script lang="ts">
	import { Button } from 'flowbite-svelte';

	export let onBtnClick: any = () => {};
</script>

<Button
	on:click={onBtnClick}
	class="border-overlaySecondaryColor text-overlaySecondaryColor hover:bg-overlaySecondaryColor hover:text-overlayBackgroundColor"
	dir="ltr"
	outline
>
	<slot />
</Button>
