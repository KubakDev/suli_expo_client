<script lang="ts">
	import type { NewsModel } from '../../models/newsModel';
	import { ImgSourceEnum } from '../../models/imgSourceEnum';
	import { onMount } from 'svelte';
	import newsUiStore, { getNewsUi } from '../../stores/ui/newsUi';
	import TitleUi from './TitleUi.svelte';
	import { Button } from 'flowbite-svelte';

	let news = [1, 2, 3];
</script>

<section class="py-10">
	<div class="flex justify-between items-center my-8">
		<div class="h-10 w-32" />
		<div class="">
			<TitleUi text="News " />
		</div>
		<Button color="primary" class="w-32 rounded-md bg-primary text-black animate-pulse"
			>See all</Button
		>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-5 justify-items-stretch items-center">
		{#each news as n, i}
			<div class="block bg-slate-500 h-96 rounded-lg min-w-[100px]">
				<div
					class="animate-pulse w-full h-44 bg-slate-700 rounded-tl-lg rounded-tr-lg overflow-hidden"
				/>
			</div>
		{/each}
	</div>
</section>
