<script lang="ts">
	import { onMount } from 'svelte';
	import { newsSectionStore } from '../../stores/newsSectionStore';
	import News from '$lib/components/News.svelte';

	export let data;

	// newsSectionStore.subscribe((data) => {
	// 	console.log('data', data);
	// });

	onMount(async () => {
		newsSectionStore.get(data.supabase);
	});
</script>

<svelte:head>
	<title>News</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

{#if $newsSectionStore}
	<div class="my-4">
		<News news={$newsSectionStore} supabase={data.supabase} />
	</div>
{/if}
