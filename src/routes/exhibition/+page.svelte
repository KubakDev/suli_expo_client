<script lang="ts">
	import { onMount } from 'svelte';
	import { exhibitionSectionStore } from '../../stores/exhibtionSectionStore';
	import Exhibition from '$lib/components/Exhibition.svelte';
	import TitleUi from '$lib/components/TitleUi.svelte';

	export let data;

	onMount(async () => {
		exhibitionSectionStore.get(data?.supabase);
		console.log('data', $exhibitionSectionStore);
	});
</script>

<h1>jk</h1>
