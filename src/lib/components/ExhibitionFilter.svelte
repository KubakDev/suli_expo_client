<script lang="ts">
	import { ArrowDown, ArrowUp } from 'svelte-heros-v2';
    import LL from '$lib/i18n/i18n-svelte';
	import { currentMainThemeColors } from '../../stores/darkMode';

	export let orderAsc: boolean;
	export let onToggle: () => void;

	// Add a function to toggle the order
	function toggleOrder() {
		orderAsc = !orderAsc; 
		onToggle(); 
	}
</script>


<div class="p-2 text-center w-full">
	<button 
		style="background-color: {$currentMainThemeColors.primaryColor}; color: {$currentMainThemeColors.overlayPrimaryColor};" 
		on:click={toggleOrder}  
		class="flex flex-row items-center justify-center p-2 rounded-full order-button"
	>
		{#if orderAsc}
			<ArrowDown size="15" class="transition-all hover:animate-pulse" />
		{:else}
			<ArrowUp size="15" class="transition-all hover:animate-pulse" />
		{/if}
		<span class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1">{$LL.orderAsc ? $LL.descending() : $LL.ascending()}</span>
	</button>
</div>