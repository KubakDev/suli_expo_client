<script lang="ts">
	import { Button, Input } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	//@ts-ignore
	import { LL } from '$lib/i18n/i18n-svelte';

	import Test from '../login/test.png';

	export let data;

	let newPassword = '';
	let errorCode = 0;
	async function changePassword() {
		await data.supabase.auth
			.updateUser({
				password: newPassword
			})
			.then((res) => {
				errorCode = res.error?.status ?? 0;
				if (res.data.user) {
					goto('/login');
				}
			})
			.catch((err) => {});
	}
</script>

<div class="w-full flex justify-center items-center">
	<form class="flex h-screen justify-center items-center w-3/4 max-w-[1000px]">
		<div class="shadow-md rounded-md w-1/2 z-30" style="background-color:white">
			<div
				class="w-full h-[100px] rounded-t-md"
				style={`background-image: url(${Test});  background-repeat: no-repeat;
			background-size: cover; `}
			/>
			<div class="px-8 pt-32 pb-10">
				<div class="w-full flex justify-center" />
				<div class="w-full">
					<Input
						type="password"
						id="password"
						placeholder="*********"
						name="password"
						bind:value={newPassword}
					/>
					<p class="text-danger-600">{errorCode == 422 ? $LL.loggin.duplicate_password() : ''}</p>
				</div>
				<div class="w-full">
					<Button on:click={changePassword} class=" mt-10 w-full "
						>{$LL.loggin.change_password()}</Button
					>
				</div>
			</div>
		</div>
	</form>
</div>
