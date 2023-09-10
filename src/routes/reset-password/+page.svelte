<script lang="ts">
	import { Button, Input } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	//@ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';

	import Test from '../login/test.png';

	export let data;

	let loading = false;
	let newPassword = '';
	async function changePassword() {
		await data.supabase.auth
			.updateUser({
				password: newPassword
			})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}
</script>

<div class="w-full flex justify-center items-center">
	<form class="flex h-screen justify-center items-center w-3/4 max-w-[1000px]" dir="ltr">
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
				</div>
				<div class="w-full">
					<Button on:click={changePassword} class=" mt-10 w-full ">change password</Button>
				</div>
			</div>
		</div>
	</form>
</div>
