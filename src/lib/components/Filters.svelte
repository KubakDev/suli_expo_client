<script lang="ts">
	import { ArrowDown, ArrowUp } from 'svelte-heros-v2';
	import { ascStore } from '../../stores/ascStore';
	import LL from '$lib/i18n/i18n-svelte';
	import { currentMainThemeColors } from '../../stores/darkMode';

	let asc = ascStore;

	function changeOrder() {
	 asc.set(!$asc);
	}
</script>

<div class="p-2 text-center w-full">
	{#if $asc}
		<button
			style="background-color: {$currentMainThemeColors.primaryColor}; color: {$currentMainThemeColors.overlayPrimaryColor};"
			on:click={changeOrder}
			class="flex flex-row items-center justify-center p-2 rounded-full"
		>
			<ArrowUp size="15" class="transition-all hover:animate-pulse " />

			<span class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1">{$LL.ascending()}</span>
		</button>
	{:else}
		<button
			style="background-color: {$currentMainThemeColors.primaryColor}; color: {$currentMainThemeColors.overlayPrimaryColor};"
			on:click={changeOrder}
			class="flex flex-row items-center justify-center p-2 rounded-full"
		>
			<ArrowDown size="15" class="transition-all hover:animate-pulse " />
			<span class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1">{$LL.descending()}</span>
		</button>
	{/if}
</div>
