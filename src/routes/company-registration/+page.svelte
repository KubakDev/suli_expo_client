<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { currentUser } from '../../stores/currentUser';
	import { Button, Fileupload, Input, Label } from 'flowbite-svelte';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import imageCompression from 'browser-image-compression';
	import { currentMainThemeColors } from '../../stores/darkMode';

	let imageFile: File | undefined;
	let fileName: string;
	let currentImageFile = false;
	let currentImageFile2 = false;
	let currentImageFile3 = false;
	let passportImageError = false;
	let userImageError = false;
	let passportFiles: { fileName: string; file: File }[] = [];
	let userImageFiles: { fileName: string; file: File }[] = [];

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
		passport_image: [],
		user_image: []
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

		//
		//

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

	let countryError = '';

	async function submitForm() {
		formSubmitted = true;

		if (selectedCountry === 'Other') {
			if (!otherCountry.trim()) {
				countryError = `${$LL.company_info['specific_country_message']()}`;
				return;
			} else {
				userData.country = otherCountry;
			}

			userData.passport_image = userData.passport_image || [];
			userData.user_image = userData.user_image || [];

			console.log('Passport Images:', passportFiles);
			console.log('User Images:', userImageFiles);

			if (passportFiles.length === 0) {
				passportImageError = true;
				return;
			}
			if (userImageFiles.length === 0) {
				userImageError = true;
				return;
			}
		} else {
			userData.country = selectedCountry;
		}

		const response = await data.supabase.storage.from('image').upload(`${fileName}`, imageFile!);
		userData.logo_url = response.data?.path || '';

		if (passportFiles) {
			const uploadPromises = passportFiles.map(async (passportFile) => {
				const response2 = await data.supabase.storage
					.from('image')
					.upload(passportFile.fileName, passportFile.file);

				if (response2.error) {
					console.error('Error uploading passport image:', response2.error);
					return null;
				} else {
					return response2?.data?.path;
				}
			});

			const uploadedPaths = await Promise.all(uploadPromises);
			userData.passport_image = uploadedPaths.filter((path) => path !== null);
		}

		if (userImageFiles) {
			const uploadPromises = userImageFiles.map(async (userImageFile) => {
				const response2 = await data.supabase.storage
					.from('image')
					.upload(userImageFile.fileName, userImageFile.file);

				if (response2.error) {
					console.error('Error uploading passport image:', response2.error);
					return null;
				} else {
					return response2?.data?.path;
				}
			});

			const uploadedPaths = await Promise.all(uploadPromises);
			userData.user_image = uploadedPaths.filter((path) => path !== null);
		}

		console.log(userData);

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
	let previewPassportImages: string[] = [];
	let previewUserImages: string[] = [];

	async function handleFileUploadPassportImage(e: Event) {
		currentImageFile2 = true;
		const fileInput = e.target as HTMLInputElement;
		const files = fileInput.files!;

		if (files.length > 0) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];

				const options = {
					maxSizeMB: 2,
					maxWidthOrHeight: 700,
					useWebWorker: true
				};

				try {
					const compressedFile = await imageCompression(file, options);
					const reader = new FileReader();
					reader.onloadend = () => {
						if (typeof reader.result === 'string') {
							previewPassportImages = [...previewPassportImages, reader.result];
						}
					};
					// console.log(previewPassportImages);
					reader.readAsDataURL(compressedFile);

					const randomText = getRandomTextNumber();
					const newFileName = `users/${randomText}_${compressedFile.name}`;

					passportFiles.push({
						fileName: newFileName,
						file: compressedFile
					});
					console.log('///', passportFiles);
				} catch (error) {
					console.error('Error compressing image', error);
				}
			}
		}
	}

	async function handleFileUploadUserImage(e: Event) {
		currentImageFile3 = true;
		const fileInput = e.target as HTMLInputElement;
		const files = fileInput.files!;
		if (files.length > 0) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];

				const options = {
					maxSizeMB: 2,
					maxWidthOrHeight: 700,
					useWebWorker: true
				};

				try {
					const compressedFile = await imageCompression(file, options);
					const reader = new FileReader();
					reader.onloadend = () => {
						if (typeof reader.result === 'string') {
							previewUserImages = [...previewUserImages, reader.result];
						}
					};
					// console.log(previewUserImages);
					reader.readAsDataURL(compressedFile);

					const randomText = getRandomTextNumber();
					const newFileName = `users/${randomText}_${compressedFile.name}`;

					userImageFiles.push({
						fileName: newFileName,
						file: compressedFile
					});
					console.log(userImageFiles);
				} catch (error) {
					console.error('Error compressing image', error);
				}
			}
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

	function removePassportImage(index: number, isPreview: boolean) {
		//
		if (isPreview) {
			// Remove from previewPassportImages
			previewPassportImages.splice(index, 1);

			previewPassportImages = [...previewPassportImages];

			passportFiles.splice(index, 1);
		} else {
			// Check if the image is from newly uploaded files
			const isNewlyUploadedImage = index >= userData.passport_image.length;

			if (isNewlyUploadedImage) {
				// Remove from passportFiles (newly uploaded image)
				passportFiles = [
					...passportFiles.slice(0, index - userData.passport_image.length),
					...passportFiles.slice(index - userData.passport_image.length + 1)
				];
			} else {
				// Remove from passportFiles (existing image)
				// passportFiles = [...passportFiles.slice(0, index), ...passportFiles.slice(index + 1)];
			}

			// Remove from userData.passport_image array
			userData.passport_image = [
				...userData.passport_image.slice(0, index),
				...userData.passport_image.slice(index + 1)
			];
		}
	}

	function removeUserImage(index: number, isPreview: boolean) {
		//
		if (isPreview) {
			// Remove from previewUserImages
			previewUserImages.splice(index, 1);

			previewUserImages = [...previewUserImages];

			userImageFiles.splice(index, 1);
		} else {
			// Check if the image is from newly uploaded files
			const isNewlyUploadedImage = index >= userData.user_image.length;

			if (isNewlyUploadedImage) {
				// Remove from passportFiles (newly uploaded image)
				userImageFiles = [
					...userImageFiles.slice(0, index - userData.user_image.length),
					...userImageFiles.slice(index - userData.user_image.length + 1)
				];
			} else {
				// Remove from passportFiles (existing image)
				// passportFiles = [...passportFiles.slice(0, index), ...passportFiles.slice(index + 1)];
			}

			// Remove from userData.user_image array
			userData.user_image = [
				...userData.user_image.slice(0, index),
				...userData.user_image.slice(index + 1)
			];
		}
	}
