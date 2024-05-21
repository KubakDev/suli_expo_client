<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { profileStore } from '../../../stores/userStore';

	let user: any = {};
	let loading = true;
	export let data: any;

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

	///////// get required fields from db  ////////
	let profiles: any[] = [];

	onMount(async () => {
		const userData = await profileStore.get(data.supabase);
		if (userData) {
			profiles = userData;
		}
	});

	$: profiles;
	$: userTitle = profiles[0]?.title ? JSON.parse(profiles[0].title)[$locale] : '';
</script>

{#if loading}
	<div class="flex items-center justify-center h-screen">
		<div class="spinner" />
	</div>
{:else}
	<div class="container mx-auto p-6 max-w-4xl">
		<div class="bg-white p-6 rounded-lg shadow-lg">
			<h1 class="text-2xl font-semibold mb-5 text-center">
				{$LL.registrationForm.userInfo()}
				- {userTitle}
			</h1>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#if profiles[0]?.name === 'true' && user.name}
					<p><strong>{$LL.registrationForm.userName()}:</strong> {user.name}</p>
				{/if}
				{#if profiles[0]?.email === 'true' && user.email}
					<p><strong>{$LL.registrationForm.email()}:</strong> {user.email}</p>
				{/if}
				{#if profiles[0]?.phoneNumber === 'true' && user.phoneNumber}
					<p><strong>{$LL.registrationForm.phoneNumber()} :</strong> {user.phoneNumber}</p>
				{/if}
				{#if profiles[0]?.companyName === 'true' && user.companyName}
					<p><strong> {$LL.registrationForm.companyName()} :</strong> {user.companyName}</p>
				{/if}
				{#if profiles[0]?.fieldWork === 'true' && user.fieldWork}
					<p><strong>{$LL.registrationForm.fieldWork()} :</strong> {user.fieldWork}</p>
				{/if}
				{#if profiles[0]?.jobGrade === 'true' && user.jobGrade}
					<p><strong>{$LL.registrationForm.jobGrade()}:</strong> {user.jobGrade}</p>
				{/if}
				{#if profiles[0]?.country === 'true' && user.country}
					<p><strong>{$LL.registrationForm.country()}:</strong> {user.country}</p>
				{/if}
				{#if profiles[0]?.city === 'true' && user.city}
					<p><strong>{$LL.registrationForm.city()}:</strong> {user.city}</p>
				{/if}
				{#if profiles[0]?.hotelBooking === 'true' && user.hotelBooking}
					<p><strong>{$LL.registrationForm.hotelBooking()}:</strong> {user.hotelBooking}</p>
				{/if}
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
