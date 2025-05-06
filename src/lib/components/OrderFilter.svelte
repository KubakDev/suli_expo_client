<script lang="ts">
	import { Spinner } from 'flowbite-svelte';
	import { IconArrowDown, IconArrowUp } from '@tabler/icons-svelte';
    import LL from '$lib/i18n/i18n-svelte';
    import { ascStore } from '../../stores/ascStore';
    import { 
        currentMainThemeColors,
        exhibitionCurrentMainThemeColors, 
        galleryCurrentThemeColors,
        magazineCurrentThemeColors,
        publishingCurrentThemeColors,
        videoCurrentThemeColors
    } from '../../stores/darkMode';

	export let isLoading: boolean = false;
	export let pageType: string = 'news'; // news, exhibition, gallery, magazine, publishing, video
    let asc = ascStore;
    let isHovered = false;
    
    function toggleOrder() {
        asc.set(!$asc);
    }
    
    // Select the correct theme colors based on pageType
    $: themeColors = pageType === 'exhibition' ? $exhibitionCurrentMainThemeColors :
                    pageType === 'gallery' ? $galleryCurrentThemeColors :
                    pageType === 'magazine' ? $magazineCurrentThemeColors :
                    pageType === 'publishing' ? $publishingCurrentThemeColors :
                    pageType === 'video' ? $videoCurrentThemeColors :
                    $currentMainThemeColors;
</script>

<button
	on:click={toggleOrder}
    on:mouseenter={() => isHovered = true}
    on:mouseleave={() => isHovered = false}
	class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border rounded-md transition-all"
	style="
        color: {isHovered ? '#fff' : themeColors.primaryColor}; 
        border-color: {themeColors.primaryColor};
        background-color: {isHovered ? themeColors.primaryColor : 'transparent'};
    "
	title={$asc ? $LL.ascending() : $LL.descending()}
	disabled={isLoading}
>
	{#if isLoading}
		<Spinner size="4" style="color: {isHovered ? '#fff' : themeColors.primaryColor};" />
	{:else if $asc}
		<IconArrowUp size={16} />
	{:else}
		<IconArrowDown size={16} />
	{/if}
	<span>{$LL.sort()}</span>
</button>

<style>
  .order-filter-btn:hover {
    background-color: rgba(var(--color-gray-100), 0.8);
  }
  
  :global(.dark) .order-filter-btn:hover {
    background-color: rgba(var(--color-gray-800), 0.8);
  }
</style> 