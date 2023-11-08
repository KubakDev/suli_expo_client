<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { currentMainThemeColors } from '../../stores/darkMode';

	export let onBtnClick: any = () => {};
</script>

<Button
	on:click={onBtnClick}
	style="background-color:{$currentMainThemeColors.primaryColor}; color :{$currentMainThemeColors.overlayPrimaryColor}"
	dir="ltr"
	outline
>
	<slot />
</Button>
