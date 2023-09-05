<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	async function changePassword() {
		await data.supabase.auth.updateUser({
			password: '123456789'
		});
	}
</script>

<Button on:change={changePassword}>changePassword</Button>
