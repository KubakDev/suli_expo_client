<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { currentUser } from '../../stores/currentUser';
	import { Button, Fileupload, Input, Label } from 'flowbite-svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import imageCompression from 'browser-image-compression';

	let imageFile: File | undefined;
	let fileName: string;
	let currentImageFile = false;

	let direction = 'ltr';
	$: if ($locale === 'ckb' || $locale === 'ar') direction = 'rtl';

	export let data: any;
	$: {
		console.log($currentUser);
	}

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
		console.log(data?.session?.user.id);
		if (!data.session && !data.session?.user) {
			setTimeout(() => {
				goto('/login');
			}, 100);
			return;
		}

		await data.supabase
			.from('company')
			.select('*')
			.eq('uid', data?.session?.user.id)
			.single()
			.then((res: any) => {
				if (res.data) {
					console.log(res.data);
					currentUser.set(res.data);
				}
			});

		console.log($currentUser);
		userData = {
			logo_url: $currentUser.logo_url,
			phone_number: $currentUser.phone_number,
			company_name: $currentUser.company_name,
			email: $currentUser.email,
			working_field: $currentUser.working_field,
			manager_name: $currentUser.manager_name,
			passport_number: $currentUser.passport_number,
			address: $currentUser.address,
			type: $currentUser.type
		};

		loaded = true;
	});

	async function submitForm() {
		formSubmitted = true;

		const response = await data.supabase.storage.from('image').upload(`${fileName}`, imageFile!);
		userData.logo_url = response.data?.path || '';

		const { data: existingData } = await data.supabase
			.from('company')
			.select('*')
			.eq('uid', data?.session?.user.id)
			.single();

		if (existingData) {
			await data.supabase.from('company').update(userData).eq('uid', data?.session?.user.id);
		} else {
			await data.supabase.from('company').insert({
				...userData,
				uid: data?.session?.user.id
			});
		}

		// Immediately update currentUser store after inserting/updating the data
		// currentUser.set({
		// 	uid: data?.session?.user.id,
		// 	logo_url: userData.logo_url,
		// 	phone_number: userData.phone_number,
		// 	company_name: userData.company_name,
		// 	email: userData.email,
		// 	working_field: userData.working_field,
		// 	manager_name: userData.manager_name,
		// 	passport_number: userData.passport_number,
		// 	address: userData.address,
		// 	type: userData.type
		// });
		await data.supabase
			.from('company')
			.select('*')
			.eq('uid', data?.session?.user.id)
			.single()
			.then((res: any) => {
				if (res.data) {
					console.log(res.data);
					currentUser.set(res.data);
				}
			});
		goto(localStorage.getItem('redirect') ?? '/exhibition/1');
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

	function returnLocaleMessage(field: any) {
		let result: any = $LL.company_info;
		return result[field]();
	}
</script>

<form class="flex min-h-screen justify-center items-center w-full p-8">
	<div class="shadow-md rounded-md p-8 w-full lg:w-1/2" style="background-color: #f3f3f3">
		<div class="flex justify-center items-center pb-10">
			<img
				src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${userData.logo_url}`}
				alt="logo"
				class="w-44 h-44 rounded-full border bg-white"
			/>
		</div>
		<div class="grid gap-6 mb-6 md:grid-cols-2">
			{#each Object.keys(userData) as user}
				<div class="grid grid-cols-2">
					{#if user === 'logo_url'}
						<div class="col-span-2 w-full">
							<Label dir={direction} for={user} class="mb-2">{`${returnLocaleMessage(user)}`}</Label
							>
							<Fileupload
								on:change={handleFileUpload}
								accept=".png,.jpg,.jpeg,.gif"
								class="w-full p-2 border rounded-md"
								placeholder="Upload"
							/>
						</div>
					{:else}
						<div class="col-span-2 w-full">
							<Label dir={direction} for={user} class="mb-2">{returnLocaleMessage(user)}</Label>
							<Input
								type="text"
								id={user}
								placeholder={returnLocaleMessage(user)}
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
