<script lang="ts">
	import { Button, Input, Label, Spinner } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { currentUser } from '../../stores/currentUser';
	import { goto } from '$app/navigation';
	//@ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { LL } from '$lib/i18n/i18n-svelte';
	import Test from './test.png';
	export let form;
	export let data;
	let loading = false;

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
</script>

<div class="w-full flex justify-center items-center">
	<form
		action="?/signin"
		method="POST"
		class="flex h-screen justify-center items-center w-3/4 max-w-[1000px]"
		use:enhance
		dir="ltr"
	>
		<div class="shadow-md rounded-md w-1/2 z-50" style="background-color:white">
			<div
				class="w-full h-[100px] rounded-t-md"
				style={`background-image: url(${Test});  background-repeat: no-repeat;
			background-size: cover; `}
			/>
			<div class="px-8 pt-32 pb-10">
				<div class="w-full flex justify-center" />
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
					<span class="py-2 px-1 text-red-400">
						{form?.errors == 'Invalid login credentials' ? $LL.loggin.error() : form?.errors}</span
					>
				{/if}
				<div class="w-full grid grid-cols-3 gap-2">
					<Button on:click={onSubmit} type="submit" class=" mt-10 col-span-2 ">
						{$LL.buttons.submit()}</Button
					>
					<Button
						on:click={() => {
							goto('/register');
						}}
						type="button"
						class=" mt-10"
						outline>{$LL.loggin.register()}</Button
					>
				</div>
			</div>
		</div>
	</form>
</div>
