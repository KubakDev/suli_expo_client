<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	export let data: any;
	import { LL, locale } from '$lib/i18n/i18n-svelte';

	let user: any = {};
	let loading = true;

	onMount(async () => {
		const { data: res, error } = await data.supabase
			.from('UserRegistration')
			.select('*')
			.eq('id', $page.params.id)
			.single();
		if (res) {
			user = res;
		} else {
			console.error(error);
		}
		loading = false;
	});
</script>

{#if loading}
	<div class="flex items-center justify-center h-screen">
		<div class="spinner" />
	</div>
{:else}
	<div class="container mx-auto p-6 max-w-4xl">
		<div class="bg-white p-6 rounded-lg shadow-lg">
			<h1 class="text-2xl font-semibold mb-5 text-center">{$LL.registrationForm.userInfo()}</h1>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<p><strong>{$LL.registrationForm.userName()}:</strong> {user.name}</p>
				<p><strong>{$LL.registrationForm.email()}:</strong> {user.email}</p>
				<p><strong>{$LL.registrationForm.phoneNumber()} :</strong> {user.phoneNumber}</p>
				<p><strong> {$LL.registrationForm.companyName()} :</strong> {user.companyName}</p>
				<p><strong>{$LL.registrationForm.fieldWork()} :</strong> {user.fieldWork}</p>
				<p><strong>{$LL.registrationForm.jobGrade()}:</strong> {user.jobGrade}</p>
				<p><strong>{$LL.registrationForm.country()}:</strong> {user.country}</p>
				<p><strong>{$LL.registrationForm.city()}:</strong> {user.city}</p>
				<p><strong>{$LL.registrationForm.hotelBooking()}:</strong> {user.hotelBooking}</p>
			</div>
		</div>
	</div>
{/if}

<style>
	.spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		width: 36px;
		height: 36px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
