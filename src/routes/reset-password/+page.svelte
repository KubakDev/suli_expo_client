<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	async function changePassword() {
		console.log('clicked');
		await data.supabase.auth.updateUser({
			password: '123456789'
		});
	}
</script>

<div>
	<Button on:click={changePassword}>changePassword</Button>
</div>