</script>

<form class="flex min-h-screen justify-center items-center w-full p-8">
	<div class="shadow-md rounded-md p-8 w-full lg:w-1/2 bg-[#f3f3f3] dark:bg-slate-600">
		<!-- show logo -->
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

			<!--  Upload Logo -->
			<div class="col-span-1">
				<Label dir={direction} for="logo_url" class="mb-2">{returnLocaleMessage('logo_url')}</Label>
				<Fileupload
					on:change={handleFileUpload}
					accept=".png,.jpg,.jpeg,.gif"
					class="w-full p-2 border rounded-md"
					placeholder="Upload"
				/>
			</div>

			{#if selectedCountry === 'Other'}
				<!-- upload passport image -->
				<div>
					<Label dir={direction} for="passport_image" class="mb-2"
						>{returnLocaleMessage('passport_image')}</Label
					>
					<input
						type="file"
						id="fileInput"
						accept=".png,.jpg,.jpeg"
						on:change={handleFileUploadPassportImage}
						class="file-input"
						multiple
					/>
					<div
						class="dropzone"
						style="background-color: {$currentMainThemeColors.backgroundColor};color: {$currentMainThemeColors.overlayBackgroundColor}"
					>
						<label
							for="fileInput"
							class="dropzone-label flex justify-center lg:text-base p-2 cursor-pointer hover:bg-gray-100"
						>
							<svg
								class="w-20 h-20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								/><g id="SVGRepo_iconCarrier">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M8 10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10V11H17C18.933 11 20.5 12.567 20.5 14.5C20.5 16.433 18.933 18 17 18H16C15.4477 18 15 18.4477 15 19C15 19.5523 15.4477 20 16 20H17C20.0376 20 22.5 17.5376 22.5 14.5C22.5 11.7793 20.5245 9.51997 17.9296 9.07824C17.4862 6.20213 15.0003 4 12 4C8.99974 4 6.51381 6.20213 6.07036 9.07824C3.47551 9.51997 1.5 11.7793 1.5 14.5C1.5 17.5376 3.96243 20 7 20H8C8.55228 20 9 19.5523 9 19C9 18.4477 8.55228 18 8 18H7C5.067 18 3.5 16.433 3.5 14.5C3.5 12.567 5.067 11 7 11H8V10ZM15.7071 13.2929L12.7071 10.2929C12.3166 9.90237 11.6834 9.90237 11.2929 10.2929L8.29289 13.2929C7.90237 13.6834 7.90237 14.3166 8.29289 14.7071C8.68342 15.0976 9.31658 15.0976 9.70711 14.7071L11 13.4142V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13.4142L14.2929 14.7071C14.6834 15.0976 15.3166 15.0976 15.7071 14.7071C16.0976 14.3166 16.0976 13.6834 15.7071 13.2929Z"
										fill="#D3D3D3"
									/>
								</g></svg
							></label
						>
					</div>
					<!-- preview passport image  -->
					<div>
						{#each previewPassportImages as uploadedFile, index}
							<div
								style="background-color: {$currentMainThemeColors.backgroundColor};color: {$currentMainThemeColors.overlayBackgroundColor}"
								class="mt-3 flex justify-between items-center p-2 rounded-lg mb-2 border"
							>
								<div>
									<img
										src={`${uploadedFile}`}
										alt="Uploaded Image"
										class="w-12 h-12 object-cover rounded-lg"
									/>
								</div>
								<div>
									<button
										class="rounded-full bg-red-600 hover:bg-red-500 text-white p-1"
										on:click={() => removePassportImage(index, true)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="w-6 h-6"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
											/>
										</svg>
									</button>
								</div>
							</div>
						{/each}
					</div>

					<div>
						{#if formSubmitted && passportImageError}
							<span class="text-red-500">{`${$LL.company_info['passport_message']()}`}</span>
						{/if}
					</div>
				</div>

				<!-- upload user image  -->
				<div>
					<Label dir={direction} for="user_image" class="mb-2"
						>{returnLocaleMessage('user_image')}</Label
					>
					<input
						type="file"
						id="userImageInput"
						accept=".png,.jpg,.jpeg"
						on:change={handleFileUploadUserImage}
						class="file-input"
						multiple
					/>

					<div
						class="dropzone"
						style="background-color: {$currentMainThemeColors.backgroundColor};color: {$currentMainThemeColors.overlayBackgroundColor}"
					>
						<label
							for="userImageInput"
							class="dropzone-label flex justify-center lg:text-base p-2 cursor-pointer hover:bg-gray-100"
						>
							<svg
								class="w-20 h-20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								/><g id="SVGRepo_iconCarrier">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M8 10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10V11H17C18.933 11 20.5 12.567 20.5 14.5C20.5 16.433 18.933 18 17 18H16C15.4477 18 15 18.4477 15 19C15 19.5523 15.4477 20 16 20H17C20.0376 20 22.5 17.5376 22.5 14.5C22.5 11.7793 20.5245 9.51997 17.9296 9.07824C17.4862 6.20213 15.0003 4 12 4C8.99974 4 6.51381 6.20213 6.07036 9.07824C3.47551 9.51997 1.5 11.7793 1.5 14.5C1.5 17.5376 3.96243 20 7 20H8C8.55228 20 9 19.5523 9 19C9 18.4477 8.55228 18 8 18H7C5.067 18 3.5 16.433 3.5 14.5C3.5 12.567 5.067 11 7 11H8V10ZM15.7071 13.2929L12.7071 10.2929C12.3166 9.90237 11.6834 9.90237 11.2929 10.2929L8.29289 13.2929C7.90237 13.6834 7.90237 14.3166 8.29289 14.7071C8.68342 15.0976 9.31658 15.0976 9.70711 14.7071L11 13.4142V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13.4142L14.2929 14.7071C14.6834 15.0976 15.3166 15.0976 15.7071 14.7071C16.0976 14.3166 16.0976 13.6834 15.7071 13.2929Z"
										fill="#D3D3D3"
									/>
								</g></svg
							></label
						>
					</div>
					<!-- preview user image  -->
					<div>
						{#each previewUserImages as uploadedFile, index}
							<div
								style="background-color: {$currentMainThemeColors.backgroundColor};color: {$currentMainThemeColors.overlayBackgroundColor}"
								class="mt-3 flex justify-between items-center p-2 rounded-lg mb-2 border"
							>
								<div>
									<img
										src={`${uploadedFile}`}
										alt="Uploaded Image"
										class="w-12 h-12 object-cover rounded-lg"
									/>
								</div>
								<div>
									<button
										class="rounded-full bg-red-600 hover:bg-red-500 text-white p-1"
										on:click={() => removeUserImage(index, true)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="w-6 h-6"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
											/>
										</svg>
									</button>
								</div>
							</div>
						{/each}
					</div>
					<div>
						{#if formSubmitted && userImageError}
							<span class="text-red-500">{`${$LL.company_info['user_message']()}`}</span>
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
					<Label dir={direction} for="otherCountry" class="mb-2"
						>{`${$LL.company_info['specific_country']()}`}</Label
					>
					<Input
						type="text"
						id="otherCountry"
						placeholder="Enter country name"
						bind:value={otherCountry}
					/>
					{#if countryError}
						<p class="text-red-500 mt-2">{countryError}</p>
					{/if}
				</div>
			{/if}
		</div>

		<!-- submit button  -->
		<div class="w-full flex justify-end">
			<Button
				on:click={submitForm}
				type="button"
				style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
				>{$LL.buttons.submit()}</Button
			>
		</div>
	</div>
</form>

<style>
	.dropzone {
		border: 2px dashed #cccccc;
		border-radius: 5px;
		text-align: center;
	}

	.file-input {
		display: none;
	}

	.dropzone-label {
		color: #333333;
		font-weight: bold;
	}
</style>
