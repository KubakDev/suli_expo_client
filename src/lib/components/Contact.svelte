<script lang="ts">
	import * as yup from 'yup';
	//@ts-ignore
	import { Form, Message } from 'svelte-yup';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import SulyButton from './sulyButton.svelte';
	import Constants from '../../utils/constants';
	import MailTemplate from './MailTemplate.svelte';
	import { currentMainThemeColors } from '../../stores/darkMode';
	import { IconMapPin, IconMail, IconPhone, IconSend } from '@tabler/icons-svelte';
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
	
	$: isRtl = $locale === 'ckb' || $locale === 'ar';
	$: buttonAlignment = isRtl ? 'flex justify-start' : 'flex justify-end';

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
		<div class="rounded-lg overflow-hidden flex flex-col lg:flex-row shadow-md" style="border: 1px solid {$currentMainThemeColors.primaryColor};color:{$currentMainThemeColors.overlayBackgroundColor};">
			<!-- Contact Info -->
			<div class={isRtl ? "lg:w-1/2 lg:order-2 relative p-2" : "lg:w-1/2 lg:order-1 relative p-2"}>
				<div class="info-card text-white h-full" style="background-color: {$currentMainThemeColors.secondaryColor};">
					<div class="corner-top" style="border-color: {$currentMainThemeColors.primaryColor} transparent transparent transparent;"></div>
					<div class="corner-bottom" style="border-color: transparent transparent {$currentMainThemeColors.primaryColor} transparent;"></div>
					
					{#if contactInfoData && contactInfoData.length > 0 && contactInfoData[0]}
						<div class="p-10 h-full flex flex-col">
							<div class="flex flex-col space-y-6">
							
								<!-- Email -->
								<div class="flex items-start gap-4">
									<IconMail
										size={24}
										stroke={2}
										color="white"
									/>
									<div class="flex flex-col">
										<span class="font-medium">{$LL.email()}</span>
										<span>{contactInfoData[0].email}</span>
									</div>
								</div>	

							
								<!-- Location -->
								<div class="flex items-start gap-4">
									<IconMapPin 
										size={24} 
										stroke={2} 
										color="white"
									/>
									<div class="flex flex-col">
										<span class="font-medium">{$LL.location()}</span>
										<span>{contactInfoData[0].location}</span>
									</div>
								</div>
							
							
								<!-- Phone -->
								<div class="flex items-start gap-4">
									<IconPhone
										size={24}
										stroke={2}
										color="white"
									/>
									<div class="flex flex-col">
										<span class="font-medium">{$LL.phone()}</span>
										<div>
											<span class="font-medium">{$LL.marketing()}: </span>
											<span>
												{#if isRtl}
													{contactInfoData[0]?.phoneNumber_marketing}+
												{:else}
													+{contactInfoData[0]?.phoneNumber_marketing}
												{/if}
											</span>
										</div>
										
										<div>
											<span class="font-medium">{$LL.relations()}: </span>
											<span>
												{#if isRtl}
													{contactInfoData[0]?.phoneNumber_relations}+
												{:else}
													+{contactInfoData[0]?.phoneNumber_relations}
												{/if}
											</span>
										</div>
										
										<div>
											<span class="font-medium">{$LL.technical()}: </span>
											<span>
												{#if isRtl}
													{contactInfoData[0]?.phoneNumber_Technical}+
												{:else}
													+{contactInfoData[0]?.phoneNumber_Technical}
												{/if}
											</span>
										</div>
										
										<div>
											<span class="font-medium">{$LL.administration()}: </span>
											<span>
												{#if isRtl}
													{contactInfoData[0]?.phoneNumber_Administration}+
												{:else}
													+{contactInfoData[0]?.phoneNumber_Administration}
												{/if}
											</span>
										</div>
									</div>
								</div>
								
							
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Feedback Form -->
			<div class={isRtl ? "p-8 lg:w-1/2 lg:order-1 relative form-card" : "p-8 lg:w-1/2 lg:order-2 relative form-card"} style="background-color: {$currentMainThemeColors.backgroundColor};">
				<div class="corner-top-right" style="border-color: transparent {$currentMainThemeColors.primaryColor} transparent transparent;"></div>
				<div class="corner-bottom-left" style="border-color: transparent transparent transparent {$currentMainThemeColors.primaryColor};"></div>
				
				<h2 class={isRtl ? "text-lg mb-6 font-medium title-font text-right" : "text-lg mb-6 font-medium title-font text-left"}>
					{$LL.feedback()}
				</h2>

				<Form dir={isRtl ? 'rtl' : 'ltr'} class="form" {schema} {fields} submitHandler={formSubmit} {submitted}>
					<div class="relative mb-4">
						<label for="name" class={isRtl ? "block text-sm font-medium mb-1 text-right" : "block text-sm font-medium mb-1 text-left"}>
							{#if isRtl}
								{$LL.name()} <span class="text-red-500">*</span>
							{:else}
								<span class="text-red-500">*</span> {$LL.name()}
							{/if}
						</label>
						<input
							bind:value={fields.name}
							placeholder={isRtl ? $LL.name() : "Your Name"}
							type="text"
							id="name"
							class="w-full rounded focus:outline-none text-base text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
							style="border: 1px solid {$currentMainThemeColors.primaryColor};"
						/><Message name="name" />
					</div>
					<div class="relative mb-4">
						<label for="email" class={isRtl ? "block text-sm font-medium mb-1 text-right" : "block text-sm font-medium mb-1 text-left"}>
							{#if isRtl}
								{$LL.email()} <span class="text-red-500">*</span>
							{:else}
								<span class="text-red-500">*</span> {$LL.email()}
							{/if}
						</label>
						<input
							bind:value={fields.email}
							placeholder={isRtl ? $LL.email() : "Your Email"}
							type="text"
							id="email"
							class="w-full rounded focus:outline-none text-base text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
							style="border: 1px solid {$currentMainThemeColors.primaryColor};"
						/><Message name="email" />
					</div>
					<div class="relative mb-4">
						<label for="message" class={isRtl ? "block text-sm font-medium mb-1 text-right" : "block text-sm font-medium mb-1 text-left"}>
							{#if isRtl}
								{$LL.message()} <span class="text-red-500">*</span>
							{:else}
								<span class="text-red-500">*</span> {$LL.message()}
							{/if}
						</label>
						<textarea
							bind:value={fields.message}
							placeholder={isRtl ? $LL.message() : "Please Enter Your Message Here..."}
							id="message"
							class="w-full rounded focus:outline-none h-32 text-base text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
							style="border: 1px solid {$currentMainThemeColors.primaryColor};"
						/><Message name="message" />
					</div>
					<div class={buttonAlignment}>
						<button 
							dir={isRtl ? "rtl" : "ltr"}
							on:click={formSubmit} 
							class="send-button" 
							style="background-color: {$currentMainThemeColors.primaryColor};"
						>
							{#if isRtl}
							{$LL.send() || "Send"}
							<IconSend size={18} class="mx-2" />
							{:else}
								{$LL.send() || "Send"}
								<IconSend size={18} class="mx-2" />
							{/if}
						</button>
					</div>
				</Form>
			</div>
		</div>
	</div>
</section>

<style>
	.info-card {
		position: relative;
		overflow: hidden;
		height: 100%;
	}
	
	.form-card {
		position: relative;
		overflow: hidden;
		height: 100%;
	}
	
	.corner-top {
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 50px 50px 0 0;
		z-index: 2;
	}
	
	.corner-bottom {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 0 50px 50px;
		z-index: 2;
	}
	
	.corner-top-right {
		position: absolute;
		top: 0;
		right: 0;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 50px 50px 0;
		z-index: 2;
	}
	
	.corner-bottom-left {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 50px 0 0 50px;
		z-index: 2;
	}
	
	:global(.form input:focus),
	:global(.form textarea:focus) {
		box-shadow: none;
		border-color: var(--lightPrimaryColor) !important;
	}
	
	:global(.form input),
	:global(.form textarea) {
		background-color: white;
	}
	
	.send-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1.25rem;
		border-radius: 0.25rem;
		color: white;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.3s ease;
	}
	
	.send-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}
	
	@media (max-width: 768px) {
		.corner-top,
		.corner-bottom,
		.corner-top-right,
		.corner-bottom-left {
			border-width: 30px 30px 0 0;
		}
		
		.corner-bottom {
			border-width: 0 0 30px 30px;
		}
		
		.corner-top-right {
			border-width: 0 30px 30px 0;
		}
		
		.corner-bottom-left {
			border-width: 30px 0 0 30px;
		}
	}
</style>
