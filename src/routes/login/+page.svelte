<script lang="ts">
	import { currentMainThemeColors } from '../../stores/darkMode';
	import SVGLoginComponent from '../../lib/components/SVGLoginComponent.svelte';
	import { Button, Input, Label, Modal, Spinner } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { currentUser } from '../../stores/currentUser';
	import { goto } from '$app/navigation';
	//@ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import Test from './test.png';
	export let form;
	export let data;
	import { get } from 'svelte/store';

	let loading = false;
	let resetPasswordModal = false;
	let resetEmail = '';
	onMount(async () => {
		if (data?.session?.user.id) {
			data.supabase
				.from('company')
				.select('*')
				.eq('uid', data?.session?.user.id)
				.single()
				.then((res) => {
					if (res.data) {
						if (!res.data.first_name || !res.data.last_name || !res.data.phone_number) {
							goto('/company-registration');
						} else {
							currentUser.set(res.data);
							goto(localStorage.getItem('redirect') ?? '/');
						}
					} else {
						goto('/company-registration');
					}
				});
		}
	});
	function onSubmit() {
		loading = true;
	}

	let message = '';
	async function resetPassword() {
		await data.supabase.auth.resetPasswordForEmail(resetEmail, {
			redirectTo: 'https://suli-expo-client-seven.vercel.app/reset-password'
		});
		message = get(LL).loggin.message();
	}
</script>

<!-- reset password  -->
<Modal title={$LL.loggin.reset_password()} bind:open={resetPasswordModal}>
	<div class="w-full">
		<Input
			type="text"
			id="email"
			placeholder="example@example.com"
			name="email"
			bind:value={resetEmail}
		/>
	</div>
	{#if message}
		<div class="ww-full text-center bg-green-200 rounded py-5 text-green-800">{message}</div>
	{/if}

	<div class="w-full flex justify-end">
		<Button
			on:click={resetPassword}
			style="background-color:{$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
			>{$LL.loggin.send_email()}</Button
		>
	</div>
</Modal>
<div
	style="background-color: {$currentMainThemeColors.backgroundColor};"
	class="flex flex-wrap min-h-screen w-full content-center justify-center py-10"
>
	<div class="flex shadow-md border rounded-md">
		<!-- Login form -->
		<div
			class=" flex flex-wrap content-center justify-center rounded-l-md w-[22rem] md:w-[24rem]"
			style=" height: 32rem; background-color: {$currentMainThemeColors.backgroundColor};"
		>
			<div class="w-72">
				<!-- Heading -->
				<h1 class="text-xl font-semibold">{$LL.buttons.loginForm()}</h1>
				<small
					class="flex justify-center items-center opacity-70"
					style=" color: {$currentMainThemeColors.overlayBackgroundColor};"
					>{$LL.loggin.loginDesc()}</small
				>

				<!-- Form -->
				<form
					class="mt-4"
					action="?/signin"
					method="POST"
					use:enhance
					style={`${$locale === 'en' ? 'direction:ltr' : 'direction:rtl'}`}
				>
					<div class="mb-3">
						<label class="mb-2 block text-xs font-semibold">{$LL.loggin.email()}</label>
						<input
							type="text"
							id="email"
							placeholder="example@example.com"
							name="email"
							value={form?.email ?? ''}
							class="block w-full rounded-md border border-gray-300 focus:border-[{$currentMainThemeColors.primaryColor}] focus:outline-none focus:ring-1 focus:ring-[{$currentMainThemeColors.primaryColor}] py-1 px-1.5"
						/>
					</div>

					<div class="mb-3">
						<label class="mb-2 block text-xs font-semibold">{$LL.loggin.password()}</label>
						<input
							type="password"
							id="password"
							placeholder="******"
							name="password"
							value={form?.password ?? ''}
							class="block w-full rounded-md border border-gray-300 focus:border-[{$currentMainThemeColors.primaryColor}] focus:outline-none focus:ring-1 focus:ring-[{$currentMainThemeColors.primaryColor}] py-1 px-1.5"
						/>
					</div>
					{#if form?.errors}
						<span class="py-3 px-1 text-red-400">
							{form?.errors == 'Invalid login credentials'
								? $LL.loggin.error()
								: form?.errors}</span
						>
					{/if}
					<div class="mb-3 flex flex-wrap content-center">
						<a
							href="#"
							on:click={() => {
								resetPasswordModal = true;
							}}
							class="text-xs font-semibold"
							style="color:{$currentMainThemeColors.primaryColor}">{$LL.loggin.forgot_password()}</a
						>
					</div>

					<div class="mb-3">
						<button
							on:click={onSubmit}
							style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
							class="mb-1.5 block w-full text-center px-2 py-1.5 rounded-md"
						>
							{$LL.loggin.signIn()}</button
						>
					</div>
				</form>

				<!-- Footer -->
				<div class="text-center">
					<span style="color: {$currentMainThemeColors.overlayBackgroundColor};" class="text-xs"
						>{$LL.loggin.alertText()}</span
					>
					<a
						href={'/register'}
						class="text-xs font-semibold"
						style="color:{$currentMainThemeColors.primaryColor}">{$LL.loggin.register()}</a
					>
				</div>
			</div>
		</div>

		<!-- Login banner -->
		<div
			class="lg:flex flex-wrap content-center justify-center rounded-r-md hidden"
			style="width: 24rem; height: 32rem;background-color: {$currentMainThemeColors.backgroundColor};"
		>
			<SVGLoginComponent />
		</div>
	</div>
</div>
