<script lang="ts">

	import { ArrowDown, ArrowUp } from "svelte-heros-v2";
	import { ascStore } from "../../stores/ascStore";
	import LL from "$lib/i18n/i18n-svelte";

    let asc = ascStore;

	function changeOrder() {
		asc.set(!$asc);
	}
</script>
<div class="p-2 text-center w-full">
    {#if $asc}
        <button
            on:click={changeOrder}
            class="flex flex-row items-center justify-center p-2 rounded-full bg-exhibitionLightPrimaryColor dark:bg-exhibitionDarkPrimaryColor"
        >
            <ArrowUp
                size="15"
                class="transition-all hover:animate-pulse text-exhibitionLightBackgroundColor dark:text-exhibitionDarkBackgroundColor"
            />

            <span
                class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1 text-exhibitionLightBackgroundColor dark:text-exhibitionDarkBackgroundColor"
                >{$LL.ascending()}</span
            >
        </button>
    {:else}
        <button
            on:click={changeOrder}
            class="flex flex-row items-center justify-center p-2 rounded-full bg-exhibitionLightPrimaryColor dark:bg-exhibitionDarkPrimaryColor"
        >
            <ArrowDown
                size="15"
                class="transition-all hover:animate-pulse text-exhibitionLightBackgroundColor dark:text-exhibitionDarkBackgroundColor"
            />
            <span
                class="uppercase sm:text-xs text-[10px] font-bold pl-2 pr-1 text-exhibitionLightBackgroundColor dark:text-exhibitionDarkBackgroundColor"
                >{$LL.descending()}</span
            >
        </button>
    {/if}
</div>