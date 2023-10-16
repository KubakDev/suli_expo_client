<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { requiredFields, exhibitionID } from '../../../../../stores/requiredFieldStore';
	import imageCompression from 'browser-image-compression';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { Button, Fileupload, Input, Label } from 'flowbite-svelte';
	import { currentUser } from '../../../../../stores/currentUser';
	import { goto } from '$app/navigation';
	import { currentMainThemeColors } from '../../../../../stores/darkMode';

	export let data: any;
	let imageFile: File | undefined;
	let fileName: string;
	let passportFiles: { fileName: string; file: File }[] = [];
	let userImageFiles: { fileName: string; file: File }[] = [];
	let currentImageFile = false;
	let currentImageFile2 = false;
	let currentImageFile3 = false;

	const id = $page.params.userId;
	let selectedCountry = 'Iraq';
	let otherCountryName = '';
	let checkedCountry = false;
	let checkedUserImage = false;

	let result = {
		id: 0,
		logo_url: '',
		company_name: '',
		phone_number: '',
		type: '',
		email: '',
		working_field: '',
		manager_name: '',
		passport_number: '',
		country: '',
		address: '',
		passport_image: [],
		user_image: [],
		uid: ''
	};

	async function fetchData() {
		const { data: fetchedData, error } = await data.supabase
			.from('company')
			.select('*')
			.eq('uid', id)
			.single();
		if (error) {
			goto('/company-registration');
		} else {
			result = {
				...fetchedData,
				passport_image: fetchedData.passport_image || ([] as string[]),
				user_image: fetchedData.user_image || ([] as string[])
			};

			// check if country value exists, if not, set it to 'Iraq'
			if (!result.country || result.country.trim() === '') {
				result.country = 'Iraq';
			}

			if (result.country !== 'Iraq' && result.country !== 'Other') {
				selectedCountry = 'Other';
				otherCountryName = result.country;
			} else {
				selectedCountry = result.country;
			}
		}

		if (result.passport_image.length > 0) {
			checkedCountry = true;
		}
		if (result.user_image.length > 0) {
			checkedUserImage = true;
		}
	}

	onMount(() => {
		if (!data.session && !data.session?.user) {
			setTimeout(() => {
				goto('/login');
			}, 100);
			return;
		}
		fetchData();
	});

	async function handleFileUpload(e: Event) {
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
				result.logo_url = reader.result as string;
				const randomText = getRandomTextNumber();
				const newFileName = `users/${randomText}`;
				setImageFile(compressedFile);
				setFileName(newFileName);
			};
			reader.readAsDataURL(compressedFile);
		} catch (error) {
			error;
		}
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
					// (previewPassportImages);
					reader.readAsDataURL(compressedFile);

					const randomText = getRandomTextNumber();
					const newFileName = `users/${randomText}`;

					passportFiles.push({
						fileName: newFileName,
						file: compressedFile
					});
					passportFiles;
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
					// (previewUserImages);
					reader.readAsDataURL(compressedFile);

					const randomText = getRandomTextNumber();
					const newFileName = `users/${randomText}`;

					userImageFiles.push({
						fileName: newFileName,
						file: compressedFile
					});
				} catch (error) {
					console.error('Error compressing image', error);
				}
			}
		}
	}

	// generate random number before image URl
	function getRandomTextNumber() {
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

	function isValid() {
		for (let field of $requiredFields) {
			if (!result[field] || result[field].trim() === '') {
				return false;
			}
		}
		return true;
	}
	let passportImageError = false;
	let userImageError = false;
	let countryError = '';

	async function handleUpdate() {
		if (selectedCountry === 'Other') {
			if (!otherCountryName.trim()) {
				countryError = `${$LL.company_info['specific_country_message']()}`;
				return;
			}

			if (!currentImageFile2 && result.passport_image.length === 0) {
				passportImageError = true;
			} else {
				passportImageError = false;
			}

			if (!currentImageFile3 && result.user_image.length === 0) {
				userImageError = true;
			} else {
				userImageError = false;
			}

			if (!result.user_image) {
				userImageError = true;
			}
			if (!result.passport_image) {
				passportImageError = true;
			}
			if (passportImageError || userImageError) {
				return;
			}
		}

		if (!isValid()) {
			return;
		}

		if (imageFile) {
			const response = await data.supabase.storage.from('image').upload(`${fileName}`, imageFile!);
			result.logo_url = response.data?.path || '';
		}

		if (passportFiles) {
			for (let passportFile of passportFiles) {
				const response2 = await data.supabase.storage
					.from('image')
					.upload(passportFile.fileName, passportFile.file);
				// (response2.data.path);
				if (response2.data) {
					result.passport_image.push(response2?.data?.path);
				}
				if (response2.error) {
					console.error('Error uploading passport image:', response2.error);
				} else {
					// result.passport_image.push(response2.data?.path || '');
				}
			}
		}

		if (userImageFiles) {
			for (let userImageFile of userImageFiles) {
				const response2 = await data.supabase.storage
					.from('image')
					.upload(userImageFile.fileName, userImageFile.file);
				if (response2.data) {
					result.user_image.push(response2?.data?.path);
				}
				if (response2.error) {
					console.error('Error uploading passport image:', response2.error);
				} else {
					// result.passport_image.push(response2.data?.path || '');
				}
			}
		}

		if (selectedCountry === 'Other') {
			result.country = otherCountryName;
		} else {
			result.country = selectedCountry;
		}

		if (selectedCountry === 'Iraq') {
			result.passport_image = [];
			result.user_image = [];
		}

		await data.supabase
			.from('company')
			.update({
				id: result?.id,
				company_name: result?.company_name,
				logo_url: result?.logo_url,
				phone_number: result?.phone_number,
				email: result?.email,
				working_field: result?.working_field,
				manager_name: result?.manager_name,
				passport_number: result?.passport_number,
				country: result?.country,
				address: result?.address,
				passport_image: result?.passport_image,
				user_image: result?.user_image,
				uid: result?.uid
			})
			.eq('id', result?.id)
			.select()
			.single()
			.then((response: any) => {
				if (response.error) return;
				currentUser.set(response.data);
				goto(`/exhibition/reserve/${$exhibitionID}`);
			});
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
			const isNewlyUploadedImage = index >= result.passport_image.length;

			if (isNewlyUploadedImage) {
				// Remove from passportFiles (newly uploaded image)
				passportFiles = [
					...passportFiles.slice(0, index - result.passport_image.length),
					...passportFiles.slice(index - result.passport_image.length + 1)
				];
			} else {
				// Remove from passportFiles (existing image)
				// passportFiles = [...passportFiles.slice(0, index), ...passportFiles.slice(index + 1)];
			}

			// Remove from result.passport_image array
			result.passport_image = [
				...result.passport_image.slice(0, index),
				...result.passport_image.slice(index + 1)
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
			const isNewlyUploadedImage = index >= result.user_image.length;

			if (isNewlyUploadedImage) {
				// Remove from passportFiles (newly uploaded image)
				userImageFiles = [
					...userImageFiles.slice(0, index - result.user_image.length),
					...userImageFiles.slice(index - result.user_image.length + 1)
				];
			} else {
				// Remove from passportFiles (existing image)
				// passportFiles = [...passportFiles.slice(0, index), ...passportFiles.slice(index + 1)];
			}

			// Remove from result.user_image array
			result.user_image = [
				...result.user_image.slice(0, index),
				...result.user_image.slice(index + 1)
			];
		}
	}
</script>

<form class="flex min-h-screen justify-center items-center w-full p-8">
	<div
		class="border 200 shadow-md rounded-md p-8 w-full lg:w-1/2 bg-[#f3f3f3] dark:bg-slate-600"
		style="background-color: var(secondaryColor);"
	>
		<div class="flex justify-center items-center pb-10">
			<img
				src={currentImageFile
					? result.logo_url
					: `${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${result?.logo_url}`}
				alt="logo"
				class="w-44 h-44 rounded-full border bg-white"
			/>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<div>
				<div class="flex gap-2">
					{#if $requiredFields?.includes('logo_url')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['logo_url']()}`}</Label>
				</div>
				<Fileupload
					on:change={handleFileUpload}
					accept=".png,.jpg,.jpeg,.gif"
					class="w-full p-2 border rounded-md mb-2"
					placeholder="Upload"
				/>
			</div>
			<div>
				<div class="flex gap-2">
					{#if $requiredFields?.includes('phone_number')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['phone_number']()}`}</Label>
				</div>
				<Input type="text" bind:value={result.phone_number} />
			</div>

			<div>
				<div class="flex gap-2">
					{#if $requiredFields?.includes('company_name')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['company_name']()}`}</Label>
				</div>
				<Input type="text" bind:value={result.company_name} />
			</div>
			<div>
				<div class="flex gap-2">
					{#if $requiredFields?.includes('email')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['email']()}`}</Label>
				</div>
				<Input type="email" bind:value={result.email} disabled />
			</div>

			<div>
				<div class="flex gap-2">
					{#if $requiredFields?.includes('working_field')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['working_field']()}`}</Label>
				</div>
				<Input type="text" bind:value={result.working_field} />
			</div>
			<div>
				<div class="flex gap-2">
					{#if $requiredFields?.includes('manager_name')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['manager_name']()}`}</Label>
				</div>
				<Input type="text" bind:value={result.manager_name} />
			</div>

			<div>
				<div class="flex gap-2">
					{#if $requiredFields?.includes('passport_number')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['passport_number']()}`}</Label>
				</div>

				<Input type="text" bind:value={result.passport_number} />
			</div>
			<div>
				<div class="flex gap-2">
					{#if $requiredFields?.includes('address')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['address']()}`}</Label>
				</div>

				<Input type="text" bind:value={result.address} />
			</div>

			<div>
				<div class="flex">
					{#if $requiredFields.includes('country')}<span class="text-red-500">*</span>{/if}
					<div class="w-full">
						<Label for="" class="mb-3 ml-2">{$LL.company_info['country']()}</Label>
						<select
							bind:value={selectedCountry}
							id="countrySelect"
							class=" block w-full disabled:cursor-not-allowed disabled:opacity-50 -mt-2 p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 text-sm rounded-lg"
						>
							<option value="Iraq">Iraq</option>
							<option value="Other">Other</option>
						</select>
					</div>
				</div>
			</div>
			<div>
				{#if selectedCountry === 'Other'}
					<div class="flex gap-2">
						{#if $requiredFields.includes('country')}<span class="text-red-500">*</span>{/if}
						<label for="countrySelect" class="mb-3"
							>{`${$LL.company_info['specific_country']()}`}</label
						>
					</div>
					<Input
						class="-mt-2"
						type="text"
						bind:value={otherCountryName}
						placeholder="Enter your country"
					/>

					{#if countryError}
						<p class="text-red-500 mt-2">{countryError}</p>
					{/if}
				{/if}
			</div>

			{#if selectedCountry === 'Other'}
				<!-- upload passport image  -->
				<div class="">
					<div class="flex gap-2">
						{#if $requiredFields?.includes('passport_image')}<span class="text-red-500">*</span
							>{/if}
						<Label for="" class="mb-2">{`${$LL.company_info['passport_image']()}`}</Label>
					</div>
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

					<div>
						{#if passportImageError}
							<span class="text-red-500">Passport image is required</span>
						{/if}
					</div>

					{#if passportFiles.length > 0 || result.passport_image.length > 0 || previewPassportImages.length > 0}
						<div class="mt-4">
							{#if checkedCountry}
								{#each result.passport_image as image, index}
									<div
										style="background-color: {$currentMainThemeColors.backgroundColor};color: {$currentMainThemeColors.overlayBackgroundColor}"
										class="flex justify-between items-center p-2 rounded-lg mb-2 border"
									>
										<div>
											<img
												src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${image}`}
												alt="Image"
												class="w-12 h-12 object-cover rounded-lg"
											/>
										</div>
										<div>
											<button
												class="rounded-full bg-red-600 hover:bg-red-500 text-white p-1"
												on:click={() => removePassportImage(index, false)}
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
							{/if}

							{#each previewPassportImages as uploadedFile, index}
								<div
									style="background-color: {$currentMainThemeColors.backgroundColor};color: {$currentMainThemeColors.overlayBackgroundColor}"
									class="flex justify-between items-center p-2 rounded-lg mb-2 border"
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
					{/if}
				</div>

				<!-- upload user image  -->
				<div class="">
					<div class="flex gap-2">
						{#if $requiredFields?.includes('user_image')}<span class="text-red-500">*</span>{/if}
						<Label for="userImageInput" class="mb-2">{`${$LL.company_info['user_image']()}`}</Label>
					</div>
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

					<div>
						{#if userImageError}
							<span class="text-red-500">User image is required </span>
						{/if}
					</div>

					{#if userImageFiles.length > 0 || result.user_image.length > 0 || previewUserImages.length > 0}
						<div class="mt-4">
							{#if checkedUserImage}
								{#each result.user_image as image, index}
									<div
										style="background-color: {$currentMainThemeColors.backgroundColor};color: {$currentMainThemeColors.overlayBackgroundColor}"
										class="flex justify-between items-center p-2 rounded-lg mb-2 border"
									>
										<div>
											<img
												src={`${import.meta.env.VITE_PUBLIC_SUPABASE_STORAGE_URL}/${image}`}
												alt="Image"
												class="w-12 h-12 object-cover rounded-lg"
											/>
										</div>
										<div>
											<button
												class="rounded-full bg-red-600 hover:bg-red-500 text-white p-1"
												on:click={() => removeUserImage(index, false)}
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
							{/if}

							{#each previewUserImages as uploadedFile, index}
								<div
									style="background-color: {$currentMainThemeColors.backgroundColor};color: {$currentMainThemeColors.overlayBackgroundColor}"
									class="flex justify-between items-center p-2 rounded-lg mb-2 border"
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
					{/if}
				</div>
			{/if}
		</div>
		<div class="w-full flex justify-end mt-10">
			<Button
				on:click={handleUpdate}
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
