<script lang="ts">
	import { goto } from '$app/navigation';
	import Constants from '../../utils/constants';
	import type { ItemModel } from '../../models/covertModel';
	import { currentMainThemeColors } from '../../stores/darkMode';
	import { LL } from '$lib/i18n/i18n-svelte';

	export let title: string;
	export let pageType: string;
	export let items: ItemModel[] = [];
	export let youtubeThumbnail: string[] = [];

	function DetailsPage(itemId: number) {
		goto(`/${pageType}/detail/${itemId}`);
	}
</script>
 
<div class="flex flex-col mb-10 rounded-lg {Constants.page_max_width} mx-auto">
	<h2 class="text-xl font-bold text-center mb-5">{title}</h2>

	{#if items && items.length > 0}
		<div class="space-y-4">
			{#each items as item, index}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="group flex items-center gap-4 p-3 transition cursor-pointer"
					style="border-bottom: 1px solid {$currentMainThemeColors.primaryColor}"
					on:click={() => DetailsPage(item.id)}
					on:mouseenter={(e) => {
						e.currentTarget.style.backgroundColor = $currentMainThemeColors.primaryColor || '';
						e.currentTarget.style.color = $currentMainThemeColors.overlayPrimaryColor || '';
						e.currentTarget.style.borderRadius = '0.5rem';
					}}
					on:mouseleave={(e) => {
						e.currentTarget.style.backgroundColor = '';
						e.currentTarget.style.color = '';
						e.currentTarget.style.borderRadius = '';
					}}
				>
					<div class="w-24 h-20 shrink-0">
						<img
							src={item.thumbnail ?? youtubeThumbnail[index]}
							alt="thumbnail"
							class="w-full h-full object-cover rounded-md"
						/>
					</div>
					<div class="flex flex-col flex-1 overflow-hidden">
						<h3 class="font-semibold text-sm truncate">
							{item.title.length > 40 ? `${item.title.slice(0, 40)}...` : item.title}
						</h3>
						<p class="text-xs mt-1 text-gray-600 line-clamp-2">
							{item.short_description && item.short_description.length > 100
								? `${item.short_description.slice(0, 100)}...`
								: item.short_description}
						</p>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="text-center py-4 text-gray-500">
			{$LL.noDataMessage({ type: title.toLowerCase() })}
		</div>
	{/if}
</div>
