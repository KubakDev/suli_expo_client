<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { requiredFields, exhibitionID } from '../../../../../stores/requiredFieldStore';
	import imageCompression from 'browser-image-compression';
	import { LL } from '$lib/i18n/i18n-svelte';
	import { Button, Fileupload, Input, Label } from 'flowbite-svelte';
	import { currentUser } from '../../../../../stores/currentUser';
	import { goto } from '$app/navigation';

	export let data: any;
	let imageFile: File | undefined;
	let imageFile2: File | undefined;
	let imageFile3: File | undefined;
	let fileName: string;
	let fileName2: string;
	let fileName3: string;
	let prevLogo_url: string = '';
	let currentImageFile = false;
	let currentImageFile2 = false;
	let currentImageFile3 = false;

	const id = $page.params.userId;

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
		passport_image: '',
		user_image: '',
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
			result = fetchedData;
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
				result.logo_url = reader.result as string;
				const randomText = getRandomTextNumber();
				const newFileName = `users/${randomText}_${compressedFile.name}`;
				setImageFile(compressedFile);
				setFileName(newFileName);
			};
			reader.readAsDataURL(compressedFile);
		} catch (error) {}
	}

	export async function handleFileUpload2(e: Event) {
		currentImageFile2 = true;
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
				result.passport_image = reader.result as string;
				const randomText = getRandomTextNumber();
				const newFileName = `users/${randomText}_${compressedFile.name}`;
				setImageFile2(compressedFile);
				setFileName2(newFileName);
			};
			reader.readAsDataURL(compressedFile);
		} catch (error) {}
	}

	export async function handleFileUpload3(e: Event) {
		currentImageFile3 = true;
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
				result.passport_image = reader.result as string;
				const randomText = getRandomTextNumber();
				const newFileName = `users/${randomText}_${compressedFile.name}`;
				setImageFile3(compressedFile);
				setFileName3(newFileName);
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
	function isValid() {
		for (let field of $requiredFields) {
			if (!result[field] || result[field].trim() === '') {
				console.error(`Field ${field} is required`);
				return false;
			}
		}
		return true;
	}

	async function handleUpdate() {
		if (!isValid()) {
			console.error('All required fields must be filled!');
			return;
		}

		if (imageFile) {
			if (result.logo_url) {
				await data.supabase.storage.from('image').remove([result.logo_url]);
			}

			const response = await data.supabase.storage.from('image').upload(`${fileName}`, imageFile!);
			result.logo_url = response.data?.path || '';
		} else {
			result.logo_url = prevLogo_url;
		}

		if (imageFile2) {
			if (result.passport_image) {
				await data.supabase.storage.from('image').remove([result.passport_image]);
			}
			const response = await data.supabase.storage.from('image').upload(`${fileName}`, imageFile!);
			result.passport_image = response.data?.path || '';
		} else {
			result.passport_image = prev;
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

	let selectedCountry = 'Iraq';
</script>

<form class="flex min-h-screen justify-center items-center w-full p-8">
	<div
		class="border border-gray-200 shadow-md rounded-md p-8 w-full lg:w-1/2 bg-[#f3f3f3]"
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

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
				<Input type="email" bind:value={result.email} />
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
					{#if $requiredFields.includes('country')}<span class="text-red-500">*</span>{/if}
					<label for="countrySelect" class="mb-2">{$LL.company_info['country']()}</label>
				</div>

				<select bind:value={selectedCountry} id="countrySelect" class="border rounded p-2 mb-2">
					<option value="Iraq">Iraq</option>
					<option value="Other">Other</option>
				</select>

				{#if selectedCountry === 'Other'}
					<p class="text-gray-700">Hi</p>
				{/if}
			</div>

			{#if selectedCountry === 'Other'}
				<div>
					<div class="flex gap-2">
						{#if $requiredFields?.includes('passport_image')}<span class="text-red-500">*</span
							>{/if}
						<Label for="" class="mb-2">{`${$LL.company_info['passport_image']()}`}</Label>
					</div>

					<Fileupload
						on:change={handleFileUpload2}
						accept=".png,.jpg,.jpeg"
						class="w-full p-2 border rounded-md mb-2"
						placeholder="Upload"
					/>
				</div>

				<div>
					<div class="flex gap-2">
						{#if $requiredFields?.includes('user_image')}<span class="text-red-500">*</span>{/if}
						<Label for="" class="mb-2">{`${$LL.company_info['user_image']()}`}</Label>
					</div>

					<Fileupload
						on:change={handleFileUpload3}
						accept=".png,.jpg,.jpeg"
						class="w-full p-2 border rounded-md mb-2"
						placeholder="Upload"
					/>
				</div>
			{/if}
			<div class="w-full flex justify-end mt-10">
				<Button on:click={handleUpdate} type="button">{$LL.buttons.submit()}</Button>
			</div>
		</div>
	</div>
</form>
