<script lang="ts">
	import { LL } from '$lib/i18n/i18n-svelte';
	//@ts-ignore
	import Marquee from "svelte-fast-marquee";
	import type { Locale } from 'typesafe-i18n/types/runtime/src/core.mjs';
	import type { ExhibitionModel } from '../../models/exhibitionModel';
	import TitleUi from './TitleUi.svelte';
	export let exhibition: ExhibitionModel;
	export let locale: Locale;
</script>

{#if exhibition.sponsor_images}
<TitleUi text={$LL.exhibition_mini_data.Exhibition_Sponsors()} />
<div class="sponsor-slider flex py-6">
	<Marquee
	speed={30}
	--bg-color="transparent"
	> 
		<div class="flex flex-row space-x-8">
			{#each exhibition.sponsor_images as sponsor}
				<img src={sponsor} class="w-48 h-48 object-cover rounded-xl" />
			{/each}
		</div>
	</Marquee>
</div>
{/if}