<script lang="ts">
	import { countries } from '../../lib/utils/countries';
	//@ts-ignore
   import { v4 as uuidv4 } from 'uuid';
   //@ts-ignore
	import QRCode from 'qrcode';
	import type { PageData } from '../$types';
	import { getRandomTextNumber } from '../../utils/getRandomText';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import { currentMainThemeColors } from '../../stores/darkMode';
	import { onMount } from 'svelte';
	import { profileStore } from '../../stores/userStore';
 
	
	let name = '';
	let companyName = '';
	let fieldWork = '';
	let jobGrade = '';
	let phoneNumber = '';
	let email = '';
	let country = '';
	let city = '';
	let hotelBooking = 'No';
	let message = '';
	let isLoading = false;
	let isLoadingForm = false;
	let showDialog = false;
	let dialogMessage = '';
	
	// Field visibility configuration
	let formFieldsConfig = {
		name: true,
		companyName: true,
		fieldWork: true,
		jobGrade: true,
		phoneNumber: true,
		email: true,
		country: true,
		city: true,
		hotelBooking: true
	};
	
	// Field requirement configuration (true = required)
	let fieldRequiredConfig = {
		name: true,
		companyName: true,
		fieldWork: true,
		jobGrade: true,
		phoneNumber: true,
		email: true,
		country: true,
		city: true,
		hotelBooking: true
	};

	export let data: PageData;
	const userPageUrl: string = import.meta.env.VITE_BASE_URL;

	function isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}


    // Generate a random number between 1 and 10^15 to ensure complexity
function generateComplexNumericId() {
    return Math.floor(Math.random() * 1e15);
}

async function handleSubmit() {
    isLoading = true;
    isLoadingForm = true;

    if (formFieldsConfig.email && fieldRequiredConfig.email && !isValidEmail(email)) {
        dialogMessage = `${$LL.registrationForm.invalidEmail()}`;
        showDialog = true;
        isLoading = false;
        isLoadingForm = false;
        return;
    }

    try {
        // Check if the email already exists in the database
        if (formFieldsConfig.email) {
            const emailCheckResponse = await data.supabase
                .from('UserRegistration')
                .select('*')
                .eq('email', email);

            if (emailCheckResponse.data && emailCheckResponse.data.length > 0) {
                // Email already exists
                dialogMessage = `${$LL.registrationForm.existEmail()}`;
                showDialog = true;
                isLoading = false;
                isLoadingForm = false;
                return;
            }
        }

        // Generate a complex numeric ID
        const uniqueId = generateComplexNumericId();

        // Create an object with only the fields that are configured to show
        const formData: any = { id: uniqueId };
        
        if (formFieldsConfig.name) formData.name = name;
        if (formFieldsConfig.companyName) formData.companyName = companyName;
        if (formFieldsConfig.fieldWork) formData.fieldWork = fieldWork;
        if (formFieldsConfig.jobGrade) formData.jobGrade = jobGrade;
        if (formFieldsConfig.phoneNumber) formData.phoneNumber = phoneNumber;
        if (formFieldsConfig.email) formData.email = email;
        if (formFieldsConfig.country) formData.country = country;
        if (formFieldsConfig.city) formData.city = city;
        if (formFieldsConfig.hotelBooking) formData.hotelBooking = hotelBooking;

        // Inserting data
        const insertResponse = await data.supabase.from('UserRegistration').insert(formData);

        if (insertResponse.error) {
            throw new Error(`Insert operation failed: ${insertResponse.error.message}`);
        }

        const qrCodeUrl = `${userPageUrl}/form/${uniqueId}`;
        const qrCode = await QRCode.toDataURL(qrCodeUrl);

        // Convert the QR code data URL to a blob
        const qrCodeBlob = await fetch(qrCode).then((res) => res.blob());
        const fileName = `QR/${getRandomTextNumber()}.png`;

        // Upload the QR code to Supabase storage
        const uploadResponse = await data.supabase.storage
            .from('image')
            .upload(fileName, qrCodeBlob, {
                contentType: 'image/png'
            });

        if (uploadResponse.error) {
            throw new Error(`Upload operation failed: ${uploadResponse.error.message}`);
        }

        // Fetch the public URL of the uploaded QR code
        const { publicUrl } = data.supabase.storage.from('image').getPublicUrl(fileName).data;

        // Sending email
        const emailSent = formFieldsConfig.email ? await sendEmailWithQRCode(email, publicUrl) : true;

        if (emailSent) {
            dialogMessage = `${$LL.registrationForm.insertData()}`;
            showDialog = true;
            resetForm();
        } else {
            dialogMessage = `${$LL.registrationForm.emailFailureMessage()}`;
            showDialog = true;
        }
    } catch (error) {
        console.error('Error occurred:', error);
        dialogMessage = `${$LL.registrationForm.failureMessage()}`;
        showDialog = true;
    } finally {
        isLoading = false;
        isLoadingForm = false;
    }
}


	async function sendEmailWithQRCode(email: string, qrCodeUrl: string) {
		try {
			const response = await fetch('/api/form/email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, qrCode: qrCodeUrl })
			});

			const resultText = await response.text();
			try {
				const result = JSON.parse(resultText);

				if (!response.ok) {
					console.error('Email sending failed:', result.error);
					return false;
				}
				return true;
			} catch (jsonError) {
				console.error('Failed to parse JSON:', resultText);
				return false;
			}
		} catch (error) {
			console.error('Error sending email:', error);
			return false;
		}
	}

	function resetForm() {
		if (formFieldsConfig.name) name = '';
		if (formFieldsConfig.companyName) companyName = '';
		if (formFieldsConfig.fieldWork) fieldWork = '';
		if (formFieldsConfig.jobGrade) jobGrade = '';
		if (formFieldsConfig.phoneNumber) phoneNumber = '';
		if (formFieldsConfig.email) email = '';
		if (formFieldsConfig.country) country = '';
		if (formFieldsConfig.city) city = '';
		if (formFieldsConfig.hotelBooking) hotelBooking = 'No';
	}

	let direction = 'ltr';
	$: if ($locale === 'ckb' || $locale === 'ar') direction = 'rtl';

	///////// get required fields from db  ////////
	let profiles: any[] = [];

	onMount(async () => {
		const userData = await profileStore.get(data.supabase);
		if (userData) {
			profiles = userData;
			
			// Parse the showFields configuration if available
			if (profiles[0]?.showFields) {
				try {
					const showFieldsConfig = JSON.parse(profiles[0].showFields);
					formFieldsConfig = { ...formFieldsConfig, ...showFieldsConfig };
				} catch (error) {
					console.error('Error parsing showFields:', error);
				}
			}
			
			// Extract field requirement values
			if (profiles[0]) {
				const profile = profiles[0];
				fieldRequiredConfig = {
					name: profile.name === "true",
					companyName: profile.companyName === "true",
					fieldWork: profile.fieldWork === "true",
					jobGrade: profile.jobGrade === "true",
					phoneNumber: profile.phoneNumber === "true",
					email: profile.email === "true",
					country: profile.country === "true",
					city: profile.city === "true",
					hotelBooking: profile.hotelBooking === "true"
				};
			}
		}
	});

	$: profiles;
	$: userTitle = profiles[0]?.title ? JSON.parse(profiles[0].title)[$locale] : '';
