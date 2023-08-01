<script lang="ts">
	import * as yup from 'yup';
	import { Form, Message } from 'svelte-yup';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import SulyButton from './sulyButton.svelte';
	import Constants from '../../utils/constants';

	let schema = yup.object().shape({
		name: yup.string().required().max(30).label('Name'),
		email: yup.string().required().email().label('Email address'),
		message: yup.string().required().label('Message')
	});
	let fields = { email: '', name: '', message: '' };
	let submitted = false;
	let isValid;
	let showToast = false;

	function formSubmit() {
		submitted = true;
		isValid = schema.isValidSync(fields);
		if (isValid) {
			showToast = true; // Set showToast to true to display the toast
			resetForm();
			setTimeout(() => {
				showToast = false; // Hide the toast after 1 second
			}, 1000);
		}
	}

	function resetForm() {
		submitted = false;
		fields = { email: '', name: '', message: '' };
	}
</script>

<section class="text-gray-600 body-font relative">
	{#if showToast}
		<div class="bg-green-500 text-white text-center py-2 fixed bottom-0 left-0 right-0">
			{$LL.successMessage()}
		</div>
	{/if}

	<div class="absolute inset-0 bg-gray-300">
		<iframe
			width="100%"
			height="100%"
			frameborder="0"
			marginheight="0"
			marginwidth="0"
			title="map"
			scrolling="no"
			src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103892.0992834688!2d45.2428573810063!3d35.538186962228814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x400037fb3aa6d36b%3A0x487f3331ed074305!2sSulaimaniyah%20International%20Fair!5e0!3m2!1sen!2siq!4v1685172583943!5m2!1sen!2siq"
		/>
	</div>
	<div class="container px-5 py-24 mx-auto flex">
		<div
			class="lg:w-1/3 md:w-1/2 bg-lightBackgroundColor dark:bg-darkBackgroundColor rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md"
		>
			<h2 class="text-gray-900 text-lg mb-1 font-medium title-font py-5">{$LL.feedback()}</h2>
			<!-- <p class="leading-relaxed mb-5 text-gray-600">write any text</p> -->

			<Form class="form" {schema} {fields} submitHandler={formSubmit} {submitted}>
				<div class="relative mb-4">
					<input
						bind:value={fields.name}
						placeholder="your name"
						type="text"
						id="name"
						name="name"
						class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
					/><Message name="name" />
				</div>
				<div class="relative mb-4">
					<input
						bind:value={fields.email}
						placeholder="your Email"
						type="text"
						id="email"
						name="email"
						class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
					/><Message name="email" />
				</div>
				<div class="relative mb-4">
					<textarea
						bind:value={fields.message}
						placeholder="Please enter your message here..."
						id="message"
						name="message"
						class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
					/><Message name="message" />
				</div>
				<!-- <button
					on:click|preventDefault={formSubmit}
					type="submit"
					class="bg-primary-50 text-[#E4E5D6] font-semibold py-2 px-6 focus:outline-none hover:bg-slate-50 hover:text-primary-50 rounded text-lg transition-all border"
				>
					{$LL.send()}</button
				> -->
				<SulyButton onBtnClick={formSubmit}>
					{$LL.send()}
				</SulyButton>
			</Form>
		</div>
	</div>
</section>
