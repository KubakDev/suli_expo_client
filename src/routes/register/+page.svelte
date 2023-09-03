<script lang="ts">
	import { Button, Input, Label, Modal, Spinner } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import LoginIcon from '../login/loginIcon.json';
	//@ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { LL } from '$lib/i18n/i18n-svelte';
	import type { ActionData } from './$types.js';

	export let form: ActionData;
	export let data;
	let loading = false;
	let showModal = false;

	let userInfo:{
		email: string,
		uid: string,
	}

	$: if(form){
		userInfo = {
			email: form?.email as string,
			uid: form?.uid as string,
		}		
		onSubmit();
	};

	function onSubmit() {
		loading = true;
		
		 
		
		if(userInfo && userInfo?.email && userInfo?.uid){
			 
			 
			loading = false;
			showModal = true;
		}
	}
</script>

<Modal title="{$LL.loggin.Modal.successMsg()}" open={showModal}>
	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{$LL.loggin.Modal.msg()} {form?.email}</p>
  </Modal>

<div class="w-full flex justify-center items-center" dir="ltr">
	<form
		action="?/register"
		method="POST"
		class="flex h-screen justify-center items-center w-3/4 max-w-[1500px]"
		use:enhance
		dir="ltr"
	>
		<div class="shadow-md rounded-md p-8 w-1/2" style="background-color: var(secondaryColor);">
			<div class="w-full flex justify-center">
				<LottiePlayer
					src={LoginIcon}
					autoplay={true}
					loop={true}
					renderer="svg"
					background="transparent"
					height={300}
					width={300}
				/>
			</div>

			<div class="w-full pb-8">
				<Input
					type="text"
					id="email"
					placeholder="example@example.com"
					name="email"
					value={form?.email ?? ''}
				/>
			</div>
			<div class="w-full">
				<Input
					type="password"
					id="password"
					placeholder="*********"
					name="password"
					value={form?.password ?? ''}
				/>
			</div>
			{#if form?.errors}
				<span class="py-2 px-1 text-red-400">{form?.errors}</span>
			{/if}
			<div class="w-full grid grid-cols-3 gap-2">
				<Button on:click={onSubmit} type="submit" class=" mt-10 col-span-2">
					{#if loading}
						<Spinner class="mr-3" size="4" />
					{/if}{$LL.buttons.submit()}</Button
				>
				<Button
					on:click={() => {
						goto('/login');
					}}
					type="button"
					class=" mt-10"
					outline>{$LL.loggin.login()}</Button
				>
			</div>
		</div>
	</form>
</div>
