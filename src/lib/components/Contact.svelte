<script lang="ts">
	import * as yup from 'yup';
	//@ts-ignore
	import { Form, Message } from 'svelte-yup';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import SulyButton from './sulyButton.svelte';
	import Constants from '../../utils/constants';
	import MailTemplate from './MailTemplate.svelte';
	import { currentMainThemeColors } from '../../stores/darkMode';
	import { IconMapPin, IconMail, IconPhone } from '@tabler/icons-svelte';
	import type { ContactInfoModel } from '../../models/contactInfo';

	export let contactInfoData: ContactInfoModel[] = [];

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
			showToast = true;
			sendEmail();
			resetForm();
			setTimeout(() => {
				showToast = false;
			}, 1000);
		}
	}

	function resetForm() {
		submitted = false;
		fields = { email: '', name: '', message: '' };
	}

	function sendEmail() {
		fetch('/api/contact/email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				emailUser: fields.email,
				name: fields.name,
				message: fields.message
			})
		})
			.then((res) => {
				if (res.status === 200) {
				} else {
				}
			})
			.catch((err) => {});
	}
</script>
 
<section class="body-font relative">
	{#if showToast}
		<div class="bg-green-500 text-white text-center py-2 fixed bottom-0 left-0 right-0">
			{$LL.successMessage()}
		</div>
	{/if}

	<div class="w-full h-96 mb-8">
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

	<div class="container mx-auto">
		<div
			class="rounded-lg overflow-hidden flex flex-col lg:flex-row border shadow-md"
			style="border-color: {$currentMainThemeColors.primaryColor}; color: {$currentMainThemeColors.overlayBackgroundColor}"
		>
			<!-- Feedback Form -->
			<div class="p-8 lg:w-1/2">
				<h2 class="text-lg mb-6 font-medium title-font">
					{$LL.feedback() || "Feedback"}
				</h2>

				<Form dir={$locale === 'en' ? 'ltr' : 'rtl'} class="form" {schema} {fields} submitHandler={formSubmit} {submitted}>
					<div class="relative mb-4">
						<label for="name" class="block text-sm font-medium mb-1">
							{$LL.name() || "Name"} <span class="text-red-500">*</span>
						</label>
						<input
							bind:value={fields.name}
							placeholder="Your Name"
							type="text"
							id="name"
							name="name"
							class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
						/><Message name="name" />
					</div>
					<div class="relative mb-4">
						<label for="email" class="block text-sm font-medium mb-1">
							{$LL.email() || "Email"} <span class="text-red-500">*</span>
						</label>
						<input
							bind:value={fields.email}
							placeholder="Your Email"
							type="text"
							id="email"
							name="email"
							class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
						/><Message name="email" />
					</div>
					<div class="relative mb-4">
						<label for="message" class="block text-sm font-medium mb-1">
							{$LL.message() || "Message"} <span class="text-red-500">*</span>
						</label>
						<textarea
							bind:value={fields.message}
							placeholder="Please Enter Your Message Here..."
							id="message"
							name="message"
							class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
						/><Message name="message" />
					</div>
					<div class="flex justify-end">
						<SulyButton onBtnClick={formSubmit}>
							{$LL.send() || "Send"}
						</SulyButton>
					</div>
				</Form>
			</div>
			
			<!-- Divider for desktop -->
			<div class="hidden lg:block w-px bg-gray-600 bg-opacity-30"></div>
			
			<!-- Divider for mobile -->
			<div class="lg:hidden h-px bg-gray-600 bg-opacity-30 mx-8"></div>

			<!-- Contact Info -->
			<div class="p-8 lg:w-1/2 text-sm">
				{#if contactInfoData && contactInfoData.length > 0 && contactInfoData[0]}
					<div class="flex flex-col space-y-6">
						<!-- Location -->
						<div class="flex items-start gap-4">
							<IconMapPin 
								size={24} 
								stroke={2} 
								color={$currentMainThemeColors.primaryColor}
							/>
							<div class="flex flex-col">
								<span class="font-medium">{$LL.location()}</span>
								<span>{contactInfoData[0].location}</span>
							</div>
						</div>
						
						<!-- Email -->
						<div class="flex items-start gap-4">
							<IconMail
								size={24}
								stroke={2}
								color={$currentMainThemeColors.primaryColor}
							/>
							<div class="flex flex-col">
								<span class="font-medium">{$LL.email()}</span>
								<span>{contactInfoData[0].email}</span>
							</div>
						</div>
						
						<!-- Phone Numbers -->
						<div class="flex items-start gap-4">
							<IconPhone
								size={24}
								stroke={2}
								color={$currentMainThemeColors.primaryColor}
							/>
							<div class="flex flex-col space-y-1">
								<span class="font-medium">{$LL.phone()}</span>
								<div>
									<span class="font-medium">{$LL.marketing()}: </span>
									<span>
										{#if $locale === 'ckb' || $locale === 'ar'}
											{contactInfoData[0]?.phoneNumber_marketing}+
										{:else}
											+{contactInfoData[0]?.phoneNumber_marketing}
										{/if}
									</span>
								</div>
								
								<div>
									<span class="font-medium">{$LL.relations()}: </span>
									<span>
										{#if $locale === 'ckb' || $locale === 'ar'}
											{contactInfoData[0]?.phoneNumber_relations}+
										{:else}
											+{contactInfoData[0]?.phoneNumber_relations}
										{/if}
									</span>
								</div>
								
								<div>
									<span class="font-medium">{$LL.technical()}: </span>
									<span>
										{#if $locale === 'ckb' || $locale === 'ar'}
											{contactInfoData[0]?.phoneNumber_Technical}+
										{:else}
											+{contactInfoData[0]?.phoneNumber_Technical}
										{/if}
									</span>
								</div>
								
								<div>
									<span class="font-medium">{$LL.administration()}: </span>
									<span>
										{#if $locale === 'ckb' || $locale === 'ar'}
											{contactInfoData[0]?.phoneNumber_Administration}+
										{:else}
											+{contactInfoData[0]?.phoneNumber_Administration}
										{/if}
									</span>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