</script>

<section class="bg-gray-200 w-full min-h-screen flex items-center justify-center">
	<main class="flex items-center justify-center max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
		<div class="bg-white p-12 rounded-lg shadow-md w-full">
			<h1 class="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
				{$LL.registrationForm.title()}
				{userTitle}
			</h1>

			<p class="mt-4 leading-relaxed text-gray-500 text-lg text-center">
				{$LL.registrationForm.subtitle()}
			</p>
			{#if isLoadingForm}
				<div class="flex justify-center items-center mt-8">
					<svg
						class="animate-spin h-8 w-8 text-gray-600"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						/>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.042.746 3.904 1.971 5.364l2.029-2.073z"
						/>
					</svg>
				</div>
			{:else}
				<form
					action="#"
					class="mt-8 grid grid-cols-6 gap-6"
					dir="ltr"
					on:submit|preventDefault={handleSubmit}
				>
					{#if formFieldsConfig.name}
					<div class="col-span-6 md:col-span-3" style="direction: {direction};">
						<label for="name" class="block text-sm font-medium text-gray-700">
							{$LL.registrationForm.userName()} {fieldRequiredConfig.name ? '*' : ''}
						</label>
						<input
							type="text"
							id="name"
							bind:value={name}
							class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
							required={fieldRequiredConfig.name}
						/>
					</div>
					{/if}
					
					{#if formFieldsConfig.email}
					<div class="col-span-6 md:col-span-3" style="direction: {direction};">
						<label for="email" class="block text-sm font-medium text-gray-700">
							{$LL.registrationForm.email()} {fieldRequiredConfig.email ? '*' : ''}
						</label>
						<input
							type="text"
							id="email"
							bind:value={email}
							class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
							required={fieldRequiredConfig.email}
						/>
					</div>
					{/if}
					
					{#if formFieldsConfig.companyName}
					<div class="col-span-6 md:col-span-3" style="direction: {direction};">
						<label for="companyName" class="block text-sm font-medium text-gray-700">
							{$LL.registrationForm.companyName()} {fieldRequiredConfig.companyName ? '*' : ''}
						</label>
						<input
							type="text"
							id="companyName"
							bind:value={companyName}
							class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
							required={fieldRequiredConfig.companyName}
						/>
					</div>
					{/if}
					
					{#if formFieldsConfig.fieldWork}
					<div class="col-span-6 md:col-span-3" style="direction: {direction};">
						<label for="fieldWork" class="block text-sm font-medium text-gray-700">
							{$LL.registrationForm.fieldWork()} {fieldRequiredConfig.fieldWork ? '*' : ''}
						</label>
						<input
							type="text"
							id="fieldWork"
							bind:value={fieldWork}
							class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
							required={fieldRequiredConfig.fieldWork}
						/>
					</div>
					{/if}
					
					{#if formFieldsConfig.jobGrade}
					<div class="col-span-6 md:col-span-3" style="direction: {direction};">
						<label for="jobGrade" class="block text-sm font-medium text-gray-700">
							{$LL.registrationForm.jobGrade()} {fieldRequiredConfig.jobGrade ? '*' : ''}
						</label>
						<input
							type="text"
							id="jobGrade"
							bind:value={jobGrade}
							class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
							required={fieldRequiredConfig.jobGrade}
						/>
					</div>
					{/if}
					
					{#if formFieldsConfig.phoneNumber}
					<div class="col-span-6 md:col-span-3" style="direction: {direction};">
						<label for="phoneNumber" class="block text-sm font-medium text-gray-700">
							{$LL.registrationForm.phoneNumber()} {fieldRequiredConfig.phoneNumber ? '*' : ''}
						</label>
						<input
							type="text"
							id="phoneNumber"
							bind:value={phoneNumber}
							class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
							required={fieldRequiredConfig.phoneNumber}
						/>
					</div>
					{/if}
					
					{#if formFieldsConfig.hotelBooking}
					<div class="col-span-6 md:col-span-3" style="direction: {direction};">
						<label for="hotelBooking" class="block text-sm font-medium text-gray-700">
							{$LL.registrationForm.hotelBooking()} {fieldRequiredConfig.hotelBooking ? '*' : ''}
						</label>
						<select
							id="hotelBooking"
							bind:value={hotelBooking}
							class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
							required={fieldRequiredConfig.hotelBooking}
						>
							<option value="No">No</option>
							<option value="Yes">Yes</option>
						</select>
					</div>
					{/if}
					
					{#if formFieldsConfig.country}
					<div class="col-span-6 md:col-span-3" style="direction: {direction};">
						<label for="country" class="block text-sm font-medium text-gray-700">
							{$LL.registrationForm.country()} {fieldRequiredConfig.country ? '*' : ''}
						</label>
						<select
							id="country"
							bind:value={country}
							class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
							required={fieldRequiredConfig.country}
						>
							<option value="" disabled>Select your country</option>
							{#each countries as country}
								<option value={country}>{country}</option>
							{/each}
						</select>
					</div>
					{/if}
					
					{#if formFieldsConfig.city}
					<div class="col-span-6 md:col-span-3" style="direction: {direction};">
						<label for="city" class="block text-sm font-medium text-gray-700">
							{$LL.registrationForm.city()} {fieldRequiredConfig.city ? '*' : ''}
						</label>
						<input
							type="text"
							id="city"
							bind:value={city}
							class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
							required={fieldRequiredConfig.city}
						/>
					</div>
					{/if}
					
					<div
						class="col-span-6 flex justify-end items-center w-full gap-4"
						style="direction: {direction};"
					>
						<button
							style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
							class="inline-block shrink-0 rounded-md border px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent focus:outline-none focus:ring"
							disabled={isLoading}
						>
							{$LL.buttons.submit()}
						</button>
					</div>
				</form>
			{/if}
			{#if showDialog}
				<div class="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
					<div class="bg-white p-8 rounded-lg shadow-lg">
						<h2 class="text-xl font-semibold mb-4">Success!</h2>
						<p>{dialogMessage}</p>
						<button
							on:click={() => (showDialog = false)}
							class="mt-4 inline-block rounded-md px-4 py-2"
							style="background-color: {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayPrimaryColor}"
						>
							Close
						</button>
					</div>
				</div>
			{/if}
		</div>
	</main>
</section>
