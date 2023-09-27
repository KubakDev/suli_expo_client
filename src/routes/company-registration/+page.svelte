<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { currentUser } from '../../stores/currentUser';
	import { Button, Fileupload, Input, Label } from 'flowbite-svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import imageCompression from 'browser-image-compression';

	let imageFile: File | undefined;
	let imageFile2: File | undefined;
	let imageFile3: File | undefined;
	let fileName: string;
	let fileName2: string;
	let fileName3: string;
	let currentImageFile = false;
	let currentImageFile2 = false;
	let currentImageFile3 = false;
	let passportImageError = false;
	let userImageError = false;

	let direction = 'ltr';
	$: if ($locale === 'ckb' || $locale === 'ar') direction = 'rtl';

	export let data: any;

	let userData: any = {
		logo_url: '',
		phone_number: '',
		company_name: '',
		email: '',
		working_field: '',
		manager_name: '',
		passport_number: '',
		country: '',
		address: '',
		passport_image: '',
		user_image: ''
	};

	$: {
		if ($currentUser && $currentUser.id) {
			goto(localStorage.getItem('redirect') ?? '/exhibition/1');
		}
	}
	let formSubmitted = false;

	let loaded = false;
	onMount(async () => {
		if (!data.session && !data.session?.user) {
			setTimeout(() => {
				goto('/login');
			}, 100);
			return;
		}

		// console.log('email', data.session.user.email);
		// console.log('////////////////', $currentUser.id);

		if ($currentUser && $currentUser.id) {
			goto(localStorage.getItem('redirect') ?? '/exhibition/1');
		}

		await data.supabase
			.from('company')
			.select('*')
			.eq('uid', data?.session?.user.id)
			.single()
			.then((res: any) => {
				if (res.data) {
					currentUser.set(res.data);
				}
			});

		userData = {
			logo_url: $currentUser?.logo_url,
			phone_number: $currentUser?.phone_number,
			company_name: $currentUser?.company_name,
			email: data?.session?.user?.email,
			working_field: $currentUser?.working_field,
			manager_name: $currentUser?.manager_name,
			passport_number: $currentUser?.passport_number,
			country: $currentUser?.country,
			address: $currentUser?.address,
			passport_image: $currentUser?.passport_image,
			user_image: $currentUser?.user_image
		};

		loaded = true;
	});

	async function submitForm() {
		formSubmitted = true;

		if (selectedCountry === 'Other' && otherCountry) {
			userData.country = otherCountry;
		} else {
			userData.country = selectedCountry;
		}

		if (selectedCountry === 'Other') {
			passportImageError = !currentImageFile2 && !userData.passport_image;
			userImageError = !currentImageFile3 && !userData.user_image;

			if (passportImageError || userImageError) {
				return;
			}
		}

		const response = await data.supabase.storage.from('image').upload(`${fileName}`, imageFile!);
		userData.logo_url = response.data?.path || '';

		const response2 = await data.supabase.storage.from('image').upload(`${fileName2}`, imageFile2!);
		userData.passport_image = response2.data?.path || '';

		const response3 = await data.supabase.storage.from('image').upload(`${fileName3}`, imageFile3!);
		userData.user_image = response3.data?.path || '';

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

		await data.supabase
			.from('company')
			.select('*')
			.eq('uid', data?.session?.user.id)
			.single()
			.then((res: any) => {
				if (res.data) {
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

	export async function handleFileUploadPassportImage(e: Event) {
		currentImageFile2 = true;
		const fileInput = e.target as HTMLInputElement;
		if (fileInput.files!.length > 0) {
			currentImageFile2 = true;
			passportImageError = false;
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
					userData.passport_image = reader.result as string;
					const randomText = getRandomTextNumber();
					const newFileName = `users/${randomText}_${compressedFile.name}`;
					setImageFile2(compressedFile);
					setFileName2(newFileName);
				};
				reader.readAsDataURL(compressedFile);
			} catch (error) {}
		}
	}

	export async function handleFileUploadUserImage(e: Event) {
		currentImageFile3 = true;
		const fileInput = e.target as HTMLInputElement;
		if (fileInput.files!.length > 0) {
			currentImageFile3 = true;
			userImageError = false;
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
					userData.user_image = reader.result as string;
					const randomText = getRandomTextNumber();
					const newFileName = `users/${randomText}_${compressedFile.name}`;
					setImageFile3(compressedFile);
					setFileName3(newFileName);
				};

				reader.readAsDataURL(compressedFile);
			} catch (error) {}
		}
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

	function setImageFile2(file: File) {
		imageFile2 = file;
	}
	function setFileName2(name: string) {
		fileName2 = name;
	}

	function setImageFile3(file: File) {
		imageFile3 = file;
	}
	function setFileName3(name: string) {
		fileName3 = name;
	}

	function returnLocaleMessage(field: any) {
		let result: any = $LL.company_info;
		return result[field]();
	}

	let selectedCountry = 'Iraq';
	let otherCountry = '';

	function handleCountryChange(event: any) {
		selectedCountry = event.target.value;

		if (selectedCountry === 'Other') {
			otherCountry = '';
		} else {
			otherCountry = '';
			userData.country = selectedCountry;
		}
	}
</script>

<form class="flex min-h-screen justify-center items-center w-full p-8">
	<div class="shadow-md rounded-md p-8 w-full lg:w-1/2" style="background-color: #f3f3f3">
		<div class="flex justify-center items-center pb-10">
			<img
				src={currentImageFile
					? userData.logo_url
					: `${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${userData.logo_url}`}
				alt="logo"
				class="w-44 h-44 rounded-full border bg-white"
			/>
		</div>

		<div class="grid gap-6 mb-6 md:grid-cols-2">
			{#each Object.keys(userData) as user (user)}
				{#if user !== 'country' && user !== 'passport_image' && user !== 'user_image' && user !== 'logo_url'}
					<div>
						<Label dir={direction} for={user} class="mb-2">{returnLocaleMessage(user)}</Label>
						<Input
							type={user === 'email' ? 'email' : 'text'}
							id={user}
							placeholder={returnLocaleMessage(user)}
							bind:value={userData[user]}
							disabled={user === 'email'}
						/>
					</div>
				{/if}
			{/each}

			{#if selectedCountry === 'Other'}
				<div>
					<Label dir={direction} for="passport_image" class="mb-2"
						>{returnLocaleMessage('passport_image')}</Label
					>
					<Fileupload
						on:change={handleFileUploadPassportImage}
						accept=".png,.jpg,.jpeg,.gif"
						class="w-full p-2 border rounded-md"
						placeholder="Upload"
					/>
					<div>
						{#if passportImageError}
							<span class="text-red-500">Passport image is required</span>
						{/if}
					</div>
				</div>

				<div>
					<Label dir={direction} for="user_image" class="mb-2"
						>{returnLocaleMessage('user_image')}</Label
					>
					<Fileupload
						on:change={handleFileUploadUserImage}
						accept=".png,.jpg,.jpeg,.gif"
						class="w-full p-2 border rounded-md"
						placeholder="Upload"
					/>
					<div>
						{#if userImageError}
							<span class="text-red-500">user image is required</span>
						{/if}
					</div>
				</div>
			{/if}

			<div>
				<Label dir={direction} for="country" class="mb-2">Country</Label>
				<select
					class="block w-full p-2.5 rounded-lg"
					id="country"
					bind:value={selectedCountry}
					on:change={handleCountryChange}
				>
					<option value="Iraq">Iraq</option>
					<option value="Other">Other</option>
				</select>
			</div>

			{#if selectedCountry === 'Other'}
				<div>
					<Label dir={direction} for="otherCountry" class="mb-2">Specify Country</Label>
					<Input
						type="text"
						id="otherCountry"
						placeholder="Enter country name"
						bind:value={otherCountry}
					/>
				</div>
			{/if}

			<!-- Logo Upload -->
			<div class="col-span-1">
				<Label dir={direction} for="logo_url" class="mb-2">{returnLocaleMessage('logo_url')}</Label>
				<Fileupload
					on:change={handleFileUpload}
					accept=".png,.jpg,.jpeg,.gif"
					class="w-full p-2 border rounded-md"
					placeholder="Upload"
				/>
			</div>
		</div>

		<div class="w-full flex justify-end">
			<Button on:click={submitForm} type="button">{$LL.buttons.submit()}</Button>
		</div>
	</div>
</form>
