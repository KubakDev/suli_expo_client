<script lang="ts">
	import { currentMainThemeColors } from '../../stores/darkMode';
	import { locale } from '$lib/i18n/i18n-svelte';
	import { IconChevronRight, IconChevronLeft } from '@tabler/icons-svelte';

	export let onBtnClick: any = () => {};
	let buttonHovered = false;
</script>

<button 
	on:click={onBtnClick}
	on:mouseenter={() => buttonHovered = true}
	on:mouseleave={() => buttonHovered = false}
	class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all"
	style="
		color: {buttonHovered ? '#fff' : $currentMainThemeColors.primaryColor}; 
		border-color: {$currentMainThemeColors.primaryColor};
		background-color: {buttonHovered ? $currentMainThemeColors.primaryColor : 'transparent'};
	"
>
	{#if $locale !== 'en'}
		<IconChevronLeft size={16} />
	{/if}
	<slot />
	{#if $locale === 'en'}
		<IconChevronRight size={16} />
	{/if}
</button>
