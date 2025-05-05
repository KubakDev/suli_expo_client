<script lang="ts">
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import type { ContactInfoModel } from '../../models/contactInfo';
	import { currentMainThemeColors } from '../../stores/darkMode';
	import { IconMapPin, IconMail, IconPhone } from '@tabler/icons-svelte';

	export let contactInfoSection: ContactInfoModel;

	function formatPhoneNumber(phoneNumber: string): string {
		return phoneNumber.slice(0, 4) + '-' + phoneNumber.slice(4, 7) + '-' + phoneNumber.slice(7);
	}
</script>

<div class="flex flex-col items-center justify-start gap-2 lg:gap-5">
	<IconMapPin 
		size={60} 
		stroke={2} 
		color={$currentMainThemeColors.overlaySecondaryColor}
	/>
	<span class="w-44 text-center leading-8 text-lightBackgroundColor dark:text-darkBackgroundColor"
		>{contactInfoSection.location}</span
	>
</div>
<div class="flex flex-col items-center justify-start gap-2 lg:gap-5">
	<IconMail
		size={60}
		stroke={2}
		color={$currentMainThemeColors.overlaySecondaryColor}
	/>
	<span class="text-lightBackgroundColor dark:text-darkBackgroundColor"
		>{contactInfoSection.email}</span
	>
</div>
<div class="flex flex-col items-center justify-start gap-2 lg:gap-5">
	<IconPhone
		size={60}
		stroke={2}
		color={$currentMainThemeColors.overlaySecondaryColor}
	/>
	<div class="flex flex-col justify-center items-center gap-2 w-full">
		<span class="flex justify-evenly text-lightBackgroundColor dark:text-darkBackgroundColor">
			<div class="flex px-2">
				{$LL.marketing()} :
			</div>

			{#if $locale === 'ckb' || $locale === 'ar'}
				{contactInfoSection?.phoneNumber_marketing}+
			{:else}
				+{contactInfoSection?.phoneNumber_marketing}
			{/if}
		</span>

		<span class="flex justify-evenly text-lightBackgroundColor dark:text-darkBackgroundColor">
			<div class="flex px-2">
				{$LL.relations()} :
			</div>

			{#if $locale === 'ckb' || $locale === 'ar'}
				{contactInfoSection?.phoneNumber_relations}+
			{:else}
				+{contactInfoSection?.phoneNumber_relations}
			{/if}
		</span>

		<span class="flex justify-evenly text-lightBackgroundColor dark:text-darkBackgroundColor">
			<div class="flex px-2">
				{$LL.technical()} :
			</div>
			{#if $locale === 'ckb' || $locale === 'ar'}
				{contactInfoSection?.phoneNumber_Technical}+
			{:else}
				+{contactInfoSection?.phoneNumber_Technical}
			{/if}
		</span>

		<span class="flex justify-evenly text-lightBackgroundColor dark:text-darkBackgroundColor">
			<div class="flex px-2">
				{$LL.administration()} :
			</div>
			{#if $locale === 'ckb' || $locale === 'ar'}
				{contactInfoSection?.phoneNumber_Administration}+
			{:else}
				+{contactInfoSection?.phoneNumber_Administration}
			{/if}
		</span>
	</div>
</div>
