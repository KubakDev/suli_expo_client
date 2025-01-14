<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { requiredFields } from '../../../../../stores/requiredFieldStore';
	import imageCompression from 'browser-image-compression';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { Button, Fileupload, Input, Label } from 'flowbite-svelte';
	import { currentUser } from '../../../../../stores/currentUser';
	import { goto } from '$app/navigation';
	import { currentMainThemeColors } from '../../../../../stores/darkMode'; 
	import { IconTrash ,IconUpload  } from '@tabler/icons-svelte';

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
		passport_image: [] as string[],
		user_image: [] as string[],
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

			if (passportImageError || userImageError) {
				alert('Passport image and user image cannot be empty.');
				return;
			}
		}

		if (!isValid()) {
			return;
		}

	if (imageFile) {
	const response = await data.supabase.storage.from('image').upload(`${fileName}`, imageFile!);
	
	if (response.error) {
		alert('An error occurred while uploading the file. Please try again.');
		return;
	}
	
	result.logo_url = response.data?.path || '';
}

		//upload passport image
		for (let passportFile of passportFiles) {
			const response = await data.supabase.storage
				.from('image')
				.upload(passportFile.fileName, passportFile.file);

			if (response.error) {
				console.error('Error uploading passport image:', response.error);
				alert('An error occurred while uploading passport images. Please try again.');
				return;
			}
			if (response.data) {
				result.passport_image.push(response.data.path);
			}
		}

		// Upload user images
		for (let userImageFile of userImageFiles) {
			const response = await data.supabase.storage
				.from('image')
				.upload(userImageFile.fileName, userImageFile.file);

			if (response.error) {
				console.error('Error uploading user image:', response.error);
				alert('An error occurred while uploading user images. Please try again.');
				return;
			}

			if (response.data) {
				result.user_image.push(response.data.path);
			}
		}

		// if (result.passport_image.length === 0 || result.user_image.length === 0) {
		// 	alert('Passport image and user image cannot be empty.');
		// 	return;
		// }

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
				 goto(`/exhibition/1`);
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
						<Label for="countrySelect" class="mb-3"
							>{`${$LL.company_info['specific_country']()}`}</Label
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
							<IconUpload size={80} color="#D3D3D3" />
						</label>
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
												<IconTrash size={24} />
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
											<IconTrash size={24} />
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
							<IconUpload size={80} color="#D3D3D3" />
						</label>
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
												<IconTrash size={24} />
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
											<IconTrash size={24} />
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
