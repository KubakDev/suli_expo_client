<script lang="ts">
	import { Button, Input, Label, Modal, Spinner } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import EmailVerification from './emailVerificationIcon.json';
	import { currentUser } from '../../stores/currentUser';
	//@ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import type { ActionData } from './$types.js';
	import { currentMainThemeColors } from '../../stores/darkMode';
	import SVGRegisterComponent from '$lib/components/SVGRegisterComponent.svelte';

	export let form: ActionData;
	export let data;
	let loading = false;
	let showModal = false;
	let error = false;

	let userInfo: {
		email: string;
		uid: string;
	};

	$: if (form) {
		userInfo = {
			email: form?.email as string,
			uid: form?.uid as string
		};
		onSubmit();
	}
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
		// Validate if the password is less than 6 characters
		error = false;
		if (form?.password && form.password.length < 6) {
			error = true;
			loading = false;
			return;
		}
		loading = true;

		if (userInfo && userInfo?.email && userInfo?.uid) {
			loading = false;
			showModal = true;
		}
	}
</script>

<Modal title={$LL.loggin.Modal.successMsg()} open={showModal}>
	<template slot="header"> <h1>lalala</h1> </template>
	<div class="w-full flex justify-center items-center">
		<LottiePlayer
			src={EmailVerification}
			autoplay={true}
			loop={true}
			renderer="svg"
			background="transparent"
			height={200}
			width={200}
		/>
	</div>
	<p class="text-2xl font-bold mb-5 leading-relaxed text-gray-500 dark:text-gray-400 text-center">
		{$LL.loggin.Modal.successMsg()}
	</p>
	<p class="text-xl font-medium mb-5 leading-relaxed text-gray-500 dark:text-gray-400 text-center">
		{$LL.loggin.Modal.msg()}
	</p>
</Modal>

<div
	style="background-color: {$currentMainThemeColors.backgroundColor};"
	class="flex flex-wrap min-h-screen w-full content-center justify-center py-10"
>
	<div class="flex shadow-md border rounded-md">
		<!-- register form -->
		<div
			class=" flex flex-wrap content-center justify-center rounded-l-md w-[22rem] md:w-[24rem]"
			style=" height: 32rem; background-color: {$currentMainThemeColors.backgroundColor};"
		>
			<div class="w-72">
				<!-- Heading -->
				<h1 class="text-xl font-semibold">{$LL.register.registerForm()}</h1>

				<!-- Form -->
				<form
					use:enhance
					style={`${$locale === 'en' ? 'direction:ltr' : 'direction:rtl'}`}
					action="?/register"
					method="POST"
					class="mt-4"
					use:enhance
				>
					<div class="mb-3">
						<label class="mb-2 block text-xs font-semibold">{$LL.loggin.email()}</label>
						<input
							type="text"
							id="email"
							placeholder="example@example.com"
							name="email"
							value={form?.email ?? ''}
							class="block w-full rounded-md border border-gray-300 focus:border-[{$currentMainThemeColors.primaryColor}] focus:outline-none focus:ring-1 focus:ring-[{$currentMainThemeColors.primaryColor}] py-1 px-1.5 text-gray-500"
						/>
					</div>

					<div class="mb-3">
						<label class="mb-2 block text-xs font-semibold">{$LL.loggin.password()}</label>
						<input
							type="password"
							id="password"
							placeholder="*********"
							name="password"
							value={form?.password ?? ''}
							class="block w-full rounded-md border border-gray-300 focus:border-[{$currentMainThemeColors.primaryColor}] focus:outline-none focus:ring-1 focus:ring-[{$currentMainThemeColors.primaryColor}] py-1 px-1.5 text-gray-500"
						/>
					</div>
					{#if form?.errors}
						<span class="text-sm py-2 px-1 text-red-400">{form?.errors}</span>
					{/if}
					<div class="text-sm text-red-400 mb-2">
						{#if error}
							{$LL.register.warning()}
						{/if}
					</div>
					<!-- <div class="mb-3 flex flex-wrap content-center">
						<a
							href="#"
							on:click={() => {
								resetPasswordModal = true;
							}}
							class="text-xs font-semibold"
							style="color:{$currentMainThemeColors.primaryColor}">{$LL.loggin.forgot_password()}</a
						>
					</div> -->

					<div class="mb-3">
						<button
							on:click={onSubmit}
							style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
							class="mb-1.5 block w-full text-center px-2 py-1.5 rounded-md"
						>
							{$LL.buttons.submit()}</button
						>
					</div>
				</form>

				<!-- Footer -->
				<div class="text-center">
					<span style="color: {$currentMainThemeColors.overlayBackgroundColor};" class="text-xs"
						>{$LL.register.alertText()}</span
					>
					<button
						on:click={() => {
							goto('/login');
						}}
						class="text-xs font-semibold"
						style="color:{$currentMainThemeColors.primaryColor}">{$LL.loggin.login()}</button
					>
				</div>
			</div>
		</div>

		<!-- Login banner -->
		<div
			class="lg:flex flex-wrap content-center justify-center rounded-r-md hidden"
			style="width: 24rem; height: 32rem;background-color: {$currentMainThemeColors.backgroundColor};"
		>
			<SVGRegisterComponent />
		</div>
	</div>
</div>
