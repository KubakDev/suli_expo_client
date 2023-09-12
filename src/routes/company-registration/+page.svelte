<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { currentUser } from '../../stores/currentUser';
	import { Button, Fileupload, Input, Label } from 'flowbite-svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
	import imageCompression from 'browser-image-compression';

	let imageFile: File | undefined;
	let fileName: string;
	let currentImageFile = false;

	export let data: PageData;

	let userData: any = {
		logo_url: '',
		phone_number: '',
		company_name: '',
		email: '',
		working_field: '',
		manager_name: '',
		passport_number: '',
		address: '',
		type: ''
	};

	let formSubmitted = false;

	let loaded = false;
	onMount(async () => {
		if (data?.session?.user) {
			await data.supabase
				.from('company')
				.select('*')
				.eq('uid', data?.session?.user.id)
				.single()
				.then((res) => {
					if (res.data) {
						if (
							!res.data.logo_url ||
							!res.data.phone_number ||
							!res.data.company_name ||
							!res.data.email ||
							!res.data.working_field ||
							!res.data.manager_name ||
							!res.data.passport_number ||
							!res.data.address ||
							!res.data.type
						) {
							goto('/company-registration');
						} else {
							currentUser.set(res.data);
							goto(localStorage.getItem('redirect') ?? '/');
						}
					} else {
						goto('/company-registration');
					}
				});
			loaded = true;
		}
	});

	async function submitForm() {
		formSubmitted = true;

		const response = await data.supabase.storage.from('image').upload(`${fileName}`, imageFile!);
		userData.logo_url = response.data?.path || '';
		console.log(userData);
		await data.supabase
			.from('company')
			.insert({
				type: userData.type,
				logo_url: userData.logo_url,
				phone_number: userData.phone_number,
				company_name: userData.company_name,
				email: userData.email,
				working_field: userData.working_field,
				manager_name: userData.manager_name,
				passport_number: userData.passport_number,
				address: userData.address,
				uid: data?.session?.user.id
			})
			.select()
			.single()
			.then((response) => {
				if (response.error) return;
				currentUser.set(response.data);
				goto(localStorage.getItem('redirect') ?? '/');
			});
	}

	export async function handleFileUpload(e: Event) {
		currentImageFile = true;
		const fileInput = e.target as HTMLInputElement;
		const file = fileInput.files![0];

		const options = {
			maxSizeMB: 2,
			maxWidthOrHeight: 700,
			useWebWorker: true
		};
		try {
			const compressedFile = await imageCompression(file, options);

			const reader = new FileReader();
			reader.onloadend = () => {
				userData.logo_url = reader.result as string;
				const randomText = getRandomTextNumber();
				const newFileName = `users/${randomText}_${compressedFile.name}`;
				setImageFile(compressedFile);
				setFileName(newFileName);
			};
			reader.readAsDataURL(compressedFile);
		} catch (error) {}
	}

	// generate random number before image URl
	export function getRandomTextNumber() {
		const random =
			Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		return random;
	}

	function setImageFile(file: File) {
		imageFile = file;
	}
	function setFileName(name: string) {
		fileName = name;
	}
</script>

<form class="flex h-screen justify-center items-center w-full">
	<div class="shadow-md rounded-md p-8 w-1/2" style="background-color: var(secondaryColor);">
		<div class="flex justify-center items-center pb-10">
			<img
				src={currentImageFile
					? userData.logo_url
					: 'https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png'}
				alt="logo"
				class="w-44 h-44 rounded-full border bg-white"
			/>
		</div>
		<div class="grid gap-6 mb-6 md:grid-cols-2" dir="ltr">
			{#each Object.keys(userData) as user}
				<div class="grid grid-cols-2">
					{#if user === 'logo_url'}
						<div class="col-span-2 w-full">
							<Label for={user} class="mb-2">{`${$LL.company_info[user]()}`}</Label>
							<Fileupload
								on:change={handleFileUpload}
								accept=".png,.jpg,.jpeg,.gif"
								class="w-full p-2 border rounded-md"
								placeholder="Upload"
							/>
						</div>
					{:else}
						<div class="col-span-2 w-full">
							<Label for={user} class="mb-2">{$LL.company_info[user]()}</Label>
							<Input
								type="text"
								id={user}
								placeholder={$LL.company_info[user]()}
								bind:value={userData[user]}
							/>
						</div>
					{/if}
				</div>
			{/each}
		</div>
		<div class="w-full flex justify-end">
			<Button on:click={submitForm} type="button">{$LL.buttons.submit()}</Button>
		</div>
	</div>
</form>
