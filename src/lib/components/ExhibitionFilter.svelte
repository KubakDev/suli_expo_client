<script lang="ts">
	import { Spinner } from 'flowbite-svelte';
	import { IconArrowDown, IconArrowUp } from '@tabler/icons-svelte';
    import LL from '$lib/i18n/i18n-svelte';
	import { exhibitionCurrentMainThemeColors } from '../../stores/darkMode';

	export let orderAsc: boolean;
	export let onToggle: () => void;
	export let isLoading: boolean = false;
</script>

<button
	on:click={onToggle}
	class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all
		text-newsLightPrimaryColor dark:text-newsDarkPrimaryColor
		border-newsLightPrimaryColor dark:border-newsDarkPrimaryColor
		hover:bg-gray-100 dark:hover:bg-gray-800"
	title={orderAsc ? $LL.ascending() : $LL.descending()}
	disabled={isLoading}
>
	{#if isLoading}
		<Spinner size="4" class="text-newsLightPrimaryColor dark:text-newsDarkPrimaryColor" />
	{:else if orderAsc}
		<IconArrowUp size={16} />
	{:else}
		<IconArrowDown size={16} />
	{/if}
	<span>{$LL.sort()}</span>
</button>