<script lang="ts">
	import { onMount } from 'svelte';
	import { serviceSectionStore } from '../../stores/serviceSectionStore';
	import Services from '$lib/components/Services.svelte';

	export let data;

	onMount(async () => {
		await serviceSectionStore.get(data?.supabase);
		console.log('data', $serviceSectionStore);
	});
</script>

<svelte:head>
	<title>Services</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

{#if $serviceSectionStore}
	<div class="dark:bg-slate-900">
		<div class="mx-auto px-4 sm:px-5 max-w-screen-2xl">
			<Services service={$serviceSectionStore} supabase={data.supabase} />
		</div>
	</div>
{/if}
