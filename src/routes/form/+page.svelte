<script lang="ts">
	import { countries } from './countries';
	import { currentMainThemeColors } from '../../stores/darkMode';
	import QRCode from 'qrcode';
	import type { PageData } from '../$types';
	import { getRandomTextNumber } from '../../utils/getRandomText';

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

	export let data: PageData;
	const userPageUrl: string = import.meta.env.VITE_BASE_URL;

	async function handleSubmit() {
		try {
			// Inserting data
			const insertResponse = await data.supabase.from('UserRegistration').insert({
				name,
				companyName,
				fieldWork,
				jobGrade,
				phoneNumber,
				email,
				country,
				city,
				hotelBooking
			});

			if (insertResponse.error) {
				throw new Error(`Insert operation failed: ${insertResponse.error.message}`);
			}

			// Fetching the inserted data using email as the identifier
			const fetchResponse = await data.supabase
				.from('UserRegistration')
				.select('*')
				.eq('email', email)
				.single();

			if (fetchResponse.error) {
				throw new Error(`Fetch operation failed: ${fetchResponse.error.message}`);
			}

			const userId = fetchResponse.data.id.toString();
			const qrCodeUrl = `${userPageUrl}/form/${userId}`;
			const qrCode = await QRCode.toDataURL(qrCodeUrl);

			// console.log('Generated QR Code:', qrCode);

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
			// console.log('QR Code Public URL:', publicUrl);

			// Sending email
			const emailSent = await sendEmailWithQRCode(email, publicUrl);

			if (emailSent) {
				message = 'Data inserted and email sent successfully';
			} else {
				message = 'Data inserted but email sending failed';
			}
		} catch (error) {
			console.error('Error occurred:', error);
			message = 'An error occurred. Data may not be inserted or email may not be sent.';
		}
	}

	async function sendEmailWithQRCode(email: string, qrCodeUrl: string) {
		// console.log('QR Code URL:////////////////////', qrCodeUrl);

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
				// console.log('Email sending result:', result);

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
</script>

<div class="md:container lg:px-5 py-10 mx-auto flex justify-center">
	<div
		class="border lg:w-2/4 md:w-2/3 sm:w-full rounded-lg p-8 flex flex-col w-full mt-10 md:mt-0 relative z-10 shadow-md"
		style="background-color: {$currentMainThemeColors.backgroundColor};"
	>
		<h2
			class="text-lg mb-1 font-semibold title-font pb-4 text-center"
			style="color: var(--currentMainThemeColors-overlayBackgroundColor);"
		>
			Registration form
		</h2>
		<form
			dir="ltr"
			class="form grid grid-cols-1 md:grid-cols-2 gap-4"
			on:submit|preventDefault={handleSubmit}
		>
			<!-- Adjusted vertical margin in fields -->
			<div class="relative mb-2">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
				<input
					type="text"
					id="name"
					bind:value={name}
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					required
				/>
			</div>
			<div class="relative mb-2">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="companyName"
					>Company Name</label
				>
				<input
					type="text"
					id="companyName"
					bind:value={companyName}
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					required
				/>
			</div>
			<div class="relative mb-2">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="fieldWork">Field Work</label>
				<input
					type="text"
					id="fieldWork"
					bind:value={fieldWork}
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					required
				/>
			</div>
			<div class="relative mb-2">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="jobGrade">Job Grade</label>
				<input
					type="text"
					id="jobGrade"
					bind:value={jobGrade}
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					required
				/>
			</div>
			<div class="relative mb-2">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="phoneNumber"
					>Phone Number</label
				>
				<input
					type="text"
					id="phoneNumber"
					bind:value={phoneNumber}
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					required
				/>
			</div>
			<div class="relative mb-2">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					required
				/>
			</div>
			<div class="relative mb-2">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="country">Country</label>
				<select
					id="country"
					bind:value={country}
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					required
				>
					<option value="" disabled>Select your country</option>
					{#each countries as country}
						<option value={country}>{country}</option>
					{/each}
				</select>
			</div>
			<div class="relative mb-2">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="city">City</label>
				<input
					type="text"
					id="city"
					bind:value={city}
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					required
				/>
			</div>
			<div class="relative mb-2">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="hotelBooking"
					>Hotel Booking</label
				>
				<select
					id="hotelBooking"
					bind:value={hotelBooking}
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					required
				>
					<option value="No">No</option>
					<option value="Yes">Yes</option>
				</select>
			</div>
			<!-- Button at the bottom right of the form -->
			<div class="col-span-full flex justify-end mt-4">
				<button
					type="submit"
					class="lg:w-32 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				>
					Submit
				</button>
			</div>
			<p class="mt-4">{message}</p>
		</form>
	</div>
</div>
