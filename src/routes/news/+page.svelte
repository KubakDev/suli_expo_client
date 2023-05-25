<script lang="ts">
	import { onMount } from 'svelte';
	import { newsSectionStore } from '../../stores/newsSectionStore';
	import News from '$lib/components/News.svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';

	export let data;

	// newsSectionStore.subscribe((data) => {
	// 	console.log('data', data);
	// });

	onMount(async () => {
		newsSectionStore.get($locale, data.supabase);
	});
</script>

<svelte:head>
	<title>News</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

{#if $newsSectionStore}
	<div class="dark:bg-slate-900">
		<div class="mx-auto px-4 sm:px-5 max-w-screen-2xl">
			<News news={$newsSectionStore} supabase={data.supabase} />
		</div>
	</div>
{/if}
