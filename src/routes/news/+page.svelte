<script lang="ts">
	import { onMount } from 'svelte';
	import { newsSectionStore } from '../../stores/newsSectionStore';
	import News from '$lib/components/News.svelte';

	export let data;
	let supabase: any;

	newsSectionStore.subscribe((data) => {
		console.log('data', data);
	});

	onMount(async () => {
		supabase = data.supabase;
		newsSectionStore.get(supabase);
	});
</script>

<svelte:head>
	<title>News</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

{#if $newsSectionStore}
	<div class="my-4">
		<News news={$newsSectionStore} {supabase} />
	</div>
{/if}
