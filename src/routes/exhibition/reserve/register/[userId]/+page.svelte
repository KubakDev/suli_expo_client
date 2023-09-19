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
	let fileName: string;
	let prevLogo_url: string = '';
	let currentImageFile = false;

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
		address: '',
		uid: ''
	};

	async function fetchData() {
		const { data: fetchedData, error } = await data.supabase
			.from('company')
			.select('*')
			.eq('uid', id)
			.single();
		console.log(data);
		if (error) {
			console.error('Error fetching data:', error.message);
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

		await data.supabase
			.from('company')
			.update({
				id: result?.id,
				company_name: result?.company_name,
				logo_url: result?.logo_url,
				phone_number: result?.phone_number,
				type: result?.type,
				email: result?.email,
				working_field: result?.working_field,
				manager_name: result?.manager_name,
				passport_number: result?.passport_number,
				address: result?.address,
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
					{#if $requiredFields.includes('logo_url')}<span class="text-red-500">*</span>{/if}
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
					{#if $requiredFields.includes('phone_number')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['phone_number']()}`}</Label>
				</div>
				<Input type="text" bind:value={result.phone_number} />
			</div>

			<div>
				<div class="flex gap-2">
					{#if $requiredFields.includes('company_name')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['company_name']()}`}</Label>
				</div>
				<Input type="text" bind:value={result.company_name} />
			</div>
			<div>
				<div class="flex gap-2">
					{#if $requiredFields.includes('email')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['email']()}`}</Label>
				</div>
				<Input type="email" bind:value={result.email} />
			</div>

			<div>
				<div class="flex gap-2">
					{#if $requiredFields.includes('working_field')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['working_field']()}`}</Label>
				</div>
				<Input type="text" bind:value={result.working_field} />
			</div>
			<div>
				<div class="flex gap-2">
					{#if $requiredFields.includes('manager_name')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['manager_name']()}`}</Label>
				</div>
				<Input type="text" bind:value={result.manager_name} />
			</div>

			<div>
				<div class="flex gap-2">
					{#if $requiredFields.includes('passport_number')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['passport_number']()}`}</Label>
				</div>

				<Input type="text" bind:value={result.passport_number} />
			</div>

			<div>
				<div class="flex gap-2">
					{#if $requiredFields.includes('address')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['address']()}`}</Label>
				</div>
				<Input type="text" bind:value={result.address} />
			</div>

			<div>
				<div class="flex gap-2">
					{#if $requiredFields.includes('type')}<span class="text-red-500">*</span>{/if}
					<Label for="" class="mb-2">{`${$LL.company_info['type']()}`}</Label>
				</div>
				<Input type="text" bind:value={result.type} />
			</div>
		</div>

		<div class="w-full flex justify-end mt-2">
			<Button on:click={handleUpdate} type="button">{$LL.buttons.submit()}</Button>
		</div>
	</div>
</form>
