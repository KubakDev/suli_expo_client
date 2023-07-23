<script lang="ts">
	import TitleUi from './TitleUi.svelte';
	import { contactInfoSectionStore } from '../../stores/contactInfo';
	import { LL, locale } from '$lib/i18n/i18n-svelte';
	import SocialIcons from '@rodneylab/svelte-social-icons';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ContactInfo from './ContactInfo.svelte';
	import type { PageData } from '../../routes/$types';
	import type { SocialMediaModel } from '../../models/socialMedia';

	export let data: PageData;
	let contactInfoData: any;
	let SocialMedia: SocialMediaModel;

	$: {
		//.info('locale changed %%%%%%%%%%%%%%%%%%');
		if ($locale) {
			contactInfoData = $contactInfoSectionStore;
			//('contactInfoData', contactInfoData);
		}
	}

	onMount(async () => {
		SocialMedia = await contactInfoSectionStore.getSingle(data.supabase) as SocialMediaModel;
		console.log('contactInfoData', SocialMedia);
		
	});
</script>

<div class="py-10 px-10 border-t border-black shadow-2xl" style="background-color: var(--secondaryColor);">
	<div
		class="mx-auto
    sm:px-2 md:px-5 lg:px-7 max-w-screen-2xl"
	>
		<div class=" lg:flex lg:justify-between">
			<div class="pb-10 lg:pb-0">
				<img src="/images/logo.jpg" class="w-full h-32 object-cover p-2" alt="notFound" />
			</div>
			<div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 dark:text-white">
				<div>
					<div
						class="flex justify-start items-center uppercase mb-6 text-xs"
					>
						<TitleUi text={$LL.address()} footerSize={true} textColor="var(--overlayPrimaryColor)" />
					</div>

					<ul class="w-44 text-sm leading-6">
						{#if contactInfoData}
							{#each contactInfoData as info}
								<li style="color: var(--overlaySecondaryColor);">{info.location}</li>
							{/each}
						{/if}
					</ul>
				</div>
				<div>
					<div class="flex justify-start uppercase mb-6 text-xs text-gray-900 dark:text-white">
						<TitleUi text={$LL.contact()} footerSize={true} textColor="var(--overlayPrimaryColor)" />
					</div>
					<ul class="text-sm leading-6" style="color: var(--overlaySecondaryColor);">
						{#if contactInfoData}
							{#each contactInfoData as info}
								{#if $locale === 'ckb' || $locale === 'ar'}
									<div class="">
										<li class="">{$LL.marketing()} : {info.phoneNumber_marketing}+</li>
										<li class="">{$LL.relations()} : {info.phoneNumber_relations}+</li>
									</div>
								{:else}
									<div class="">
										<li class="">{$LL.marketing()} : +{info.phoneNumber_marketing}</li>
										<li class="">{$LL.relations()} : +{info.phoneNumber_relations}</li>
									</div>
								{/if}
							{/each}
						{/if}
					</ul>
				</div>
			</div>
		</div>
		{#if SocialMedia}
		<div class="w-full flex justify-center py-2 ">
			<div class="justify-evenly flex w-[40%] ">
				<!-- <a href="https:\\{SocialMedia.twitter_link}" target="_blank" class="cursor-pointer">
					<SocialIcons network="twitter"/>
				</a> -->
				<a href="https:\\{SocialMedia.instagram_link}" target="_blank" class="cursor-pointer">
				<SocialIcons network="instagram"/>
				</a>
				<a href="https:\\{SocialMedia.facebook_link}" target="_blank" class="cursor-pointer">
				<SocialIcons network="facebook"/>
				</a>
				<a href="https:\\{SocialMedia.linkedIn_link}" target="_blank" class="cursor-pointer">
				<SocialIcons network="linkedin"/>
				</a>
				<a href="https:\\{SocialMedia.youtube_link}" target="_blank" class="cursor-pointer">
				<SocialIcons network="youtube"/>
				</a>
			</div>
		</div>
		{/if}
		<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
		<div class="sm:flex sm:items-center sm:justify-center">
			<h3 style="color: var(--overlaySecondaryColor);">Copyright - SulyExpo ©</h3>
		</div>
	</div>
</div>
